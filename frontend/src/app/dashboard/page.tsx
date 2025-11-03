import SharedBalance from "@/app/dashboard/SharedBalance";
import Accounts from "@/app/dashboard/Accounts";
import Goals from "@/app/dashboard/Goals";
import UpcomingPayments from "@/app/dashboard/UpcomingPayments";

export default async function Dashboard() {
    return <div>
        <SharedBalance personFirst={{avatar: "/images/man.png", accountDigits: "0934"}}
                       personSecond={{avatar: "/images/woman.png", accountDigits: "1289"}} balance={12345000}
                       monthlyIncome={120000}/>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <Accounts firstAccount={{name: "Мария", balance: 120000, avatar: "/images/woman.png"}}
                          secondAccount={{name: "Пётр", balance: 120000, avatar: "/images/man.png"}}/>
                <UpcomingPayments/>
            </div>
            <div>
                <Goals goals={[
                    {id: 1, name: "Поездка на море", deadline: new Date(2025, 8, 29), moneyCollected: 200000, moneyNeed: 230000},
                    {id: 2, name: "Квартира у моря", deadline: new Date(2026, 3, 14), moneyCollected: 230000, moneyNeed: 450000000},
                ]}/>
            </div>
        </div>

    </div>
}