import SharedCashback from "@/app/(main)/cashback/SharedCashback";
import {getFamily} from "@/entities/family";
import BestCashbackList from "@/app/(main)/cashback/BestCashbackList";
import YourCards from "@/app/(main)/cashback/YourCards";
import CashbackPromo from "@/app/(main)/cashback/CashbackPromo";

export default async function Cashback() {
    const [family] = await Promise.all([getFamily()]);

    return <div className="mb-24">
        <SharedCashback familyInitial={family}/>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8 mb-20">
            <div>
                <BestCashbackList className="mx-4 md:mr-0" familyInitial={family} cashbackInitial={[{
                    user: 12,
                    card: "12312312312312",
                    category: 1,
                    cashback: 100,
                    bank: "abank",
                    date: new Date(),
                    percents: 10
                },
                    {
                        user: 24,
                        card: "12312312312312",
                        category: 2,
                        cashback: 100,
                        bank: "abank",
                        date: new Date(),
                        percents: 10
                    },
                    {
                        user: 24,
                        card: "123123123543543",
                        category: 2,
                        cashback: 320,
                        bank: "abank",
                        date: new Date(),
                        percents: 12
                    },
                    {
                        user: 12,
                        card: "12312312312312",
                        category: 3,
                        cashback: 100,
                        bank: "abank",
                        date: new Date(),
                        percents: 10
                    },
                    {
                        user: 12,
                        card: "12312312312312",
                        category: 4,
                        cashback: 100,
                        bank: "abank",
                        date: new Date(),
                        percents: 10
                    },
                    {
                        user: 12,
                        card: "12312312312312",
                        category: 5,
                        cashback: 100,
                        bank: "abank",
                        date: new Date(),
                        percents: 10
                    }, {
                        user: 12,
                        card: "12312312312312",
                        category: 6,
                        cashback: 100,
                        bank: "abank",
                        date: new Date(),
                        percents: 10
                    }
                ]}/>
                <CashbackPromo className="mx-4 md:mr-0"/>
            </div>
            <div>
                <YourCards className="mx-4 md:ml-0" familyInitial={family} cardsCashbackInitial={[
                    {
                        card: "1233123123",
                        user: 12,
                        total: 12450,
                        categories: [
                            {
                                id: 1,
                                cashback: 150
                            },
                            {
                                id: 2,
                                cashback: 325
                            },
                            {
                                id: 3,
                                cashback: 55
                            },
                            {
                                id: 4,
                                cashback: 652
                            }
                        ]
                    },
                    {
                        card: "2453451312",
                        user: 24,
                        total: 12450,
                        categories: [
                            {
                                id: 1,
                                cashback: 550
                            },
                            {
                                id: 2,
                                cashback: 325
                            },
                            {
                                id: 3,
                                cashback: 15
                            },
                            {
                                id: 4,
                                cashback: 652
                            }
                        ]
                    },
                    {
                        card: "654645645645",
                        user: 24,
                        total: 2500,
                        categories: [
                            {
                                id: 5,
                                cashback: 250
                            },
                            {
                                id: 6,
                                cashback: 125
                            },
                            {
                                id: 7,
                                cashback: 35
                            },
                            {
                                id: 8,
                                cashback: 252
                            }
                        ]
                    },
                ]}/>
            </div>
        </div>
    </div>
}