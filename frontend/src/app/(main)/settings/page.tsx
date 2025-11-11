import MyProfile from "./MyProfile";
import ManageFamily from "./ManageFamily";
import AppData from "@/app/(main)/settings/AppData";
import {QueryClient} from "@tanstack/react-query";
import {getFamily} from "@/entities/family";
import BanksConnect from "@/app/(main)/settings/BanksConnect";
import {getConsents} from "@/entities/bank";

export default async function Settings() {
    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({queryKey: ["family"], queryFn: getFamily}),
        queryClient.prefetchQuery({queryKey: ["consents"], queryFn: getConsents}),
    ]);

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <MyProfile settings={{pushEnabled: true}}/>
                <BanksConnect/>
            </div>
            <div>
                <ManageFamily/>
                <AppData/>
            </div>
        </div>
    </div>
}