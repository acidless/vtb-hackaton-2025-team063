import {executePayment} from "@/app/api/payments/data";
import {NextResponse} from "next/server";

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    executePayment(id);

    return new NextResponse(null, { status: 204 });
}