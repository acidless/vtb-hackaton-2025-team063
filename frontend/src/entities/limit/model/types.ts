import {ExpenseCategoryName} from "@/entities/expense-category";

export type LimitType = {
    category: ExpenseCategoryName;
    limit: number;
    spent: number;
}