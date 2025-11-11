import * as yup from "yup";

export const schema = yup
    .object({
        clientId: yup
            .string()
            .required("Введите идентификатор клиента"),
    })
    .required();