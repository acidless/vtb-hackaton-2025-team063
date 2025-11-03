export type Accounts = {
    name: string;
    accounts: Account[];
}

export type Account = {
    type: "mir";
    digits: string;
}