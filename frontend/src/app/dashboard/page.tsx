import SharedBalance from "@/app/dashboard/SharedBalance";
import FastActions from "@/app/dashboard/FastActions";
import Accounts from "@/app/dashboard/Accounts";
import Goals from "@/app/dashboard/Goals";
import UpcomingPayments from "@/app/dashboard/UpcomingPayments";

export default async function Dashboard() {
    return <div>
        <SharedBalance personFirst={{avatar: "/images/man.png", accountDigits: "0934"}}
                       personSecond={{avatar: "/images/woman.png", accountDigits: "1289"}} balance={12345000}
                       monthlyIncome={120000}/>
        <FastActions/>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <Accounts firstAccounts={{name: "Мария", accounts: [{type: "mir", digits:"0934"}, {type: "mir", digits:"0956"}, {type: "mir", digits:"1324"}]}}
                          secondAccounts={{name: "Пётр", accounts: [{type: "mir", digits:"1289"}, {type: "mir", digits:"5212"}, {type: "mir", digits:"7422"}]}}/>
                <UpcomingPayments/>
            </div>
            <div>
                <Goals goals={[
                    {id: 1, name: "Поездка на море", deadline: new Date(2025, 8, 29), money: 200000},
                    {id: 2, name: "Поездка на море", deadline: new Date(2025, 8, 29), money: 200000},
                ]}/>
            </div>
        </div>

    </div>
}