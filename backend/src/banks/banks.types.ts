export type AccountType = {
    accountId: string;
    nickname: string;
    account: {
        identification: string;
    }[];
};

export type TransactionType = {
    accountId: string;
    transactionId: string;
    amount: {
        amount: string;
        currency: string;
    };
    creditDebitIndicator: "Debit" | "Credit";
    status: "completed" | string;
    valueDateTime: string;
};