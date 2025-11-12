import {TransactionCategoryType, ExpensesCategoryColors, ExpensesCategoryNameIcons} from "@/entities/transaction-category";
import {getExpenses} from "@/app/api/expenses/data";

let categories: TransactionCategoryType[] = [
    {
        id: 1,
        name: "Развлечения",
        spent: 0,
        color: ExpensesCategoryColors["Развлечения"],
        icon: ExpensesCategoryNameIcons["Развлечения"]
    },
    {
        id: 2,
        name: "Продукты",
        spent: 0,
        color: ExpensesCategoryColors["Продукты"],
        icon: ExpensesCategoryNameIcons["Продукты"]
    },
    {
        id: 3,
        name: "ЖКХ и связь",
        spent: 0,
        color: ExpensesCategoryColors["ЖКХ и связь"],
        icon: ExpensesCategoryNameIcons["ЖКХ и связь"]
    },
    {
        id: 4,
        name: "Транспорт",
        spent: 0,
        color: ExpensesCategoryColors["Транспорт"],
        icon: ExpensesCategoryNameIcons["Транспорт"]
    },
    {
        id: 5,
        name: "Одежда и обувь",
        spent: 0,
        color: ExpensesCategoryColors["Одежда и обувь"],
        icon: ExpensesCategoryNameIcons["Одежда и обувь"]
    },
    {
        id: 6,
        name: "Подарки",
        spent: 0,
        color: ExpensesCategoryColors["Подарки"],
        icon: ExpensesCategoryNameIcons["Подарки"]
    },
    {
        id: 7,
        name: "Здоровье",
        spent: 0,
        color: ExpensesCategoryColors["Здоровье"],
        icon: ExpensesCategoryNameIcons["Здоровье"]
    },
    {
        id: 8,
        name: "Кафе и рестораны",
        spent: 0,
        color: ExpensesCategoryColors["Кафе и рестораны"],
        icon: ExpensesCategoryNameIcons["Кафе и рестораны"]
    },
    {
        id: 9,
        name: "Прочее",
        spent: 0,
        color: ExpensesCategoryColors["Прочее"],
        icon: ExpensesCategoryNameIcons["Прочее"]
    }
];

export function getExpenseCategories() {
    const expenses = getExpenses();
    const newCategories = [...categories].map(c => structuredClone(c));
    expenses.map(e => {
        newCategories.forEach(c => {
            if(c.id === e.category.id && e.outcome) {
                c.spent += e.value;
            }
        });
    });

    return newCategories;
}

export function getExpenseCategoriesWithoutPopulation() {
    return categories;
}