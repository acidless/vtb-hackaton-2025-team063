import {type GoalType} from "@/entities/goal/model/types";
import Image from "next/image";

type Props = {
    goal: GoalType;
}

export const Goal = ({goal}: Props) => {
    const formattedDeadline = new Intl.DateTimeFormat('ru-RU', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    }).format(goal.deadline);

    return <article className="bg-tertiary rounded-xl p-1.5 flex items-center gap-2">
        <div className="w-[3.125rem] h-[3.125rem] rounded-full relative bg-accent">
            {goal.avatar && <Image className="rounded-full" src={goal.avatar} alt={goal.name} fill/>}
        </div>
        <div className="flex flex-col">
            <p className="text-primary font-medium">{goal.name}</p>
            <time className="text-secondary text-[0.75rem]">{formattedDeadline}</time>
        </div>
        <div className="ml-auto">
            <p className="text-primary font-medium text-[0.875rem]">
                {new Intl.NumberFormat('ru-RU').format(goal.money)} ₽
            </p>
        </div>
    </article>
}
