import { fetchMock } from "@/shared/lib/fetchMock";
import {PersonalAccountType, SharedAccountType} from "@/entities/account/model/types";

export async function getSharedAccounts(): Promise<SharedAccountType> {
    return fetchMock("/api/accounts");
}

export async function getPersonalAccounts(): Promise<Record<number, PersonalAccountType>> {
    return fetchMock("/api/users/family");
}