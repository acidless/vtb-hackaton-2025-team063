"use client";

import Heading from "@/shared/ui/typography/Heading";
import PaymentsCalendar from "@/app/dashboard/PaymentsCalendar";
import {Payment, PaymentType} from "@/entities/payment";
import {useMemo} from "react";

type Props = {
    payments: PaymentType[];
}

const UpcomingPayments = ({payments}: Props) => {
    const dateToPayment = useMemo(() => {
        return Object.fromEntries(payments.map(p => [p.date.toISOString().slice(0, 10), {...p}]));
    }, [payments]);
    const sortedPayments = useMemo(() => {
        return payments.sort((p1, p2) => p1.date.getTime() - p2.date.getTime());
    }, [payments]);

    return <section className="mx-4 md:mr-0 mb-5">
        <Heading level={2}>Ближайшие платежи</Heading>
        <div className="grid grid-cols-2 gap-2.5">
            <PaymentsCalendar payments={dateToPayment}/>
            <div className="flex-1 flex flex-col gap-1">
                {sortedPayments.slice(0, 4).map((payment) => (<Payment payment={payment}/>))}
            </div>
        </div>
    </section>
}

export default UpcomingPayments;