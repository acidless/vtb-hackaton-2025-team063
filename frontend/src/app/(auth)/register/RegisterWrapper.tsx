"use client";

import {useState} from "react";
import MainStep from "@/app/(auth)/register/MainStep";
import PhotoStep from "@/app/(auth)/register/PhotoStep";
import {registerUser, UserInputType} from "@/entities/user";
import BankSelectStep from "@/app/(auth)/register/BankSelectStep";
import FinalStep from "@/app/(auth)/register/FinalStep";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {BankKey} from "@/entities/bank";
import phoneToPlain from "@/shared/lib/phoneToPlain";
import Link from "next/link";

const RegisterWrapper = () => {
    const [step, setStep] = useState(0);
    const [userData, setUserData] = useState<Partial<UserInputType>>({});
    const router = useRouter();

    function onMainStepEnd(user: Partial<UserInputType>) {
        setUserData((prevUser) => ({...prevUser, ...user}));
        setStep(1);
    }

    function onPhotoStepEnd(photo: File, photoSrc: string) {
        setUserData((prevUser) => ({...prevUser, photo, photoSrc}));
        setStep(2);
    }

    function onBanksStepEnd(banks: BankKey[]) {
        setUserData((prevUser) => ({...prevUser, banks}));
        setStep(3);
    }

    const {mutate: register, isPending} = useMutation({
        mutationFn: registerUser,
        onSuccess: () => {
            router.push("/dashboard");
        },
    });

    function onRegisterFinished() {
        const formData = new FormData();
        formData.set("name", userData.name!);
        formData.set("phone", phoneToPlain(userData.phone!));
        formData.set("avatar", userData.photo!);

        const familyCode = userData.code?.toString();
        if(familyCode) {
            formData.set("familyCode", familyCode);
        }

        register(formData);
    }

    return <section className="min-h-screen w-full max-w-md login-page flex flex-col px-4 relative">
        {step === 0 && <MainStep onSuccess={onMainStepEnd}/>}
        {step === 1 && <PhotoStep onSuccess={onPhotoStepEnd}/>}
        {step === 2 && <BankSelectStep onSuccess={onBanksStepEnd}/>}
        {step === 3 && <FinalStep user={userData} onSuccess={onRegisterFinished}/>}
        <div className="flex justify-center items-center mt-2 text-light text-sm">
            <p className="flex items-center justify-center gap-1">
                Не зарегистрированы?
                <Link className="text-active" href="/login">Регистрация</Link>
            </p>
        </div>

        <div
            className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5 w-full">
            {Array.from({length: 4}).map((_, i) => (
                <div key={i}
                     className={`${step === i ? "w-14" : "w-1.5"} transition-all duration-500 h-1.5 bg-primary rounded-full`}></div>
            ))}
        </div>
    </section>
}

export default RegisterWrapper;