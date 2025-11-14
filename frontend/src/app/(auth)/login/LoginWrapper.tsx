"use client";

import MainHead from "@/app/(auth)/MainHead";
import {useRouter} from "next/navigation";
import LoginForm from "@/app/(auth)/login/LoginForm";
import Link from "next/link";

const LoginWrapper = () => {
    const router = useRouter();

    function onSuccess() {
        router.push("/dashboard");
    }

    return <section className="min-h-screen w-full max-w-md login-page flex flex-col px-4 relative">
        <MainHead/>
        <LoginForm onSuccess={onSuccess}/>
        <div className="flex justify-center items-center mt-2 text-light text-sm">
            <p className="flex items-center justify-center gap-1">
                Нет аккаунта?
                <Link className="text-active" href="/register">Войти</Link>
            </p>
        </div>
    </section>
}

export default LoginWrapper;