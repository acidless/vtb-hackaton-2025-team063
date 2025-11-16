"use client";

import {AccountAggregate, PersonalAccountType} from "@/entities/account";
import {useQuery} from "@tanstack/react-query";
import {getFamilyFinance} from "@/entities/family/api/api";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";

type Props = {
    className?: string;
    familyFinanceInitial: PersonalAccountType[];
}

const Accounts = ({className, familyFinanceInitial}: Props) => {
    const {data: familyFinance = []} = useQuery({
        queryKey: ["family-finance"],
        initialData: familyFinanceInitial,
        queryFn: getFamilyFinance,
        refetchInterval: REFETCH_INTERVAL,
        staleTime: REFETCH_INTERVAL
    });

    return <section className={`grid grid-cols-2 mb-6 gap-2.5 ${className}`}>
        {familyFinance[0] ? <AccountAggregate className="flex-1" account={familyFinance[0]}/> : <></>}
        {familyFinance[1] ? <AccountAggregate className="flex-1" account={familyFinance[1]}/> : <></>}
    </section>
}

export default Accounts;