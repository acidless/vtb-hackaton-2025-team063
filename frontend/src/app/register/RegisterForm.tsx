"use client";

import {useState} from "react";
import MainStep from "@/app/register/MainStep";
import PhotoStep from "@/app/register/PhotoStep";
import {registerUser, UserInputType} from "@/entities/user";
import BankSelectStep from "@/app/register/BankSelectStep";
import FinalStep from "@/app/register/FinalStep";
import {useRouter} from "next/navigation";
import {useMutation} from "@tanstack/react-query";
import {BankKey} from "@/entities/bank";

const RegisterForm = () => {
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
        onSuccess: (response) => {
            router.push("/dashboard");
        },
    });

    function onRegisterFinished() {
        const formData = new FormData();
        formData.set("name", userData.name!);
        formData.set("phone", userData.phone!.replace(/\D/g, ""));
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

        <div
            className="absolute bottom-7 left-1/2 -translate-x-1/2 flex items-center justify-center gap-0.5 w-full">
            {Array.from({length: 4}).map((_, i) => (
                <div key={i}
                     className={`${step === i ? "w-14" : "w-1.5"} transition-all duration-500 h-1.5 bg-primary rounded-full`}></div>
            ))}
        </div>
    </section>
}

export default RegisterForm;