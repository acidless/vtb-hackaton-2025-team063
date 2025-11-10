import {UserType} from "@/entities/user";

export type PersonalAccountType = UserType & {
    account: string | null;
    balance: number;
    monthlyIncome: number;
}