import {BankKey} from "@/entities/bank";

export type CashbackType = {
    user: number;
    category: number;
    bank: BankKey;
    date: Date;
    percents: number;
    card: string;
}

export type CategoryCashbackType = {
    id: number;
    cashback: number;
}

export type CardWithCashbackType = {
    card: string;
    user: number;
    total: number;
    categories: CategoryCashbackType[];
}