import MyProfile from "./MyProfile";
import ManageFamily from "./ManageFamily";
import AppData from "@/app/(main)/settings/AppData";
import {dehydrate, HydrationBoundary, QueryClient} from "@tanstack/react-query";
import {getFamily} from "@/entities/family";
import BanksConnect from "@/app/(main)/settings/BanksConnect";
import {getConsents} from "@/entities/bank";
import {authUser} from "@/entities/user";

export default async function Settings() {
    const [user, family] = await Promise.all([authUser(), getFamily()]);

    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({queryKey: ["consents"], queryFn: getConsents}),
    ]);

    return <div>
        <HydrationBoundary state={dehydrate(queryClient)}>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 lg:gap-8 mb-20">
                <div>
                    <MyProfile className="mx-4 md:mr-0" settings={{pushEnabled: true}} userInitial={user}/>
                    <BanksConnect className="mx-4 md:mr-0"/>
                </div>
                <div>
                    <ManageFamily className="mx-4 md:ml-0" familyInitial={family}/>
                    <AppData className="mx-4 md:ml-0"/>
                </div>
            </div>
        </HydrationBoundary>
    </div>
}