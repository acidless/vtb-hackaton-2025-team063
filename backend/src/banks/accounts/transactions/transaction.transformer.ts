import {TransactionType} from "../../banks.types";
import {Injectable} from "@nestjs/common";
import {CATEGORIES, CategoriesConfig} from "./categories/categories.config";
import {BanksConfig} from "../../banks.config";

export interface TransformedTransaction {
    id: string;
    category: {
        id: number;
        name: string;
    };
    name: string;
    value: number;
    outcome: boolean;
    bank: string;
    status: "completed" | string;
    date: Date;
}

@Injectable()
export class TransactionsTransformer {
    private mssToCategory = {
        '7832': CATEGORIES.ENTERTAINMENT, // Кинотеатры
        '7922': CATEGORIES.ENTERTAINMENT, // Театры, концерты
        '7995': CATEGORIES.ENTERTAINMENT, // Онлайн-игры, ставки
        '7996': CATEGORIES.ENTERTAINMENT, // Парки развлечений
        '7997': CATEGORIES.ENTERTAINMENT, // Фитнес-клубы, спортзалы
        '7999': CATEGORIES.ENTERTAINMENT, // Другое развлечение

        // 🛒 Продукты
        '5411': CATEGORIES.GROCERIES, // Продуктовые магазины, супермаркеты
        '5422': CATEGORIES.GROCERIES, // Мясные лавки
        '5441': CATEGORIES.GROCERIES, // Кондитерские, пекарни
        '5451': CATEGORIES.GROCERIES, // Молочные магазины
        '5499': CATEGORIES.GROCERIES, // Прочие магазины еды (фермы, ярмарки)

        // 💡 ЖКХ и связь
        '4812': CATEGORIES.COMMUNICATION, // Телекоммуникации, мобильная связь
        '4814': CATEGORIES.COMMUNICATION, // Интернет-услуги
        '4900': CATEGORIES.COMMUNICATION, // Коммунальные платежи (газ, вода, электричество)

        // 🚗 Транспорт
        '4111': CATEGORIES.TRANSPORT, // Общественный транспорт
        '4121': CATEGORIES.TRANSPORT, // Такси, перевозки
        '4784': CATEGORIES.TRANSPORT, // Платные дороги, парковки
        '5541': CATEGORIES.TRANSPORT, // Заправки
        '5542': CATEGORIES.TRANSPORT, // Автозаправки с магазином
        '7512': CATEGORIES.TRANSPORT, // Прокат автомобилей

        // 👗 Одежда и обувь
        '5137': CATEGORIES.CLOTHES, // Магазины одежды
        '5651': CATEGORIES.CLOTHES, // Женская одежда
        '5661': CATEGORIES.CLOTHES, // Обувь
        '5691': CATEGORIES.CLOTHES, // Универсальные магазины одежды
        '5699': CATEGORIES.CLOTHES, // Прочие аксессуары и одежда

        // 🎁 Подарки
        '5947': CATEGORIES.GIFTS, // Подарочные магазины
        '5945': CATEGORIES.GIFTS, // Игрушки, детские товары
        '5944': CATEGORIES.GIFTS, // Ювелирные изделия
        '5999': CATEGORIES.GIFTS, // Разное (сувениры, подарочные лавки)

        // 🏥 Здоровье
        '5912': CATEGORIES.HEALTHCARE, // Аптеки
        '8011': CATEGORIES.HEALTHCARE, // Врачи, клиники
        '8021': CATEGORIES.HEALTHCARE, // Стоматологи
        '8062': CATEGORIES.HEALTHCARE, // Больницы
        '8099': CATEGORIES.HEALTHCARE, // Прочие медуслуги

        // 🍽️ Кафе и рестораны
        '5812': CATEGORIES.RESTAURANTS, // Рестораны
        '5813': CATEGORIES.RESTAURANTS, // Бары
        '5814': CATEGORIES.RESTAURANTS, // Фастфуд
        '5462': CATEGORIES.RESTAURANTS, // Булочные, кафе
        '5494': CATEGORIES.RESTAURANTS, // Мясные / гастрономические лавки с кулинарией

        // ❓ Прочее
        '6011': CATEGORIES.OTHER, // Финансовые учреждения
        '7399': CATEGORIES.OTHER, // Услуги разного типа
        '8999': CATEGORIES.OTHER, // Разные профессиональные услуги
        '6012': CATEGORIES.OTHER, // Онлайн-платежи, переводы
    }

    transform(raw: TransactionType, bankId: string): TransformedTransaction {
        let categoryId = raw.merchant ? this.mssToCategory[raw.merchant.mccCode] : null;
        if(!categoryId) {
            categoryId = CATEGORIES.OTHER;
        }

        return {
            id: raw.transactionId,
            value: parseFloat(raw.amount.amount),
            category: {
                id: categoryId,
                name: CategoriesConfig[categoryId].name,
            },
            bank: BanksConfig[bankId].name,
            name: raw.transactionInformation,
            date: new Date(raw.valueDateTime),
            status: raw.status,
            outcome: raw.creditDebitIndicator === 'Debit',
        };
    }
}