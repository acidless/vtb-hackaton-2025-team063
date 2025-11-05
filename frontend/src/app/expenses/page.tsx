import Limits from "@/app/expenses/Limits";
import SharedExpenses from "@/app/expenses/SharedExpenses";
import {
    ExpenseCategoryType,
    ExpensesCategoryColors,
    ExpensesCategoryIcons
} from "@/entities/expense-category/model/types";
import PersonalExpenses from "@/app/expenses/PersonalExpenses";
import ExpenseHistory from "@/app/expenses/ExpenseHistory";
import ExpensesDistribution from "@/app/expenses/ExpensesDistribution";

const categories: ExpenseCategoryType[] = [
    {
        name: "Развлечения",
        spent: 5000,
        color: ExpensesCategoryColors["Развлечения"],
        icon: ExpensesCategoryIcons["Развлечения"]
    },
    {
        name: "Продукты",
        spent: 45000,
        color: ExpensesCategoryColors["Продукты"],
        icon: ExpensesCategoryIcons["Продукты"]
    },
    {
        name: "ЖКХ и связь",
        spent: 4000,
        color: ExpensesCategoryColors["ЖКХ и связь"],
        icon: ExpensesCategoryIcons["ЖКХ и связь"]
    },
    {
        name: "Транспорт",
        spent: 10000,
        color: ExpensesCategoryColors["Транспорт"],
        icon: ExpensesCategoryIcons["Транспорт"]
    },
    {
        name: "Одежда и обувь",
        spent: 12000,
        color: ExpensesCategoryColors["Одежда и обувь"],
        icon: ExpensesCategoryIcons["Одежда и обувь"]
    },
    {
        name: "Подарки",
        spent: 1000,
        color: ExpensesCategoryColors["Подарки"],
        icon: ExpensesCategoryIcons["Подарки"]
    }
];

export default function Expenses() {
    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <Limits limits={[
                    {category: categories[0], limit: 20000},
                    {category: categories[1], limit: 40000},
                    {category: categories[2], limit: 5000},
                ]}/>
                <SharedExpenses firstAvatar="/images/man.png" secondAvatar="/images/woman.png"
                                expenseCategories={categories}/>
            </div>
            <div>
                <PersonalExpenses avatar="/images/woman.png" expenseCategories={categories}/>
                <ExpenseHistory expenses={[
                    {
                        category: categories[5],
                        date: new Date(2025, 8, 29),
                        name: "Золотое яблоко",
                        outcome: true,
                        value: 20000
                    },
                    {
                        category: categories[4],
                        date: new Date(2025, 8, 28),
                        name: "ИП МАРИЯ МОРОЗОВА",
                        outcome: false,
                        value: 20000
                    },
                    {
                        category: categories[3],
                        date: new Date(2025, 8, 22),
                        name: "Стрелка",
                        outcome: true,
                        value: 1000
                    }
                ]}/>
                <ExpensesDistribution firstPerson={{value: 10000, avatar:"/images/woman.png"}} secondPerson={{value: 19000, avatar:"/images/man.png"}}/>
            </div>
        </div>
    </div>
}