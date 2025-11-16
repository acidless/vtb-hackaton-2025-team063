"use client";

import Heading from "@/shared/ui/typography/Heading";
import React, {useState} from "react";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import {Partner} from "@/entities/partner";
import {useQuery} from "@tanstack/react-query";
import {getFamily} from "@/entities/family";
import CodeModal from "@/app/(main)/settings/CodeModal";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";
import {UserType} from "@/entities/user";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";

type Props = {
    className?: string;
    familyInitial: UserType[];
}

const ManageFamily = ({className, familyInitial}: Props) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const {data: family = [], isPending} = useQuery({
        queryKey: ["family"],
        initialData: familyInitial,
        queryFn: getFamily,
        refetchOnWindowFocus: false,
        refetchInterval: REFETCH_INTERVAL * 5,
        staleTime: REFETCH_INTERVAL * 5
    });

    const isSingle = family.length === 1;

    return <section className={`${className} mb-[1.875rem]`}>
        <div className="mb-2.5 flex items-center justify-between flex-wrap">
            <Heading className="md:text-3xl" level={2}>Управление семьей</Heading>
            {isSingle && <AccentButton onClick={() => setModalOpen(true)}>
                <Plus className="mr-1"/>
                Пригласить партнера
            </AccentButton>}
        </div>
        <div className="flex flex-col items-stretch gap-1 mb-[1.875rem]">
            {isSingle
                ? <CollectionEmpty>Пригласите партнера, он появится тут</CollectionEmpty>
                : family.slice(1).map(partner => <Partner key={partner.id} partner={partner}/>)
            }
        </div>
        <CodeModal isActive={isModalOpen} setActive={setModalOpen}/>
    </section>
}

export default ManageFamily;