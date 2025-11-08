import {NextResponse} from "next/server";
import {addLimit, deleteLimit, getLimits} from "@/app/api/expenses/limits/data";

export async function GET() {
    return NextResponse.json(getLimits());
}

export async function POST(req: Request) {
    const data = await req.json();
    const newLimit = addLimit(data);
    return NextResponse.json(newLimit);
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = Number(searchParams.get("id"));
    deleteLimit(id);

    return new NextResponse(null, { status: 204 });
}