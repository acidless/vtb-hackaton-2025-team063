import {ChildAccountType} from "@/entities/child-account";
import universalFetch from "@/shared/lib/universalFetch";
import {DepositType} from "@/entities/transaction";

export async function getChildAccounts(): Promise<ChildAccountType[]> {
    return universalFetch("/child-accounts");
}

export async function createChildAccount(childAccount: FormData) {
    return universalFetch("/child-accounts", {
        method: "POST",
        body: childAccount,
    });
}

export async function deleteChildAccount(childAccountId: string) {
    return universalFetch(`/child-accounts/${childAccountId}`, {
        method: "DELETE",
    });
}

export async function changeLimit({moneyPerDay, accountId}: {
    accountId: string,
    moneyPerDay: number
}): Promise<ChildAccountType> {
    return universalFetch(`/child-accounts/${accountId}`, {
        method: "PATCH",
        body: {moneyPerDay},
    });
}

export async function depositChildAccount(data: DepositType & { entityId?: string }): Promise<ChildAccountType> {
    const body = Object.assign({}, data);
    delete body.entityId;

    return universalFetch(`/child-accounts/${data.entityId}`, {
        method: "PUT",
        body,
    });
}