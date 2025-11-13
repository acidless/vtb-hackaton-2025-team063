import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import {Controller, useForm} from "react-hook-form";
import Input from "@/shared/ui/inputs/Input";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import Select from "@/shared/ui/inputs/Select";
import {Card} from "@/shared/ui/icons/Card";
import {yupResolver} from "@hookform/resolvers/yup"
import {schema} from "@/features/create-wallet/model/schema";
import {TransactionsCategoriesOptions} from "@/entities/transaction-category";
import {useMutation, useQueryClient} from "@tanstack/react-query";
import {addWallet} from "@/entities/wallet";
import {BankKey} from "@/entities/bank";
import * as yup from "yup";
import AnimatedLoader from "@/shared/ui/loaders/AnimatedLoader";
import BankSelect from "@/shared/ui/inputs/BankSelect";
import {AccountSelection} from "@/widgets/account-selection";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
}

export const CreateWallet = ({isActive, setActive}: Props) => {
    const {
        handleSubmit,
        reset,
        control,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(schema),
        defaultValues: {
            walletName: "",
            walletAccountFrom: null as any,
            walletBank: "",
            walletCategory: "",
            walletAmount: "" as any,
        },
    });

    const queryClient = useQueryClient();

    const {mutate: createWallet, isPending} = useMutation({
        mutationFn: addWallet,
        onSuccess: () => {
            reset();
            setActive(false);
            queryClient.invalidateQueries({queryKey: ["wallets"]});
            queryClient.invalidateQueries({queryKey: ["child-accounts"]});
            queryClient.invalidateQueries({queryKey: ["family-finance"]});
            queryClient.invalidateQueries({queryKey: ["transactions"]});
            queryClient.invalidateQueries({queryKey: ["family-expenses"]});
        },
    });

    const onSubmit = (data: yup.InferType<typeof schema>) => {
        createWallet({
            amount: data.walletAmount,
            name: data.walletName,
            bankId: data.walletBank as BankKey,
            categoryId: Number(data.walletCategory),
            fromAccountId: data.walletAccountFrom.accountId,
            fromAccount: data.walletAccountFrom.account[0].identification,
            fromBank: data.walletAccountFrom.bankId,
        });
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <div className="mb-2.5">
            <Heading level={3}>Новый кошелёк</Heading>
        </div>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletName">Название кошелька</label>
                    <Controller
                        name="walletName"
                        control={control}
                        render={({field}) => (
                            <Input id="walletName" placeholder="Продукты" error={errors.walletName?.message}
                                   large {...field}/>
                        )}
                    />
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletAmount">Лимит</label>
                    <div className="relative text-placeholder">
                        <Controller
                            name="walletAmount"
                            control={control}
                            render={({field}) => (
                                <>
                                    <Input className="w-full pr-9" id="walletLimit" type="number"
                                           placeholder="Например, 100 000₽"
                                           error={errors.walletAmount?.message} large {...field}/>
                                    <Card className="absolute right-2 top-[0.5rem] w-5"/>
                                </>
                            )}
                        />
                    </div>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletAccountFrom">Выберите счет</label>
                    <Controller
                        name="walletAccountFrom"
                        control={control}
                        render={({field}) => (
                            <AccountSelection {...field} id="walletAccountFrom"
                                              error={errors.walletAccountFrom?.message as string}
                                              value={field.value} onChange={(val) => field.onChange(val)}
                            />
                        )}
                    />
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="walletCategory">Категория</label>
                    <Controller
                        name="walletCategory"
                        control={control}
                        render={({field}) => (
                            <Select error={errors.walletCategory?.message} onChange={(value) => field.onChange(value)}
                                    large value={field.value} placeholder="Выберите категорию" id="walletCategory"
                                    options={TransactionsCategoriesOptions}/>
                        )}
                    />
                </div>
                <BankSelect name="walletBank" control={control} error={errors.walletBank?.message as string}/>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Создать кошелек
                    </AccentButton>
                </div>
                <AnimatedLoader isLoading={isPending}/>
            </form>
        </div>
    </ModalWindow>
}