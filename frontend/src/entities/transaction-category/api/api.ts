import {TransactionCategoryType} from "@/entities/transaction-category";
import universalFetch from "@/shared/lib/universalFetch";

export async function getTransactionsCategories(): Promise<TransactionCategoryType[]> {
    return universalFetch("/transactions/categories");
}