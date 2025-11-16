"use client";

import Heading from "@/shared/ui/typography/Heading";
import {Expenses as ExpensesBlock} from "@/widgets/expenses";
import {useQuery} from "@tanstack/react-query";
import {getFamilyExpenses} from "@/entities/family/api/api";
import {PersonalExpensesType} from "@/entities/transaction-category";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";

type Props = {
    className?: string;
    expenseCategoriesInitial: PersonalExpensesType[];
}

const ExpenseStats = ({className, expenseCategoriesInitial}: Props) => {
    const {data: expenseCategories = []} = useQuery({
        queryKey: ["family-expenses"],
        initialData: expenseCategoriesInitial,
        queryFn: getFamilyExpenses,
        refetchInterval: REFETCH_INTERVAL,
        staleTime: REFETCH_INTERVAL
    });

    return <section className={`${className} mb-[1.875rem] md:p-3 md:rounded-2xl md:bg-fuchsia-50`}>
        <div className="mb-2.5">
            <Heading className="md:text-3xl lg:text-4xl" level={2}>Статистика расходов</Heading>
        </div>
        <ExpensesBlock expenseCategories={expenseCategories[0] ? expenseCategories[0].categories : []}/>
    </section>
}

export default ExpenseStats;