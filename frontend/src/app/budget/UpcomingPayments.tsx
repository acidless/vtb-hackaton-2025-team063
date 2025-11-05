"use client";

import Heading from "@/shared/ui/typography/Heading";
import {Payment, PaymentLarge, PaymentType} from "@/entities/payment";
import React, {useMemo, useState} from "react";
import {PaymentsCalendar} from "@/widgets/payments-calendar";
import AccentButton from "@/shared/ui/AccentButton";
import {Plus} from "@/shared/ui/icons/Plus";
import SearchInput from "@/shared/ui/inputs/SearchInput";
import Select from "@/shared/ui/inputs/Select";
import {Filter} from "@/shared/ui/icons/Filter";
import NearestPayment from "@/app/budget/NearestPayment";
import {PaymentsList} from "@/widgets/payments-list";

type Props = {
    payments: PaymentType[];
}



const UpcomingPayments = ({payments}: Props) => {
    const [currentDate, setCurrentDate] = useState<Date>(new Date());

    const dateToPayment = useMemo(() => {
        return Object.fromEntries(payments.map(p => [p.date.toISOString().slice(0, 10), {...p}]));
    }, [payments]);

    const nearestPayment = useMemo(() => {
        return payments.find(p => p.date > new Date());
    }, [payments]);

    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="mb-2.5">
            <Heading level={2}>Календарь платежей</Heading>
        </div>
        <div className="mb-1 flex items-stretch gap-1">
            <SearchInput className="flex-1" placeholder="Поиск платежей"/>
            <AccentButton>
                <Plus className="mr-1"/>
                Создать платеж
            </AccentButton>
        </div>
        <div className="mb-2.5 flex items-stretch gap-1">
            <Select className="flex-1" options={[
                {label: "Все статусы", value: "all"}, {label: "Ожидается", value: "waiting"},
                {label: "Просрочен", value: "expired"}, {label: "Внесен", value: "payed"}
            ]}></Select>
            <Select className="flex-1" options={[
                {label: "Все платежи", value: "all"}, {label: "Ожидается", value: "waiting"},
                {label: "Просрочен", value: "expired"}, {label: "Внесен", value: "payed"}
            ]}></Select>
            <button className="bg-tertiary cursor-pointer w-7 h-7 rounded-xl flex justify-center items-center">
                <Filter/>
            </button>
        </div>
        {nearestPayment && <NearestPayment payment={nearestPayment}/>}
        <div className="mb-2.5">
            <PaymentsCalendar large currentDate={currentDate} setCurrentDate={setCurrentDate} payments={dateToPayment}/>
        </div>
        <div>
            <Heading level={3}>Все платежи</Heading>
            <PaymentsList currentDate={currentDate} payments={payments}
                          paymentMarkup={(payment) => <PaymentLarge payment={payment}/>}
                          skeletonMarkup={(i) => (
                              <div key={i} className="h-16 rounded-xl bg-tertiary animate-pulse"/>
                          )}/>
        </div>
    </section>
}

export default UpcomingPayments;