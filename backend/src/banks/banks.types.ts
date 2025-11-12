export type AccountType = {
    accountId: string;
    nickname: string;
    status: "Enabled" | "closed";
    accountSubType: "Checking" | "Savings";
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
    transactionInformation: string;
    creditDebitIndicator: "Debit" | "Credit";
    status: "completed" | string;
    valueDateTime: string;
    merchant?: {
        mccCode: string;
    }
};