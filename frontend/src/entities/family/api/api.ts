import universalFetch from "@/shared/lib/universalFetch";
import {CodeData} from "@/entities/family";
import {UserType} from "@/entities/user";
import {PersonalAccountType} from "@/entities/account";
import {PersonalExpensesType} from "@/entities/transaction-category";

export async function getCode(): Promise<CodeData> {
    return universalFetch("/family/code", {
        method: "POST",
    });
}

export async function getFamily(): Promise<UserType[]> {
    return universalFetch("/family", {
        method: "GET",
    });
}

export async function leaveFamily(): Promise<void> {
    return universalFetch("/family", {
        method: "DELETE",
    });
}

export async function getFamilyFinance(): Promise<PersonalAccountType[]> {
    return universalFetch("/family/finance", {
        method: "GET",
    });
}

export async function getFamilyExpenses(): Promise<PersonalExpensesType[]> {
    return universalFetch("/family/expenses", {
        method: "GET",
    });
}