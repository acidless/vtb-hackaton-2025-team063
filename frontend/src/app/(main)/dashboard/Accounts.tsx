"use client";

import {AccountAggregate} from "@/entities/account";
import {useQuery} from "@tanstack/react-query";
import {getFamilyFinance} from "@/entities/family/api/api";

type Props = {
    className?: string;
}

const Accounts = ({className}: Props) => {
    const {data: familyFinance = []} = useQuery({
        queryKey: ["family-finance"],
        queryFn: getFamilyFinance,
        refetchInterval: 5000
    });

    return <section className={`grid grid-cols-2 mb-6 gap-2.5 ${className}`}>
        {familyFinance[0] ? <AccountAggregate className="flex-1" account={familyFinance[0]}/> : <></>}
        {familyFinance[1] ? <AccountAggregate className="flex-1" account={familyFinance[1]}/> : <></>}
    </section>
}

export default Accounts;