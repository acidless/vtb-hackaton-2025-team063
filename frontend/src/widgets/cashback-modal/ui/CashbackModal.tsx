import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import {ArrowRight} from "@/shared/ui/icons/ArrowRight";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const CashbackModal = ({isActive, setActive}: Props) => {
    return <ModalWindow isActive={isActive} setActive={setActive}>
        <Heading className="mb-2.5" level={3}>Управлять кешбэком</Heading>
        <div className="flex flex-col">
            <AccentButton className="mb-2.5 font-light! flex items-center justify-center gap-2.5" large>
                Перевести на счет
                <ArrowRight className="mt-0.5" />
            </AccentButton>
            <AccentButton className="mb-2.5 font-light! flex items-center justify-center gap-2.5" large>
                Оплатить покупки
                <ArrowRight className="mt-0.5" />
            </AccentButton>
            <AccentButton className="mb-2.5 font-light! flex items-center justify-center gap-2.5" large>
                Направить на цель
                <ArrowRight className="mt-0.5" />
            </AccentButton>
        </div>
    </ModalWindow>
}