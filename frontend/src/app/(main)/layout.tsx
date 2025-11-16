import {Navbar} from "@/widgets/navbar";
import {ReactNode} from "react";
import {authUser} from "@/entities/user";
import {redirect} from "next/navigation";

export default async function MainLayout({children}: Readonly<{ children: ReactNode; }>) {
    const user = await authUser();

    if (!user || !user.id) {
        redirect("/login");
    }

    return <>
        <main className="w-full mx-auto max-w-screen-2xl relative py-4">
            {children}
        </main>
        <Navbar/>
    </>
}
