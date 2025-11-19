"use client";

import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import {ConditionsApprove} from "@/widgets/conditions-approve";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
    onApprove: () => void;
}

export const InviteApprove = ({isActive, setActive, onApprove}: Props) => {
    return <ModalWindow isActive={isActive} setActive={setActive}>
        <ConditionsApprove onContinue={onApprove}/>
    </ModalWindow>
}