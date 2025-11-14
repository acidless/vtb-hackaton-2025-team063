import Heading from "@/shared/ui/typography/Heading";
import {BankKey, banks} from "@/entities/bank";

type Props = {
    bankId: BankKey;
    selectBank: (bankId: BankKey) => void;
    isSelected: boolean;
}

export const ConnectableBankOnRegister = ({bankId, selectBank, isSelected}: Props) => {
    return <button key={bankId} onClick={() => selectBank(bankId)}
                   className={`p-5 rounded-xl text-left cursor-pointer duration-300 transition-colors ${isSelected ? "bg-primary text-white" : "bg-white"}`}>
        <Heading className="leading-none!" level={3}>{banks[bankId].name}</Heading>
    </button>;
}