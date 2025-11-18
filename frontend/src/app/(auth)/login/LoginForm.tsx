"use client";

import {Controller, useForm} from "react-hook-form";
import AccentButton from "@/shared/ui/AccentButton";
import {motion} from "framer-motion";
import {yupResolver} from "@hookform/resolvers/yup";
import * as yup from "yup";
import {useMutation, useQuery} from "@tanstack/react-query";
import {getUsers, loginUser} from "@/entities/user";
import AnimatedLoader from "@/shared/ui/loaders/AnimatedLoader";
import Select from "@/shared/ui/inputs/Select";

const schema = yup
    .object({
        loginUserId: yup
            .string()
            .required("Выберите пользователя"),
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
        defaultValues: {
            loginUserId: null as any,
        }
    });

    const {mutate, isPending} = useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            onSuccess();
        },
    });

    const {data: users = []} = useQuery({
        queryKey: ["users"],
        queryFn: getUsers,
        refetchInterval: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    });

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        mutate({id: Number(data.loginUserId)});
    }

    return <motion.div className="p-4 rounded-xl bg-white"
                       initial={{opacity: 0, y: 10}}
                       animate={{opacity: 1, y: 0}}
                       exit={{opacity: 0, y: -10}}
                       transition={{duration: 0.3}}>
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-2 flex flex-col">
                <Controller
                    name="loginUserId"
                    control={control}
                    render={({field}) => (
                        <Select error={errors.loginUserId?.message as string}
                                onChange={(value) => field.onChange(value)}
                                large placeholder="Выберите пользователя" value={field.value} id="loginUserId"
                                options={users.map((user) => ({
                                    value: user.id.toString(),
                                    label: user.name
                                }))}/>
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