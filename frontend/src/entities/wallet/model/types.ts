import {TransactionCategoryType} from "@/entities/transaction-category";
import {BankKey} from "@/entities/bank";

export type WalletType = {
    name: string;
    id: number;
    category: TransactionCategoryType;
    money: number;
    limit: number;
    bank: BankKey;
    isDirty?: boolean;
}