import {ExpenseCategoryType} from "@/entities/expense-category";

export type ExpenseType = {
    category: ExpenseCategoryType;
    name: string;
    value: number;
    outcome: boolean;
    bank: string;
    date: Date;
}