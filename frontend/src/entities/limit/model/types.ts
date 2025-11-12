export type LimitType = {
    id: number;
    category: number;
    name: string;
    limit: number;
    spent: number;
    period: "week" | "month";
}