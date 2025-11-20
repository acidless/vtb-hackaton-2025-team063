import * as yup from "yup";

export const getSchema = (maxValue: number) => yup
    .object({
        autopayValue: yup
            .number()
            .typeError("Введите числовое значение")
            .required("Укажите сумму автоплатежа")
            .min(1, "Минимальная сумма — 1₽")
            .max(maxValue, `Максимальная сумма — ${maxValue}₽`),

        autopayDate: yup
            .date()
            .required("Выберите дату автоплатежа"),

        autopayGoal: yup
            .string()
            .required("Выберите категорию автоплатежа"),
    })
    .required();