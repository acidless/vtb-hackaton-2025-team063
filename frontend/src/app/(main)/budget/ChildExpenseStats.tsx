"use client";

import Heading from "@/shared/ui/typography/Heading";
import {Expenses as ExpensesBlock} from "@/widgets/expenses";
import {useQuery} from "@tanstack/react-query";
import {TransactionCategoryType} from "@/entities/transaction-category";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";
import {getChildTransactionCategories} from "@/entities/transaction/api/api";

type Props = {
    className?: string;
    childTransactionCategoriesInitial: TransactionCategoryType[];
}

const ChildExpenseStats = ({className, childTransactionCategoriesInitial}: Props) => {
    const {data: childTransactionCategories = []} = useQuery({
        queryKey: ["child-transaction-categories"],
        initialData: childTransactionCategoriesInitial,
        queryFn: getChildTransactionCategories,
        refetchInterval: REFETCH_INTERVAL,
        staleTime: REFETCH_INTERVAL
    });

    return <section className={`${className} mb-[1.875rem] md:p-3 md:rounded-2xl md:bg-fuchsia-50`}>
        <div className="mb-2.5">
            <Heading className="md:text-3xl lg:text-4xl" level={3}>Траты по детским счетам</Heading>
        </div>
        <ExpensesBlock expenseCategories={childTransactionCategories}/>
    </section>
}

export default ChildExpenseStats;