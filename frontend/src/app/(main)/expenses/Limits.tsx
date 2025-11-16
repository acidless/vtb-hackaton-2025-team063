"use client";

import {getLimits, Limit, LimitType} from "@/entities/limit";
import Heading from "@/shared/ui/typography/Heading";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import {useState} from "react";
import {CreateLimit} from "@/features/create-limit";
import {useQuery} from "@tanstack/react-query";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";
import {AnimatePresence} from "framer-motion";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";

type Props = {
    className?: string;
    limitsInitial: LimitType[];
}

const Limits = ({className, limitsInitial}: Props) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const {data: limits = [], isError} = useQuery({
        queryKey: ["limits"],
        initialData: limitsInitial,
        queryFn: getLimits,
        refetchInterval: REFETCH_INTERVAL,
        staleTime: REFETCH_INTERVAL
    });

    return <section className={`${className} mb-[1.875rem] md:p-3 md:rounded-2xl md:bg-sky-50`}>
        <div className="flex items-center justify-between mb-2 flex-wrap gap-0.5">
            <Heading level={2}>Лимиты трат</Heading>
            <AccentButton textLarge onClick={() => setModalOpen(true)}>
                <Plus className="mr-1"/>
                Создать лимит
            </AccentButton>
        </div>
        <div className="flex gap-1 flex-col">
            <AnimatePresence>
                {limits.length
                    ? limits.map((limit) => (
                        <Limit key={limit.id} limit={limit}/>
                    ))
                    : <CollectionEmpty>У вас пока нет созданных лимитов</CollectionEmpty>
                }
            </AnimatePresence>
        </div>
        <CreateLimit isActive={isModalOpen} setActive={setModalOpen}/>
    </section>;
}

export default Limits;