"use client";

import Heading from "@/shared/ui/typography/Heading";
import CoupleAvatars from "@/shared/ui/CoupleAvatars";
import DonutChart from "@/shared/ui/charts/DonutChart";
import {ExpenseCategory, ExpenseCategoryType} from "@/entities/expense-category";
import React, {useMemo} from "react";
import 'dayjs/locale/ru';
import dayjs from "dayjs";
import useShowingSkeleton from "@/shared/hooks/useShowingSkeleton";
import {Expenses} from "@/widgets/expenses";

type Props = {
    firstAvatar: string;
    secondAvatar: string;
    expenseCategories: ExpenseCategoryType[];
}

const SharedExpenses = ({firstAvatar, secondAvatar, expenseCategories}: Props) => {


    return <section className="ml-4 md:mr-0 mb-[1.875rem]">
        <div className="flex items-center justify-between mr-4 mb-2.5">
            <Heading level={2}>Общие траты за {dayjs(Date.now()).locale('ru').format('MMMM')}</Heading>
            <CoupleAvatars firstAvatar={firstAvatar} secondAvatar={secondAvatar}/>
        </div>
        <Expenses expenseCategories={expenseCategories}/>
    </section>;
}

export default SharedExpenses;