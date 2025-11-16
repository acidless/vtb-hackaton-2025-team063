"use client";

import {useEffect, useState} from "react";
import {createPortal} from "react-dom";
import {useMediaQuery} from "@mantine/hooks";
import ExpensesDistribution from "@/app/(main)/expenses/ExpensesDistribution";
import {useQuery} from "@tanstack/react-query";
import {getFamily} from "@/entities/family";
import {UserType} from "@/entities/user";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";
import {PersonalExpensesType} from "@/entities/transaction-category";

type Props = {
    familyInitial: UserType[];
    expenseCategoriesInitial: PersonalExpensesType[];
}

export const ExpensesDistributionPortal = ({familyInitial, expenseCategoriesInitial}: Props) => {
    const [target, setTarget] = useState<HTMLElement | null>(null);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const {data: family = [], isPending} = useQuery({
        queryKey: ["family"],
        initialData: familyInitial,
        queryFn: getFamily,
        refetchInterval: REFETCH_INTERVAL * 5,
        staleTime: REFETCH_INTERVAL * 5
    });

    useEffect(() => {
        const element = document.getElementById(isDesktop ? "right-column" : "left-column");
        setTarget(element);
    }, [isDesktop]);

    if (!target) {
        return null;
    }

    const firstAvatar = family[0] ? family[0].avatar : "";
    const secondAvatar = family[1] ? family[1].avatar : "";

    return createPortal(
        <ExpensesDistribution
            expenseCategoriesInitial={expenseCategoriesInitial}
            className="mx-4 md:ml-0 md:order-3 md:p-3"
            firstAvatar={firstAvatar}
            secondAvatar={secondAvatar}
        />,
        target
    );
};
