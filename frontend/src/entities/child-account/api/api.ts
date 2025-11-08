import { fetchMock } from "@/shared/lib/fetchMock";
import {ChildAccountType} from "@/entities/child-account";

export async function getChildAccount(): Promise<ChildAccountType> {
    return fetchMock("/api/accounts/child");
}

export async function changeLimit(limit: number): Promise<ChildAccountType> {
    return fetchMock("/api/accounts/child", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({limit}),
    });
}

export async function depositMoney(amount: number): Promise<ChildAccountType> {
    return fetchMock("/api/accounts/child/sum", {
        method: "PATCH",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({amount}),
    });
}