"use client";

import Heading from "@/shared/ui/typography/Heading";
import {Expenses as ExpensesBlock} from "@/widgets/expenses";
import {useQuery, useQueryClient} from "@tanstack/react-query";
import {ExpenseCategoryType, getExpenseCategories} from "@/entities/expense-category";
import {ExpenseType} from "@/entities/expense";

const ExpenseStats = () => {
    const queryClient = useQueryClient();

    const expenseCategories = queryClient.getQueryData(["expense-categories"]) as ExpenseCategoryType[];

    return <section className="ml-4 md:ml-0 mb-[1.875rem]">
        <div className="mb-2.5">
            <Heading level={2}>Статистика расходов</Heading>
        </div>
        <ExpensesBlock expenseCategories={expenseCategories}/>
    </section>
}

export default ExpenseStats;