import { fetchMock } from "@/shared/lib/fetchMock";
import {PaymentType} from "@/entities/payment";
import universalFetch from "@/shared/lib/universalFetch";

export async function getPayments(): Promise<PaymentType[]> {
    const payments = await universalFetch<PaymentType[]>("/payments", {
        method: "GET",
    });

    return payments.map(p => ({...p, date: new Date(p.date)}));
}

export async function addPayment(newPayment: Omit<PaymentType, "id" | "payed">): Promise<PaymentType> {
    const payment = await universalFetch<PaymentType>("/payments", {
        method: "POST",
        body: newPayment,
    });

    payment.date = new Date(payment.date);
    return payment;
}

export async function deletePayment(paymentId: number): Promise<void> {
    await universalFetch(`/payments/${paymentId}`, {
        method: "DELETE",
    });
}

export async function executePayment(paymentId: number): Promise<void> {
    await fetchMock(`/api/payments/execution/?id=${paymentId}`, {
        method: "DELETE",
    });
}