import { fetchMock } from "@/shared/lib/fetchMock";
import {ExpenseCategoryType} from "@/entities/expense-category";

export async function getExpenseCategories(): Promise<ExpenseCategoryType[]> {
    return fetchMock("/api/expenses/categories");
}