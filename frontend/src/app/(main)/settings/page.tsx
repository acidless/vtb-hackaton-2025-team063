import MyProfile from "./MyProfile";
import ManageFamily from "./ManageFamily";
import AppData from "@/app/(main)/settings/AppData";
import {fetchMock} from "@/shared/lib/fetchMock";
import {QueryClient} from "@tanstack/react-query";
import {getFamily} from "@/entities/family";
import BanksConnect from "@/app/(main)/settings/BanksConnect";

export default async function Settings() {
    const profile = await fetchMock("/api/users");

    const queryClient = new QueryClient();

    await Promise.all([
        queryClient.prefetchQuery({queryKey: ["family"], queryFn: getFamily}),
    ]);

    return <div>
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-8">
            <div>
                <MyProfile settings={profile.settings}/>
                <BanksConnect/>
            </div>
            <div>
                <ManageFamily/>
                <AppData/>
            </div>
        </div>
    </div>
}