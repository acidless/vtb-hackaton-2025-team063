export type ExpenseCategoryName =
    "ЖКХ и связь"
    | "Продукты"
    | "Транспорт"
    | "Кафе и рестораны"
    | "Развлечения"
    | "Одежда и обувь"
    | "Здоровье"
    | "Подарки"
    | "Прочее"
    | string;

export type ExpenseCategoryType = {
    name: ExpenseCategoryName;
    spent: number;
    color: string;
    icon: string;
}

export const ExpenseseCategoryIcons: Record<ExpenseCategoryName, string> = {
    "ЖКХ и связь": "tv.png",
    "Продукты": "cart.png",
    "Транспорт": "car.png",
    "Кафе и рестораны": "pizza.png",
    "Развлечения": "movie.png",
    "Одежда и обувь": "clothes.png",
    "Здоровье": "pills.png",
    "Подарки": "gift.png",
    "Прочее": "lightning.png",
}
