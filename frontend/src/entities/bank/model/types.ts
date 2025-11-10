export type Bank = {
    name: string;
    color: string;
    iconBg: string;
}

export type BankKey = "abank" | "sbank" | "vbank" | "family";

export const banks: Record<BankKey, Bank> = {
    "abank": {
        name: "Альфабанк",
        color: "#FF5A5F",
        iconBg: "linear-gradient(135deg, #ff5ea8, #ff4088)"
    },
    "sbank": {
        name: "Сбербанк",
        color: "#00C897",
        iconBg: "linear-gradient(135deg, #21e1b3, #1ec99b)",
    },
    "vbank": {
        name: "ВТБ",
        color: "#0066FF",
        iconBg: "linear-gradient(135deg, #7aa2ff, #5e8aff)"
    },
    "family": {
        name: "Family Bank",
        color: "#791EFF",
        iconBg: "#791EFF"
    }
};