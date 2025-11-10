import universalFetch from "@/shared/lib/universalFetch";
import {CodeData} from "@/entities/family";
import {UserType} from "@/entities/user";
import {PersonalAccountType} from "@/entities/account";

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

export async function getFamilyFinance(): Promise<PersonalAccountType[]> {
    return universalFetch("/family/finance", {
        method: "GET",
    });
}