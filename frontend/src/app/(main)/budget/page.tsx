import Goals from "@/app/(main)/budget/Goals";
import Wallets from "@/app/(main)/budget/Wallets";
import UpcomingPayments from "@/app/(main)/budget/UpcomingPayments";
import ExpenseStats from "@/app/(main)/budget/ExpenseStats";
import {ChildAccountExtended} from "@/entities/child-account";
import {getTransactions} from "@/entities/transaction";
import {getPayments} from "@/entities/payment";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getGoals} from "@/entities/goal";
import {getWallets} from "@/entities/wallet";
import {getTransactionsCategories} from "@/entities/transaction-category";
import TransactionList from "@/app/(main)/budget/ExpenseList";

export default async function Budget() {
    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({queryKey: ["goals"], queryFn: getGoals}),
        queryClient.prefetchQuery({queryKey: ["transactions-categories"], queryFn: getTransactionsCategories}),
        queryClient.prefetchQuery({queryKey: ["transactions"], queryFn: getTransactions}),
        queryClient.prefetchQuery({queryKey: ["wallets"], queryFn: getWallets}),
        queryClient.prefetchQuery({queryKey: ["payments"],queryFn: getPayments})
    ]);

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Goals/>
                    <Wallets/>
                    <UpcomingPayments/>
                </HydrationBoundary>
            </div>
            <div>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <ChildAccountExtended/>
                    <ExpenseStats/>
                    <TransactionList/>
                </HydrationBoundary>
            </div>
        </div>
    </div>
}