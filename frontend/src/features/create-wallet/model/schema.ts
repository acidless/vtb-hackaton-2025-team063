import * as yup from "yup";
import {AccountType} from "@/entities/account/model/types";
import {validateBalance} from "@/shared/lib/validateBalanceFromCtx";

export const schema = yup
    .object({
        walletName: yup
            .string()
            .required("Введите название кошелька")
            .min(1, "Название слишком короткое")
            .max(128, "Название не должно превышать 128 символов"),

        walletAmount: yup
            .number()
            .typeError("Введите числовое значение")
            .required("Укажите сумму кошелька")
            .min(1, "Минимальная сумма - 1₽")
            .max(10000000, "Максимальная сумма - 10 000 000₽"),

        walletAccountFrom: yup
            .mixed<AccountType>()
            .required('Выберите счет')
            .when("walletAmount", (amount, schema) =>
                schema.test(
                    "enough-balance",
                    "Недостаточно средств на счёте",
                    (account) => validateBalance(account, amount)
                )
            ),

        walletCategory: yup
            .string()
            .required("Укажите категорию кошелька"),

        walletBank: yup
            .string()
            .required("Выберите банк"),
    })
    .required();