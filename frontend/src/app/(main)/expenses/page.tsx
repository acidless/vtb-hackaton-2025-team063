import Limits from "@/app/(main)/expenses/Limits";
import SharedExpenses from "@/app/(main)/expenses/SharedExpenses";
import ExpensesDistribution from "@/app/(main)/expenses/ExpensesDistribution";
import InteractiveTransactions from "@/app/(main)/expenses/InteractiveTransactions";
import {fetchMock} from "@/shared/lib/fetchMock";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getTransactionsCategories} from "@/entities/transaction-category";
import {getLimits} from "@/entities/limit";
import {getTransactions} from "@/entities/transaction";
import universalFetch from "@/shared/lib/universalFetch";
import {UserType} from "@/entities/user";

export default async function Expenses() {
    const members = await universalFetch<UserType[]>("/family");

    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({queryKey: ["transactions"], queryFn: getTransactions}),
        queryClient.prefetchQuery({queryKey: ["transactions-categories"], queryFn: getTransactionsCategories}),
        queryClient.prefetchQuery({queryKey: ["limits"], queryFn: getLimits}),
    ]);

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <Limits/>
                    <SharedExpenses firstAvatar={members[0].avatar} secondAvatar={members[1].avatar}/>
                </HydrationBoundary>
            </div>
            <div>
                <HydrationBoundary state={dehydrate(queryClient)}>
                    <InteractiveTransactions avatar={members[0].avatar}/>
                </HydrationBoundary>
                <ExpensesDistribution firstPerson={{...members[0], expenses: 10000}}
                                      secondPerson={{...members[1], expenses: 20000}}/>
            </div>
        </div>
    </div>
}