import {ChildAccountType} from "@/entities/child-account";
import {getFamilyAccounts} from "@/app/api/users/family/data";

let childAccount: ChildAccountType = {
    balance: 50000,
    moneyPerDay: 1500,
    avatar: "/images/child.png",
};

export function getChildAccount() {
    return childAccount;
}

export function changeLimit({limit}: {limit: number}) {
    childAccount.moneyPerDay = limit;
    return childAccount;
}

export function depositMoney({amount}: {amount: number}) {
    getFamilyAccounts()[1].balance -= amount;
    getFamilyAccounts()[1].expenses += amount;
    
    childAccount.balance += amount;
    return childAccount;
}
