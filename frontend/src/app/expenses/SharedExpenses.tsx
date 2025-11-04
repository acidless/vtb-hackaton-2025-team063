import Heading from "@/shared/ui/typography/Heading";
import CoupleAvatars from "@/shared/ui/CoupleAvatars";
import DonutChart from "@/shared/ui/DonutChart";
import {ExpenseCategory, ExpenseCategoryType} from "@/entities/expense-category";

type Props = {
    firstAvatar: string;
    secondAvatar: string;
    expenseCategories: ExpenseCategoryType[];
}

const SharedExpenses = ({firstAvatar, secondAvatar, expenseCategories}: Props) => {
    const chartData = expenseCategories.map(c => ({name: c.name, value: c.spent, color: c.color}));

    return <section className="mx-4 md:mx-0 md:mr-4 mb-5">
        <div className="flex items-center justify-between mb-2.5">
            <Heading level={2}>Общие траты</Heading>
            <CoupleAvatars firstAvatar={firstAvatar} secondAvatar={secondAvatar}/>
        </div>
        <div className="flex gap-2 items-start">
            <DonutChart data={chartData}/>
            <div className="w-1/2 flex flex-col gap-1">
                {expenseCategories.map(category => (
                    <ExpenseCategory key={category.name} expenseCategory={category}/>
                ))}
            </div>
        </div>
    </section>;
}

export default SharedExpenses;