import Heading from "@/shared/ui/typography/Heading";
import ModalWindow from "@/shared/ui/ModalWindow";
import {Dispatch, SetStateAction} from "react";
import {Controller, useForm} from "react-hook-form";
import Input from "@/shared/ui/inputs/Input";
import {Plus} from "@/shared/ui/icons/Plus";
import AccentButton from "@/shared/ui/AccentButton";
import {Card} from "@/shared/ui/icons/Card";
import {yupResolver} from "@hookform/resolvers/yup"
import * as yup from "yup";
import {getSchema} from "@/features/configure-autopay/model/schema";
import DatePicker from "@/shared/ui/inputs/DatePicker";
import {useQuery} from "@tanstack/react-query";
import {getGoals} from "@/entities/goal";
import {REFETCH_INTERVAL} from "@/providers/ReactQueryProvider";
import Select from "@/shared/ui/inputs/Select";

type Props = {
    isActive: boolean;
    setActive: Dispatch<SetStateAction<boolean>>;
    maxValue: number;
}

export const ConfigureAutopay = ({isActive, setActive, maxValue}: Props) => {
    const {
        handleSubmit,
        control,
        setValue,
        formState: {errors},
    } = useForm({
        resolver: yupResolver(getSchema(maxValue)),
        defaultValues: {
            autopayValue: "" as any,
            autopayDate: null as any,
            autopayGoal: "",
        }
    });

    const {data: goals = []} = useQuery({
        queryKey: ["goals"],
        queryFn: getGoals,
        refetchInterval: REFETCH_INTERVAL,
        staleTime: REFETCH_INTERVAL
    });

    function setFullAmount() {
        setValue("autopayValue", maxValue);
    }

    const onSubmit = (data: yup.InferType<ReturnType<typeof getSchema>>) => {
        console.log(data);
    }

    return <ModalWindow isActive={isActive} setActive={setActive}>
        <Heading level={3}>Настроить автоплатеж</Heading>
        <div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="autopayValue">Сумма автоплатежа</label>
                    <div className="relative text-placeholder">
                        <Controller
                            name="autopayValue"
                            control={control}
                            render={({field}) => (
                                <>
                                    <div>
                                        <Input {...field} className="w-full pr-9" id="autopayValue" type="number"
                                               placeholder="Например, 120 000₽"
                                               error={errors.autopayValue?.message}
                                               large/>
                                        <Card className="absolute right-2 top-[0.5rem] w-5"/>
                                    </div>
                                    <p className="text-xs text-primary">или <span onClick={setFullAmount}
                                                                                  className="text-active cursor-pointer">вся сумма кэшбэка</span>
                                    </p>
                                </>
                            )}
                        />
                    </div>
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="autopayDate">Дата автоплатежа</label>
                    <Controller
                        name="autopayDate"
                        control={control}
                        render={({field}) => {
                            return <DatePicker
                                date={field.value?.toISOString()}
                                large
                                error={errors.autopayDate?.message as string}
                                dateChange={(val) => field.onChange(val ? new Date(val) : null)}
                            />
                        }}
                    />
                </div>
                <div className="mb-2.5 flex flex-col">
                    <label className="font-medium text-sm mb-1" htmlFor="autopayGoal">Цель, куда будет зачисляться
                        кэшбек</label>
                    <Controller
                        name="autopayGoal"
                        control={control}
                        render={({field}) => {
                            return <Select error={errors.autopayGoal?.message as string}
                                           onChange={(value) => field.onChange(value)}
                                           large placeholder="Выберите цель" value={field.value} id="autopayGoal"
                                           options={goals.map((goal) => ({
                                               value: goal.id,
                                               label: goal.name
                                           }))}/>
                        }}
                    />
                </div>
                <div className="mb-2.5">
                    <AccentButton className="w-full justify-center" large>
                        <Plus className="mr-1"/>
                        Добавить платеж
                    </AccentButton>
                </div>
            </form>
        </div>
    </ModalWindow>
}