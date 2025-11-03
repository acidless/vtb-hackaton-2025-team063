'use client';

import ActionBlock from "@/shared/ui/ActionBlock";

const FastActions = () => {
    return <section className="relative ml-4 mb-5 max-w-full right-blurred">
        <div className="flex gap-1 overflow-x-auto pr-6">
            <ActionBlock onClick={() => {}} className="line-clamp-2 min-w-fit leading-snug">
                Добавить новую цель
            </ActionBlock>
            <ActionBlock onClick={() => {}} className="line-clamp-2 min-w-fit leading-snug">
                Общие траты на месяц
            </ActionBlock>
            <ActionBlock onClick={() => {}} className="line-clamp-2 min-w-fit leading-snug">
                Советы по тратам
            </ActionBlock>
        </div>
    </section>
}

export default FastActions;