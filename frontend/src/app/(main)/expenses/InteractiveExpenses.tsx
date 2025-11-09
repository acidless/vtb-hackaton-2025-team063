"use client";

import {ExpenseCategoryType, getExpenseCategories} from "@/entities/expense-category";
import {ExpenseType, getExpenses, updateExpenseCategory} from "@/entities/expense";
import PersonalExpenses from "@/app/(main)/expenses/PersonalExpenses";
import ExpenseHistory from "@/app/(main)/expenses/ExpenseHistory";
import {DndContext, pointerWithin} from "@dnd-kit/core";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

type Props = {
    avatar: string;
}

const InteractiveExpenses = ({avatar}: Props) => {
    const queryClient = useQueryClient();

    const expenses = queryClient.getQueryData(["expenses"]) as ExpenseType[];
    const categories = queryClient.getQueryData(["expense-categories"]) as ExpenseCategoryType[];

    // const {mutate: updateCategory, isPending} = useMutation({
    //     mutationFn: updateExpenseCategory,
    //     onSuccess: () => {
    //         queryClient.invalidateQueries({queryKey: ["expense-categories"]});
    //         queryClient.invalidateQueries({queryKey: ["expenses"]});
    //     },
    // });

    return <DndContext collisionDetection={pointerWithin} onDragEnd={(event) => {
        const {active, over} = event;

        if (!over) {
            return;
        }

        const expense = active.data.current;
        const category = over.data?.current;
        if(!category || !expense) {
            return;
        }

        //updateCategory({categoryId: category.id, expenseId: expense.expense.id});
    }}>
        <PersonalExpenses avatar={avatar} expenseCategories={categories}/>
        <ExpenseHistory expenses={expenses}/>
    </DndContext>
}

export default InteractiveExpenses;