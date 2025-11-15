"use client";

import Heading from "@/shared/ui/typography/Heading";
import CoupleAvatars from "@/shared/ui/CoupleAvatars";
import React, {useMemo} from "react";
import 'dayjs/locale/ru';
import dayjs from "dayjs";
import {Expenses} from "@/widgets/expenses";
import {useQuery} from "@tanstack/react-query";
import getAbsoluteSeverUrl from "@/shared/lib/getAbsoluteServerUrl";
import {getFamily, getFamilyExpenses} from "@/entities/family/api/api";

type Props = {
    className?: string;
}

const SharedExpenses = ({className}: Props) => {
    const {data: expenseCategories = []} = useQuery({
        queryKey: ["family-expenses"],
        queryFn: getFamilyExpenses,
        refetchInterval: 5000
    });

    const {data: family = []} = useQuery({
        queryKey: ["family"],
        queryFn: getFamily,
    });

    const firstAvatar = family[0] ? family[0].avatar : "";
    const secondAvatar = family[1] ? family[1].avatar : "";

    const sharedExpenses = useMemo(() => {
        if(!expenseCategories[0]) {
            return [];
        }

        return expenseCategories[0].categories.map((cat, idx) => {
            return {...cat, spent: cat.spent + (expenseCategories[1] ? expenseCategories[1].categories[idx].spent : 0)};
        });
    }, [expenseCategories]);

    return <section className={`${className} mb-[1.875rem] md:p-3 md:rounded-2xl md:bg-fuchsia-50`}>
        <div className="flex items-center justify-between mr-4 mb-2.5">
            <Heading className="md:text-3xl lg:text-4xl" level={2}>Общие траты
                за {dayjs(Date.now()).locale('ru').format('MMMM')}</Heading>
            <CoupleAvatars firstAvatar={getAbsoluteSeverUrl(firstAvatar)} secondAvatar={getAbsoluteSeverUrl(secondAvatar)}/>
        </div>
        <Expenses expenseCategories={sharedExpenses}/>
    </section>;
}

export default SharedExpenses;