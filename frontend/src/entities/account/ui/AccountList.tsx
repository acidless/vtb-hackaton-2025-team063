import {type Accounts} from "@/entities/account/model/types";
import Heading from "@/shared/ui/typography/Heading";
import Image from "next/image";
import {Plus} from "lucide-react";

type Props = {
    className?: string;
    style?: object;
    accounts: Accounts;
}

export const AccountList = ({accounts, ...props}: Props) => {
    return <div className="right-blurred" {...props}>
        <Heading level={3}>{accounts.name}</Heading>
        <div className="flex items-center gap-1 w-full overflow-x-auto pr-4">
            {accounts.accounts.map((account, index) => (
                <button
                    className="text-center bg-primary-light rounded-xl p-2 flex gap-4"
                    key={index}>
                    <div className="w-9 h-2.5 relative mb-10">
                        <Image fill src="/images/mir.svg" alt="MIR" />
                    </div>
                    <div className="content-end">
                        <span className="text-[0.75rem] font-medium text-active">{account.digits}</span>
                    </div>
                </button>
            ))}
            <button className="bg-accent p-0.5 rounded-full ml-0.5 cursor-pointer">
                <Plus className="w-5 h-5 text-white" />
            </button>
        </div>
    </div>;
}