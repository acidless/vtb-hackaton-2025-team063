import Image from "next/image";
import {TransactionCategories} from "@/entities/transaction-category";

type Props = {
    categoryId: number;
}

export const TransactionCategoryAvatar = ({categoryId}: Props) => {
    if(!categoryId) {
        return null;
    }

    return <div className="shrink-0 w-[3.125rem] h-[3.125rem] rounded-full relative"
                style={{backgroundColor: TransactionCategories[categoryId].color}}>
        <Image className="p-3" src={`/images/categories/${TransactionCategories[categoryId].icon}`} alt={TransactionCategories[categoryId].name} fill sizes="50px"/>
    </div>
}
