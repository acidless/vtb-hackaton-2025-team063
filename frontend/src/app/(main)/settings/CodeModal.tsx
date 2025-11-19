"use client";

import {InviteApprove, InvitePartner} from "@/widgets/invite-partner";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {getCode} from "@/entities/family";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

const CodeModal = ({isActive, setActive}: Props) => {
    const [isInviteModalActive, setInviteModalActive] = useState(false);
    const [isApproved, setApproved] = useState(false);

    const {data: codeData = null, isPending} = useQuery({
        queryKey: ["family-code"],
        queryFn: getCode,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if(isApproved) {
            setInviteModalActive(true);
            setActive(false);
        }
    }, [isActive]);

    function onApprove() {
        setActive(false);
        setInviteModalActive(true);
        setApproved(true);
    }

    return <>
        <InviteApprove isActive={isActive} setActive={setActive} onApprove={onApprove}/>
        <InvitePartner isActive={isInviteModalActive} setActive={setInviteModalActive} codeData={codeData}
                       isLoading={isPending}/>
    </>
}

export default CodeModal;