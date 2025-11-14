import {ReactNode} from "react";
import WithVideoBg from "@/shared/ui/WithVideoBg";

export default function AuthLayout({ children }: { children: ReactNode }) {
    return <main className="flex min-h-screen items-center justify-center w-full">
        <WithVideoBg>
            {children}
        </WithVideoBg>
    </main>
}