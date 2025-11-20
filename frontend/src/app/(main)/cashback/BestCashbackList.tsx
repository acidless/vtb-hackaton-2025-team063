"use client";

import {useQuery} from "@tanstack/react-query";
import {getFamily} from "@/entities/family";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";
import Heading from "@/shared/ui/typography/Heading";
import {UserType} from "@/entities/user";
import {BestCashback, CashbackType} from "@/entities/cashback";
import Pagination from "@/shared/ui/Pagination";
import React from "react";
import usePagination from "@/shared/hooks/usePagination";

type Props = {
    familyInitial: UserType[];
    cashbackInitial: CashbackType[];
}

const BestCashbackList = ({familyInitial, cashbackInitial}: Props) => {
    const {data: family = []} = useQuery({
        queryKey: ["family"],
        initialData: familyInitial,
        queryFn: getFamily,
        refetchInterval: REFETCH_INTERVAL * 5,
        staleTime: REFETCH_INTERVAL * 5
    });

    const [currentCashback, {setPage, firstPage, lastPage}] = usePagination(cashbackInitial, 3);

    const firstAvatar = family[0] ? family[0].avatar : "";
    const firstId = family[0] ? family[0].id : "";

    const secondAvatar = family[1] ? family[1].avatar : "";

    return <section className="mx-4 mb-[1.875rem]">
        <div className="mb-2.5 flex items-center justify-between">
            <Heading level={2}>Лучшие предложения по картам на ноябрь</Heading>
            <Pagination setPage={setPage} firstPage={firstPage} lastPage={lastPage}/>
        </div>
        <div className="flex flex-col gap-1">
            {currentCashback.map(c => <BestCashback key={c.category.toString() + c.card}
                                                    userAvatar={firstId === c.user ? firstAvatar : secondAvatar}
                                                    cashback={c}/>)}
        </div>
    </section>
}

export default BestCashbackList;