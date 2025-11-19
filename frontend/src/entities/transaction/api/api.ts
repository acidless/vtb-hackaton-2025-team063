import {TransactionType} from "@/entities/transaction";
import universalFetch from "@/shared/lib/universalFetch";
import {TransactionCategoryType} from "@/entities/transaction-category";

export async function getTransactions(): Promise<TransactionType[]> {
    const transactions = await universalFetch<TransactionType[]>("/transactions");
    return transactions.map((transaction: TransactionType) => ({
        ...transaction,
        date: new Date(transaction.date),
    }));
}

export async function getChildTransactions(): Promise<TransactionType[]> {
    const transactions = await universalFetch<TransactionType[]>("/child-accounts/transactions");
    return transactions.map((transaction: TransactionType) => ({
        ...transaction,
        date: new Date(transaction.date),
    }));
}

export async function getChildTransactionCategories(): Promise<TransactionCategoryType[]> {
    return universalFetch<TransactionCategoryType[]>("/child-accounts/transactions/categories");
}

export async function updateTransactionCategory({transactionId, categoryId}: {transactionId: string, categoryId: number}): Promise<TransactionType> {
    const transaction = await universalFetch<TransactionType>(`/transactions/${transactionId}`, {
        method: "PATCH",
        body: {categoryId},
    });

    transaction.date = new Date(transaction.date);
    return transaction;
}