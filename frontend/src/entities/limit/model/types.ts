import {ExpenseCategoryType} from "@/entities/expense-category";

export type LimitType = {
    id: number;
    category: ExpenseCategoryType;
    name: string;
    limit: number;
}