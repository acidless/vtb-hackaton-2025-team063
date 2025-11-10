"use client";

import {InvitePartner} from "@/widgets/invite-partner";
import React, {Dispatch, SetStateAction} from "react";
import {useQuery} from "@tanstack/react-query";
import {getCode} from "@/entities/family";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

const CodeModal = ({isActive, setActive}: Props) => {

    const {data: codeData = null, isPending} = useQuery({
        queryKey: ["family-code"],
        queryFn: getCode,
        refetchOnWindowFocus: false,
    });

    return <InvitePartner isActive={isActive} setActive={setActive} codeData={codeData} isLoading={isPending}/>
}

export default CodeModal;