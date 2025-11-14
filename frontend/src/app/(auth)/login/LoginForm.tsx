"use client";

import {Controller, useForm} from "react-hook-form";
import {IMaskInput} from "react-imask";
import AccentButton from "@/shared/ui/AccentButton";
import InputError from "@/shared/ui/inputs/InputError";
import {motion} from "framer-motion";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useMutation} from "@tanstack/react-query";
import {loginUser} from "@/entities/user";
import AnimatedLoader from "@/shared/ui/loaders/AnimatedLoader";
import phoneToPlain from "@/shared/lib/phoneToPlain";

const schema = yup
    .object({
        phone: yup
            .string()
            .required("Укажите номер телефона"),
    })
    .required();

type Props = {
    onSuccess: () => void;
}

const LoginForm = ({onSuccess}: Props) => {
    const {
        control,
        handleSubmit,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
    });

    const {mutate, isPending} = useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            onSuccess();
        },
    });

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        mutate({phone: phoneToPlain(data.phone)});
    }

    return <motion.div className="p-4 rounded-xl bg-white"
                       initial={{opacity: 0, y: 10}}
                       animate={{opacity: 1, y: 0}}
                       exit={{opacity: 0, y: -10}}
                       transition={{duration: 0.3}}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2 flex flex-col">
                <Controller
                    name="phone"
                    control={control}
                    render={({field}) => (
                        <>
                            <div className="flex items-stretch gap-2">
                                <IMaskInput
                                    {...field}
                                    mask="+{7} (000) 000-00-00"
                                    unmask={false}
                                    value={field.value || ""}
                                    onAccept={(value) => field.onChange(value)}
                                    placeholder="+7 (999) 999-99-99"
                                    type="tel"
                                    inputMode="numeric"
                                    className={`min-w-0 flex-1 large text-sm text-primary py-2.5 px-2.5 bg-tertiary rounded-xl font-normal outline-primary ${
                                        errors.phone ? "border-error" : ""
                                    }`}
                                />
                            </div>
                            <InputError error={errors.phone?.message}/>
                        </>
                    )}
                />
            </div>
            <div className="mb-2 flex flex-col">
                <AccentButton large background="bg-primary"
                              className="justify-center py-2.5! font-normal!">Войти</AccentButton>
            </div>
            <AnimatedLoader isLoading={isPending}/>
        </form>
    </motion.div>
}

export default LoginForm;