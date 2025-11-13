import {BankKey} from "@/entities/bank";

export type WalletType = {
    name: string;
    id: string;
    categoryId: number;
    currentAmount: number;
    amount: number;
    bankId: BankKey;
}