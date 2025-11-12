type TransactionCategoryName =
    "ЖКХ и связь"
    | "Продукты"
    | "Транспорт"
    | "Кафе и рестораны"
    | "Развлечения"
    | "Одежда и обувь"
    | "Здоровье"
    | "Подарки"
    | "Прочее";

export type TransactionCategoryType = {
    id: number;
    name: TransactionCategoryName;
    spent: number;
}

type TransactionCategory = {
    icon: string;
    color: string;
    name: string;
}

export const TransactionCategories: Record<number, TransactionCategory> = {
    1: {
        name: "Развлечения",
        color: "#FBDAB0",
        icon: "movie.png",
    },
    2: {
        name: "Продукты",
        color: "#BED3CB",
        icon: "cart.png",
    },
    3: {
        name: "ЖКХ и связь",
        color: "#C3CCEF",
        icon: "tv.png",
    },
    4: {
        name: "Транспорт",
        color: "#C3D1DF",
        icon: "car.png",
    },
    5: {
        name: "Одежда и обувь",
        color: "#D5C7D9",
        icon: "clothes.png",
    },
    6: {
        name: "Подарки",
        color: "#F7BFC5",
        icon: "gift.png",
    },
    7: {
        name: "Здоровье",
        color: "#BEE4F5",
        icon: "pills.png",
    },
    8: {
        name: "Кафе и рестораны",
        color: "#F2B8BE",
        icon: "pizza.png",
    },
    9: {
        name: "Прочее",
        color: "#D1D2D3",
        icon: "lightning.png",
    },
}

export const TransactionsCategoriesOptions = Object.entries(TransactionCategories).map(([id, category]) => ({
    label: category.name,
    value: id.toString()
}));
