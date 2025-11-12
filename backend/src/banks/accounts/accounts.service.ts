import {BadRequestException, Injectable} from '@nestjs/common';
import {BanksService} from "../banks.service";
import {ConsentsService} from "../consents/consents.service";
import {AccountType} from "../banks.types";
import {RedisService} from "../../redis/redis.service";
import {AccountCloseDTO, AccountDTO} from "./account.dto";
import {Consent} from "../consents/consent.entity";

@Injectable()
export class AccountsService {
    private cacheKey = "accounts";

    public constructor(private readonly banksService: BanksService, private readonly consentsService: ConsentsService, private readonly redisService: RedisService) {
    }

    public async getTotalBalance(userId: number) {
        let totalBalance = 0;

        const promises: Promise<any>[] = [];

        const banksToAccounts = await this.getAccounts(userId, true);
        for (const [bankId, accounts] of Object.entries(banksToAccounts)) {
            for (const account of accounts as any[]) {
                promises.push(this.getBalance(account.accountId, bankId, userId).then(balance => {
                    totalBalance += balance;
                }));
            }
        }

        await Promise.all(promises);

        return Math.round(totalBalance * 100) / 100;
    }

    public async getAccounts(userId: number, onlyEnabled = false) {
        const consents = await this.consentsService.getUserConsents(userId);
        const responses: Record<string, AccountType[]> = {};

        const promises: Promise<any>[] = [];
        for (const consent of consents) {
            promises.push(this.getBankAccounts(userId, consent.bankId, onlyEnabled, consent)
                .then(response => responses[consent.bankId] = response)
                .catch(err => console.error(err)));
        }

        await Promise.all(promises);

        return responses;
    }

    private async getBankAccounts(userId: number, bankId: string, onlyEnabled = false, consent?: Consent) {
        const bankConsent = consent || await this.consentsService.getUserBankConsent(bankId, userId);

        const cacheKey = `${this.cacheKey}:${bankConsent.id}:${userId}`;
        const bankAccounts = await this.banksService.requestBankAPI<{ data: { account: AccountType[] } }>(bankConsent.bankId, {
            url: `/accounts?client_id=${bankConsent.clientId}`,
            method: "GET",
            headers: {
                "X-Consent-Id": bankConsent.id,
            }
        }, cacheKey);

        return bankAccounts.data.account.filter(account => {
            return !onlyEnabled || account.status === "Enabled";
        });
    }

    public async createAccount(userId: number, bankId: string, account: AccountDTO) {
        const consent = await this.consentsService.getUserBankConsent(bankId, userId);

        const response = await this.banksService.requestBankAPI<{ data: AccountType }>(bankId, {
            url: `/accounts?client_id=${consent.clientId}`,
            method: "POST",
            headers: {
                "X-Consent-Id": consent.id,
            },
            data: {
                account_type: account.type,
                initial_balance: 0
            }
        });

        const cacheKey = `${this.cacheKey}:${consent.id}`;
        await this.redisService.invalidateCache(cacheKey, userId);

        return response.data;
    }

    public async closeAccount(userId: number, bankId: string, accountId: string, accountCloseDTO: AccountCloseDTO) {
        const consent = await this.consentsService.getUserBankConsent(bankId, userId);

        const accounts = await this.getBankAccounts(userId, bankId);

        let firstAccountId: string | null = null;
        for(const account of accounts) {
            if(account.status === "Enabled" && account.accountSubType === "Checking") {
                firstAccountId = account.accountId;
            }
        }

        if(!firstAccountId) {
            throw new BadRequestException("У вас нет подходящего счета для перевода средств");
        }

        const response = await this.banksService.requestBankAPI<{ data: AccountType }>(bankId, {
            url: `/accounts/${accountId}/close?client_id=${consent.clientId}`,
            method: "PUT",
            headers: {
                "X-Consent-Id": consent.id,
            },
            data: {
                action: accountCloseDTO.action,
                destination_account_id: firstAccountId
            }
        });

        const cacheKey = `${this.cacheKey}:${consent.id}`;
        await this.redisService.invalidateCache(cacheKey, userId);

        return response.data;
    }

    public async getBalance(accountId: string, bankId: string, userId: number) {
        const consent = await this.consentsService.getUserBankConsent(bankId, userId);

        const cacheKey = `${this.cacheKey}:${accountId}:${consent.id}:${userId}:balance`;
        const response = await this.banksService.requestBankAPI<{ data: { balance: any[] } }>(bankId, {
            url: `/accounts/${accountId}/balances`,
            method: "GET",
            headers: {
                "X-Consent-Id": consent.id,
            }
        }, cacheKey);

        for (const balance of response.data.balance) {
            if (balance.type === "InterimAvailable") {
                return Math.round(parseFloat(balance.amount.amount) * 100) / 100;
            }
        }

        return 0;
    }
}
