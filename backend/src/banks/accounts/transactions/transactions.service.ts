import {Injectable} from '@nestjs/common';
import {BanksService} from "../../banks.service";
import {AccountsService} from "../accounts.service";
import {ConsentsService} from "../../consents/consents.service";
import {TransactionType} from "../../banks.types";
import {TransformedTransaction, TransactionsTransformer} from "./transaction.transformer";
import {RedisService} from "../../../redis/redis.service";
import {InjectRepository} from "@nestjs/typeorm";
import {Transaction} from "./transaction.entity";
import {In, Repository} from "typeorm";
import {TransactionDTO} from "./transaction.dto";
import {CategoriesConfig} from "./categories/categories.config";

@Injectable()
export class TransactionsService {
    private baseKey = "transactions";

    public constructor(
        @InjectRepository(Transaction)
        private readonly transactionRepository: Repository<Transaction>,
        private readonly banksService: BanksService,
        private readonly consentsService: ConsentsService,
        private readonly accountsService: AccountsService,
        private readonly transactionsTransformer: TransactionsTransformer,
        private readonly redisService: RedisService) {
    }

    public async getTransactions(userId: number) {
        await this.redisService.invalidateCache(this.baseKey, userId);

        return this.redisService.withCache(`${this.baseKey}:${userId}`, 300, async () => {
            const consents = await this.consentsService.getUserConsents(userId);
            const bankToConsents = Object.fromEntries(consents.map(consent => [consent.bankId, consent.id]));

            const bankAccounts = await this.accountsService.getAccounts(userId);

            const promises: Promise<any>[] = [];
            const transactions: TransformedTransaction[] = [];

            for (const [bank, accounts] of Object.entries(bankAccounts) as [string, any][]) {
                for (const account of accounts) {
                    promises.push(this.banksService.requestBankAPI<{ data: { transaction: TransactionType[] } }>(bank, {
                            url: `/accounts/${account.accountId}/transactions?limit=100`,
                            method: "GET",
                            headers: {
                                "X-Consent-Id": bankToConsents[bank],
                            }
                        }).then(async accountTransactions => {
                            const transformed = accountTransactions.data.transaction.map(t => this.transactionsTransformer.transform(t, bank));

                            transactions.push(...transformed);
                        })
                        .catch(err => console.error(err))
                    )
                }
            }

            await Promise.all(promises);

            const idToTransactions = Object.fromEntries(transactions.map(t => [t.id, t]));
            const userTransactions = await this.transactionRepository.find({where: {id: In(Object.keys(idToTransactions))}});
            for (const transaction of userTransactions) {
                idToTransactions[transaction.id].category = {
                    id: transaction.categoryId,
                    name: CategoriesConfig[transaction.categoryId].name
                };
            }

            return Object.values(idToTransactions).sort((a, b) => b.date.getTime() - a.date.getTime());
        });
    }

    public async updateTransaction(userId: number, transactionId: string, transactionDTO: TransactionDTO) {
        let transaction = await this.transactionRepository.findOne({
            where: { user: { id: userId }, id: transactionId },
        });

        if (transaction) {
            Object.assign(transaction, transactionDTO);
        } else {
            transaction = this.transactionRepository.create({
                ...transactionDTO,
                user: { id: userId },
                id: transactionId,
            });
        }

        const saved = await this.transactionRepository.save(transaction);

        await this.redisService.invalidateCache(this.baseKey, userId);

        return saved;
    }
}
