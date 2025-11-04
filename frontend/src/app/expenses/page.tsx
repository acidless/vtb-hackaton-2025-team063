import Limits from "@/app/expenses/Limits";
import SharedExpenses from "@/app/expenses/SharedExpenses";
import {ExpenseseCategoryIcons} from "@/entities/expense-category/model/types";

export default function Expenses() {
    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <Limits limits={[
                    {category: "Развлечения", spent: 5000, limit: 20000},
                    {category: "Продукты", spent: 45000, limit: 40000},
                    {category: "ЖКХ и связь", spent: 3000, limit: 5000},
                ]}/>
                <SharedExpenses firstAvatar="/images/man.png" secondAvatar="/images/woman.png" expenseCategories={[
                    {
                        name: "Развлечения",
                        spent: 5000,
                        color: "rgba(255, 90, 95, 0.4)",
                        icon: ExpenseseCategoryIcons["Развлечения"]
                    },
                    {
                        name: "Продукты",
                        spent: 45000,
                        color: "rgba(255, 214, 107, 0.4)",
                        icon: ExpenseseCategoryIcons["Продукты"]
                    },
                    {
                        name: "ЖКХ и связь",
                        spent: 3000,
                        color: "rgba(0, 200, 151, 0.4)",
                        icon: ExpenseseCategoryIcons["ЖКХ и связь"]
                    },
                ]}/>
            </div>
            <div>

            </div>
        </div>
    </div>
}