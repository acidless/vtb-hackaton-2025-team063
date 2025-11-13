export type GoalType = {
    id: string;
    name: string;
    icon?: string;
    date: Date;
    value: number;
    bankId: string;
    collected: number;
};