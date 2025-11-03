import {AccountList, type Accounts} from "@/entities/account";

type Props = {
    firstAccounts: Accounts;
    secondAccounts: Accounts;
}

const Accounts = ({firstAccounts, secondAccounts}: Props) => {
    return <section className="flex items-center mb-6 gap-2 overflow-hidden ml-4">
        <AccountList style={{width: "calc(50% - 0.5rem)"}} accounts={firstAccounts}/>
        <AccountList style={{width: "calc(50%)"}} accounts={secondAccounts}/>
    </section>
}

export default Accounts;