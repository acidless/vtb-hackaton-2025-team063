"use client";

import {getTransactionsCategories, TransactionCategories} from "@/entities/transaction-category";
import {getTransactions, TransactionType, updateTransactionCategory} from "@/entities/transaction";
import PersonalExpenses from "@/app/(main)/expenses/PersonalExpenses";
import TransactionHistory from "@/app/(main)/expenses/TransactionHistory";
import {DndContext, pointerWithin} from "@dnd-kit/core";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";

type Props = {
    avatar: string;
}

const InteractiveExpenses = ({avatar}: Props) => {
    const {data: transactions = []} = useQuery({
        queryKey: ["transactions"],
        queryFn: getTransactions,
        refetchInterval: 5000
    });

    const {data: categories = []} = useQuery({
        queryKey: ["transactions-categories"],
        queryFn: getTransactionsCategories,
        refetchInterval: 5000
    });

    const queryClient = useQueryClient();

    const {mutate: updateCategory, isPending} = useMutation({
        mutationFn: updateTransactionCategory,
        onMutate: async ({categoryId, transactionId}) => {
            await queryClient.cancelQueries({queryKey: ["transactions"]});
            await queryClient.cancelQueries({queryKey: ["transactions-categories"]});

            const previousTransactions = queryClient.getQueryData(["transactions"]);
            const previousCategories = queryClient.getQueryData(["transactions-categories"]);

            queryClient.setQueryData(["transactions"], (old: TransactionType[] = []) =>
                old.map(tx =>
                    tx.id === transactionId ? {
                        ...tx,
                        category: {id: categoryId, name: TransactionCategories[categoryId].name}
                    } : tx
                )
            );

            return {previousTransactions, previousCategories};
        },

        onError: (_err, _vars, context) => {
            if (context?.previousTransactions) {
                queryClient.setQueryData(["transactions"], context.previousTransactions);
            }
            if (context?.previousCategories) {
                queryClient.setQueryData(["transactions-categories"], context.previousCategories);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ["transactions"]});
            queryClient.invalidateQueries({queryKey: ["transactions-categories"]});
        },
    });

    return <DndContext collisionDetection={pointerWithin} onDragEnd={(event) => {
        const {active, over} = event;

        if (!over) {
            return;
        }

        const transaction = active.data.current;
        const category = over.data?.current;
        if (!category || !transaction) {
            return;
        }

        updateCategory({categoryId: Number(category.id), transactionId: transaction.transaction.id});
    }}>
        <PersonalExpenses avatar={avatar} expenseCategories={categories}/>
        <TransactionHistory transactions={transactions}/>
    </DndContext>
}

export default InteractiveExpenses;