import Image from "next/image";
import {TransactionCategories} from "@/entities/transaction-category";

type Props = {
    categoryId: number;
    withBg?: boolean;
    className?: string;
}

export const TransactionCategoryAvatar = ({categoryId, withBg, className}: Props) => {
    if(!categoryId) {
        return null;
    }

    return <div className={`shrink-0 w-[3.125rem] h-[3.125rem] rounded-full relative ${className}`}
                style={{backgroundColor: withBg ? TransactionCategories[categoryId].color : "var(--health-color)"}}>
        <Image className="p-3" src={`/images/categories/${TransactionCategories[categoryId].icon}`} alt={TransactionCategories[categoryId].name} fill sizes="3.125rem"/>
    </div>
}
