import Limits from "@/app/(main)/expenses/Limits";
import SharedExpenses from "@/app/(main)/expenses/SharedExpenses";
import ExpensesDistribution from "@/app/(main)/expenses/ExpensesDistribution";
import InteractiveTransactions from "@/app/(main)/expenses/InteractiveTransactions";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getLimits} from "@/entities/limit";
import {getTransactions} from "@/entities/transaction";
import {getFamily} from "@/entities/family";
import {getFamilyExpenses} from "@/entities/family/api/api";

export default async function Expenses() {
    const members = await getFamily();

    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({queryKey: ["family-expenses"], queryFn: getFamilyExpenses}),
        queryClient.prefetchQuery({queryKey: ["transactions"], queryFn: getTransactions}),
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
                <ExpensesDistribution firstAvatar={members[0].avatar} secondAvatar={members[1].avatar}/>
            </div>
        </div>
    </div>
}