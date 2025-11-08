import {getExpenseCategoriesWithoutPopulation} from "@/app/api/expenses/categories/data";
import {ExpenseType} from "@/entities/expense";
import {getFamilyAccounts} from "@/app/api/users/family/data";

type UnpopulatedExpense = Omit<ExpenseType, "category"> & { category: number };

let expenses: UnpopulatedExpense[] = [
    {
        id: "1",
        category: 6,
        date: new Date(2025, 8, 29),
        name: "Золотое яблоко",
        outcome: true,
        value: 11000,
        bank: "Альфабанк"
    },
    {
        id: "2",
        category: 5,
        date: new Date(2025, 8, 28),
        name: "Lamoda",
        outcome: true,
        value: 20000,
        bank: "Сбербанк"
    },
    {
        id: "3",
        category: 4,
        date: new Date(2025, 8, 22),
        name: "Стрелка",
        outcome: true,
        value: 1000,
        bank: "Альфабанк"
    },
    {
        id: "4",
        category: 2,
        date: new Date(2024, 8, 21),
        name: "Пятерочка",
        outcome: true,
        value: 3570,
        bank: "Сбербанк"
    },
    {
        id: "5",
        category: 1,
        date: new Date(2024, 8, 21),
        name: "Кинотеатр",
        outcome: true,
        value: 1500,
        bank: "Сбербанк"
    },
    {
        id: "6",
        category: 7,
        date: new Date(2024, 8, 20),
        name: "Аптека",
        outcome: true,
        value: 3500,
        bank: "Альфабанк"
    },
    {
        id: "7",
        category: 3,
        date: new Date(2024, 8, 18),
        name: "Интернет",
        outcome: true,
        value: 1500,
        bank: "Альфабанк"
    }
];

export function getExpenses(): ExpenseType[] {
    const categories = getExpenseCategoriesWithoutPopulation();
    return expenses
        .sort((e1, e2) => new Date(e2.date).getTime() - new Date(e1.date)
            .getTime()).map((item: UnpopulatedExpense) => ({
            ...item, category: categories.find((c: any) => c.id === item.category)!
        }));
}

export function expenseUpdateCategory(expenseId: string, newCategoryId: number): UnpopulatedExpense | undefined {
    return expenses.find((expense) => {
        if (expense.id === expenseId) {
            expense.category = newCategoryId;
            return expense;
        }
    });
}

export function addExpense(expense: Omit<UnpopulatedExpense, "id">): UnpopulatedExpense | undefined {
    const newExpense = {
        ...expense,
        id: (Math.max(0, ...expenses.map((g) => Number(g.id))) + 1).toString(),
    };

    if(expense.outcome) {
        getFamilyAccounts()[1].balance -= expense.value;
        getFamilyAccounts()[1].expenses += expense.value;
    }

    expenses.push(newExpense);
    return newExpense;
}