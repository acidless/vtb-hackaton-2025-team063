"use client";

import {useQuery} from "@tanstack/react-query";
import {getFamily} from "@/entities/family";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";
import Heading from "@/shared/ui/typography/Heading";
import {UserType} from "@/entities/user";
import CoupleAvatars from "@/shared/ui/CoupleAvatars";
import getAbsoluteSeverUrl from "@/shared/lib/getAbsoluteServerUrl";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import AccentButton from "@/shared/ui/AccentButton";
import Avatar from "@/shared/ui/Avatar";
import BalanceCounter from "@/shared/ui/MoneyCounting";
import {CashbackModal} from "@/widgets/cashback-modal/ui/CashbackModal";
import {useState} from "react";

type Props = {
    familyInitial: UserType[];
}

const SharedCashback = ({familyInitial}: Props) => {
    const [isModalActive, setModalActive] = useState(false);

    const {data: family = []} = useQuery({
        queryKey: ["family"],
        initialData: familyInitial,
        queryFn: getFamily,
        refetchInterval: REFETCH_INTERVAL * 5,
        staleTime: REFETCH_INTERVAL * 5
    });

    const firstAvatar = family[0] ? family[0].avatar : "";
    const secondAvatar = family[1] ? family[1].avatar : "";

    return <section className="mx-4 mb-[1.875rem]">
        <Heading className="mb-2.5 md:text-4xl" level={2}>Общий кэшбэк</Heading>
        <div className="py-2 px-2.5 rounded-xl bg-primary text-white">
            <div className="flex items-center justify-between mb-7">
                <div>
                    <p className="text-[#85B6FF] text-base">Накоплено за всё время</p>
                    <p className="text-[1.875rem] font-bold leading-none">
                        <BalanceCounter value={12450}/>
                    </p>
                </div>
                <CoupleAvatars firstAvatar={getAbsoluteSeverUrl(firstAvatar)}
                               secondAvatar={getAbsoluteSeverUrl(secondAvatar)}/>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center flex-wrap gap-x-3 gap-y-1">
                    <div className="flex items-center gap-1">
                        <Avatar size="1.5" avatar={getAbsoluteSeverUrl(firstAvatar)}/>
                        <p className="text-sm font-semibold"><MoneyAmount value={1456}/></p>
                    </div>
                    {secondAvatar
                        ? <div className="flex items-center gap-1">
                            <Avatar size="1.5" avatar={getAbsoluteSeverUrl(secondAvatar)}/>
                            <p className="text-sm font-semibold"><MoneyAmount value={10994}/></p>
                        </div>
                        : <></>
                    }
                </div>
                <div className="shrink-0">
                    <AccentButton onClick={() => setModalActive(true)}>Управлять кэшбэком</AccentButton>
                </div>
            </div>
        </div>
        <CashbackModal isActive={isModalActive} setActive={setModalActive}/>
    </section>
}

export default SharedCashback;