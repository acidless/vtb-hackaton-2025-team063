"use client";

import {TransactionCategories} from "@/entities/transaction-category";
import {getTransactions, TransactionType, updateTransactionCategory} from "@/entities/transaction";
import PersonalExpenses from "@/app/(main)/expenses/PersonalExpenses";
import TransactionHistory from "@/app/(main)/expenses/TransactionHistory";
import {DndContext, pointerWithin} from "@dnd-kit/core";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {getFamily, getFamilyExpenses} from "@/entities/family/api/api";

const InteractiveExpenses = () => {
    const {data: transactions = []} = useQuery({
        queryKey: ["transactions"],
        queryFn: getTransactions,
        refetchInterval: 5000
    });

    const {data: family = []} = useQuery({
        queryKey: ["family"],
        queryFn: getFamily,
    });

    const {data: categories = []} = useQuery({
        queryKey: ["family-expenses"],
        queryFn: getFamilyExpenses,
        refetchInterval: 5000
    });

    const queryClient = useQueryClient();

    const {mutate: updateCategory, isPending} = useMutation({
        mutationFn: updateTransactionCategory,
        onMutate: async ({categoryId, transactionId}) => {
            await queryClient.cancelQueries({queryKey: ["transactions"]});
            await queryClient.cancelQueries({queryKey: ["family-expenses"]});

            const previousTransactions = queryClient.getQueryData<TransactionType[]>(["transactions"]);
            const previousCategories = queryClient.getQueryData(["family-expenses"]);

            queryClient.setQueryData(["transactions"], (old: TransactionType[] = []) =>
                old.map(tx =>
                    tx.id === transactionId ? {
                        ...tx,
                        category: {id: categoryId, name: TransactionCategories[categoryId].name}
                    } : tx
                )
            );

            queryClient.setQueryData(["family-expenses"], (old: any = []) => {
                if (!old[0]) {
                    return old;
                }

                const cloned = structuredClone(old);

                const tx = previousTransactions!.find((t: any) => t.id === transactionId);
                if (!tx) {
                    return old;
                }

                const amount = tx.value;
                const oldCategoryId = tx.category?.id;

                if (oldCategoryId) {
                    const prevCat = cloned[0].categories.find((c: any) => Number(c.id) === oldCategoryId);
                    if (prevCat) {
                        prevCat.spent -= amount;
                    }
                }

                const newCat = cloned[0].categories.find((c: any) => Number(c.id) === categoryId);
                if (newCat) {
                    newCat.spent += amount;
                }

                return cloned;
            });

            return {previousTransactions, previousCategories};
        },

        onError: (_err, _vars, context) => {
            if (context?.previousTransactions) {
                queryClient.setQueryData(["transactions"], context.previousTransactions);
            }
            if (context?.previousCategories) {
                queryClient.setQueryData(["family-expenses"], context.previousCategories);
            }
        },

        onSettled: () => {
            queryClient.invalidateQueries({queryKey: ["transactions"]});
            queryClient.invalidateQueries({queryKey: ["family-expenses"]});
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
        <PersonalExpenses avatar={family[0] ? family[0].avatar : ""}
                          expenseCategories={categories[0] ? categories[0].categories : []}/>
        <TransactionHistory transactions={transactions}/>
    </DndContext>
}

export default InteractiveExpenses;