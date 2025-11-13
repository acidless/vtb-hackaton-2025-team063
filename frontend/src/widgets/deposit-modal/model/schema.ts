import * as yup from "yup";
import {AccountType} from "@/entities/account/model/types";
import {validateBalance} from "@/shared/lib/validateBalanceFromCtx";

export const getSchema = (maxValue: number) => yup
    .object({
        value: yup
            .number()
            .typeError("Введите числовое значение")
            .required("Укажите сумму пополнения")
            .min(1, "Минимальная сумма — 1₽")
            .test(
                "max-topup-check",
                maxValue === 0
                    ? "Пополнение недоступно"
                    : `Максимальная сумма - ${maxValue.toLocaleString()}₽`,
                (value) => {
                    if (maxValue === 0) {
                        return false;
                    }

                    if (value === undefined || value === null) {
                        return true;
                    }

                    return value <= maxValue;
                }
            ),

        accountFrom: yup
            .mixed<AccountType>()
            .required("Выберите счёт")
            .when("value", (amount, schema) =>
                schema.test(
                    "enough-balance",
                    "Недостаточно средств на счёте",
                    (account) => validateBalance(account, amount)
                )
            ),
    })
    .required();