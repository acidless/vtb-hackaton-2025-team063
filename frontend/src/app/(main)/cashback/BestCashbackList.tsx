"use client";

import {useQuery} from "@tanstack/react-query";
import {getFamily} from "@/entities/family";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";
import Heading from "@/shared/ui/typography/Heading";
import {UserType} from "@/entities/user";
import {BestCashback, CashbackType} from "@/entities/cashback";
import Pagination from "@/shared/ui/Pagination";
import React, {useMemo, useState} from "react";
import usePagination from "@/shared/hooks/usePagination";
import {TransactionCategories} from "@/entities/transaction-category";
import {CategoryCashbackModal} from "@/widgets/category-cashback";

type Props = {
    familyInitial: UserType[];
    cashbackInitial: CashbackType[];
    className?: string;
}

const BestCashbackList = ({familyInitial, cashbackInitial, className = ""}: Props) => {
    const [isModalActive, setModalActive] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(1);

    const {data: family = []} = useQuery({
        queryKey: ["family"],
        initialData: familyInitial,
        queryFn: getFamily,
        refetchInterval: REFETCH_INTERVAL * 5,
        staleTime: REFETCH_INTERVAL * 5
    });

    const cashbackByCategory = useMemo(() => {
        const maxArray = new Array(Object.keys(TransactionCategories).length).fill({percents: 0});
        cashbackInitial.forEach((item) => {
            const idx = item.category - 1;
            if (item.percents > maxArray[idx].percents) {
                maxArray[idx] = item;
            }
        });

        return maxArray;
    }, [cashbackInitial]);

    const [currentCashback, {setPage, firstPage, lastPage}] = usePagination(cashbackByCategory, 3);

    const firstAvatar = family[0] ? family[0].avatar : "";
    const firstId = family[0] ? family[0].id : "";

    const secondAvatar = family[1] ? family[1].avatar : "";

    function onCategoryClick(category: number) {
        setCurrentCategory(category);
        setModalActive(true);
    }

    const categoryCashbacks = useMemo(() => {
        return cashbackInitial.filter(c => c.category === currentCategory).sort((a, b) => b.percents - a.percents);
    }, [cashbackInitial, currentCategory]);

    return <section className={`${className} mb-[1.875rem]`}>
        <div className="mb-2.5 flex items-center justify-between">
            <Heading level={2}>Лучшие предложения по картам на ноябрь</Heading>
            <Pagination setPage={setPage} firstPage={firstPage} lastPage={lastPage}/>
        </div>
        <div className="flex flex-col gap-1">
            {currentCashback.map(c => <BestCashback onClick={onCategoryClick} key={c.category.toString() + c.card}
                                                    userAvatar={firstId === c.user ? firstAvatar : secondAvatar}
                                                    cashback={c}/>)}
        </div>
        <CategoryCashbackModal isActive={isModalActive} setActive={setModalActive} cardCashbacks={categoryCashbacks}/>
    </section>
}

export default BestCashbackList;