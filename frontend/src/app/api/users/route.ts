import {NextResponse} from "next/server";

export async function GET() {
    const mockData = {
        profile: {
            avatar: "/images/woman.png",
            name: "Анна",
            phone: "+7 (988) 675-34-34"
        },
        settings: {
            pushEnabled: true,
        },
        partners: [
            {name: "Михаил", date: new Date(2023, 9, 5), avatar: "/images/man.png", status: "connected"},
        ]
    };

    return NextResponse.json(mockData);
}