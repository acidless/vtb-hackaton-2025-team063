"use client";

import Heading from "@/shared/ui/typography/Heading";
import CoupleAvatars from "@/shared/ui/CoupleAvatars";
import {TransactionCategoryType, getTransactionsCategories} from "@/entities/transaction-category";
import React from "react";
import 'dayjs/locale/ru';
import dayjs from "dayjs";
import {Expenses} from "@/widgets/expenses";
import {useQuery} from "@tanstack/react-query";
import getAbsoluteSeverUrl from "@/shared/lib/getAbsoluteServerUrl";

type Props = {
    firstAvatar: string;
    secondAvatar: string;
}

const SharedExpenses = ({firstAvatar, secondAvatar}: Props) => {
    const {data: expenseCategories = []} = useQuery({
        queryKey: ["transactions-categories"],
        queryFn: getTransactionsCategories,
        refetchInterval: 5000
    });

    return <section className="ml-4 md:mr-0 mb-[1.875rem]">
        <div className="flex items-center justify-between mr-4 mb-2.5">
            <Heading level={2}>Общие траты за {dayjs(Date.now()).locale('ru').format('MMMM')}</Heading>
            <CoupleAvatars firstAvatar={getAbsoluteSeverUrl(firstAvatar)} secondAvatar={getAbsoluteSeverUrl(secondAvatar)}/>
        </div>
        <Expenses expenseCategories={expenseCategories}/>
    </section>;
}

export default SharedExpenses;