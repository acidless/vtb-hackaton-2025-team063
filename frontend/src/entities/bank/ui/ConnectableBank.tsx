import {Bank} from "@/entities/bank";
import {Check} from "@/shared/ui/icons/Check";

type Props = {
    bank: Bank;
    isConnected: boolean;
}

export const ConnectableBank = ({bank, isConnected}: Props) => {
    return <article className={`${isConnected ? "bg-primary-light" : "bg-tertiary"} rounded-xl flex items-center justify-between px-1.5 py-2.5`}>
        <div className="flex items-center gap-2">
            <div style={{background: bank.iconBg}}
                 className="w-8 h-8 rounded-md text-lg flex justify-center items-center">🏦
            </div>
            <p className="text-base font-semibold">{bank.name}</p>
        </div>
        {isConnected && <div className="text-active"><Check/></div>}
    </article>
}