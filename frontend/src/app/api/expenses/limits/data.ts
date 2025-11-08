import {getExpenseCategories} from "@/app/api/expenses/categories/data";
import {LimitType} from "@/entities/limit";

type UnpopulatedLimit = Omit<LimitType, "category"> & { category: number };

let limits: UnpopulatedLimit[] = [
    {id: 1, category: 1, limit: 20000, name: "Развлечения"},
    {id: 2, category: 2, limit: 40000, name: "Продукты"},
    {id: 3, category: 3, limit: 5000, name: "ЖКХ и связь"},
];

export function getLimits(): LimitType[] {
    const categories = getExpenseCategories();
    return limits.map((item: UnpopulatedLimit) => ({
        ...item,
        category: categories.find((c: any) => c.id === item.category)!
    }));
}

export function addLimit(limit: Omit<UnpopulatedLimit, "id">): UnpopulatedLimit {
    const newLimit = {
        ...limit,
        id: Math.max(0, ...limits.map((g) => g.id)) + 1,
    };

    limits.push(newLimit);
    return newLimit;
}

export function deleteLimit(limitId: number) {
    limits = limits.filter((l) => l.id !== limitId);
}