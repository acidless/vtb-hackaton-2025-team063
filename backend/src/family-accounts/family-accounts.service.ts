import {Injectable} from '@nestjs/common';
import {FamilyService} from "../family/family.service";
import {AccountsService} from "../banks/accounts/accounts.service";

@Injectable()
export class FamilyAccountsService {
    public constructor(private readonly familyService: FamilyService, private readonly accountsService: AccountsService) {
    }

    public async getSharedBalance(userId: number) {
        let sharedBalance = 0;

        const myBalancePromise = this.accountsService.getTotalBalance(userId)
            .then((balance) => sharedBalance += balance);

        const memberPromise =
            this.familyService.getFamilyMember(userId)
                .then((member) => {
                    if (member) {
                        return this.accountsService.getTotalBalance(member.id);
                    }

                    return 0;
                })
                .then(balance => sharedBalance += balance);

        await Promise.all([myBalancePromise, memberPromise]);

        return sharedBalance;
    }
}
