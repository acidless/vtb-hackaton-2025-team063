import {TransactionType} from "@/entities/transaction";
import MoneyAmount from "@/shared/ui/MoneyAmount";
import {motion} from "framer-motion";
import {BankTag} from "@/entities/transaction/ui/BankTag";
import Date from "@/shared/ui/typography/Date";

type Props = {
    transaction: TransactionType;
}

export const TransactionLight = ({transaction}: Props) => {
    return <motion.article className="flex items-center justify-between py-2.5 border-b-1 border-gray-200"
                           initial={{opacity: 0, y: 10}}
                           animate={{opacity: 1, y: 0}}
                           exit={{opacity: 0, y: -10}}
                           transition={{duration: 0.3}}>
        <div className="flex flex-col min-w-0">
            <p className="text-lg font-semibold min-w-0 text-ellipsis overflow-hidden whitespace-nowrap">{transaction.name}</p>
            <div className="flex gap-1">
                <BankTag bank={transaction.bank}/>
                <Date date={transaction.date}/>
            </div>
        </div>
        <div className="shrink-0 flex flex-col items-end">
            <p className={`text-sm ${transaction.outcome ? "text-error" : "text-success"}`}>
                {transaction.outcome ? "-" : "+"}<MoneyAmount value={transaction.value}/>
            </p>
        </div>
    </motion.article>
}