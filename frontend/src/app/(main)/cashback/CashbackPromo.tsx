"use client";

import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import {ConfigureAutopay} from "@/features/configure-autopay";
import {useState} from "react";

type Props = {
    className?: string;
}

const CashbackPromo = ({className = ""}: Props) => {
    const [isModalActive, setModalActive] = useState(false);

    return <section className={`${className} cashback-promo mb-2.5 px-2.5 py-2 rounded-xl`}>
        <Heading className="text-white" level={2}>Хотите на отдых? Легко!</Heading>
        <p className="text-xs text-[#A1B7DB] mb-2.5 max-w-5/6">Настройте автоплатеж перевода кэшбэка в “цели” и тогда вы точно сможете полететь на Мальдивы!</p>
        <AccentButton onClick={() => setModalActive(true)}>Настроить автоплатеж</AccentButton>
        <ConfigureAutopay isActive={isModalActive} setActive={setModalActive} maxValue={12450}/>
    </section>
}

export default CashbackPromo;