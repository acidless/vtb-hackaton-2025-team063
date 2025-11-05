"use client";

import {type ExpenseType, Expense} from "@/entities/expense";
import Heading from "@/shared/ui/typography/Heading";
import React from "react";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";

type Props = {
    expenses: ExpenseType[];
}

const ExpenseHistory = ({expenses}: Props) => {
    const isShowindSkeletons = useShowingSkeleton(expenses);

    return <section className="mx-4 md:mx-0 md:mr-4 mb-5 mb-32">
        <Heading level={2}>История трат</Heading>
        <div className="flex flex-col gap-2.5">
            {isShowindSkeletons
                ? Array.from({length: 5}).map((_, i) => (<div key={i} className="bg-tertiary h-16 rounded-xl animate-pulse"></div>))
                : expenses.map((expense) => (<Expense key={expense.date.getTime()} expense={expense}/>))
            }
        </div>
    </section>;
}

export default ExpenseHistory;