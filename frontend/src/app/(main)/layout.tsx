"use client";

import {Navbar} from "@/widgets/navbar";
import {ReactNode, useEffect} from "react";
import {useQuery} from "@tanstack/react-query";
import {authUser} from "@/entities/user";
import {useRouter} from "next/navigation";

export default function MainLayout({children}: Readonly<{ children: ReactNode; }>) {
    const router = useRouter();

    const {data: user = null, isError} = useQuery({
        queryKey: ["user"],
        queryFn: authUser,
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (isError) {
            router.replace("/login");
        }
    }, [isError, router]);

    return <>
        <main className="w-full mx-auto max-w-screen-2xl relative py-4">
            {children}
        </main>
        <Navbar/>
    </>
}
