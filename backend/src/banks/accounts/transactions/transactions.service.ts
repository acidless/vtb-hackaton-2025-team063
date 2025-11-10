import {Injectable} from '@nestjs/common';
import {BanksService} from "../../banks.service";
import {AccountsService} from "../accounts.service";
import {ConsentsService} from "../../consents/consents.service";
import {TransactionType} from "../../banks.types";

@Injectable()
export class TransactionsService {
    public constructor(
        private readonly banksService: BanksService,
        private readonly consentsService: ConsentsService,
        private readonly accountsService: AccountsService) {
    }

    public async getTransactions(userId: number) {
        let fromDate = new Date();
        fromDate.setMonth(fromDate.getMonth() - 1);

        const consents = await this.consentsService.getUserConsents(userId);
        const bankToConsents = Object.fromEntries(consents.map(consent => [consent.bankId, consent.id]));

        const bankAccounts = await this.accountsService.getAccounts(userId);

        const promises: Promise<any>[] = [];
        const transactions = Object.fromEntries(Object.keys(bankToConsents).map((bank) => [bank, [] as TransactionType[]]));

        for (const [bank, accounts] of Object.entries(bankAccounts) as [string, any][]) {
            for (const account of accounts) {
                promises.push(this.banksService.requestBankAPI<{ data: { transaction: TransactionType[] } }>(bank, {
                        url: `/accounts/${account.accountId}/transactions?limit=100&from_booking_date_time=${fromDate}`,
                        method: "GET",
                        headers: {
                            "X-Consent-Id": bankToConsents[bank],
                        }
                    }).then(accountTransactions => {
                        transactions[bank].push(...accountTransactions.data.transaction);
                    })
                    .catch(err => console.error(err))
                )
            }
        }

        await Promise.all(promises);

        return transactions;
    }
}
