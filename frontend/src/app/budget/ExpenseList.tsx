"use client";

import Heading from "@/shared/ui/typography/Heading";
import {ExpenseLight, ExpenseType} from "@/entities/expense";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";
import React from "react";

type Props = {
    expenses: ExpenseType[];
}

const ExpenseList = ({expenses}: Props) => {
    const isShowindSkeletons = useShowingSkeleton(expenses);

    return <section className="mx-4 md:ml-0 mb-20">
        <div className="mb-2.5">
            <Heading level={2}>История операций</Heading>
        </div>

        {isShowindSkeletons
            ? <div className="flex flex-col gap-1">
                {Array.from({length: 5}).map((_, i) => (
                    <div key={i} className="bg-tertiary h-14 rounded-xl animate-pulse"></div>))}
            </div>
            : <div className="flex flex-col">
                {expenses.map((expense) => (<ExpenseLight key={expense.date.getTime()} expense={expense}/>))}
            </div>
        }
    </section>
}

export default ExpenseList;