"use client";

import Heading from "@/shared/ui/typography/Heading";
import Avatar from "@/shared/ui/Avatar";
import {useState} from "react";
import Checkbox from "@/shared/ui/inputs/Checkbox";
import {motion} from "framer-motion";
import {useQuery} from "@tanstack/react-query";
import getAbsoluteSeverUrl from "@/shared/lib/getAbsoluteServerUrl";
import {authUser, UserType} from "@/entities/user";
import ProfileEditableData from "@/app/(main)/settings/ProfileEditableData";
import PushNotificationsToggle from "@/app/(main)/settings/PushNotificationsToggle";


type Props = {
    className?: string;
    userInitial: UserType | null;
    settings: {
        pushEnabled: boolean;
    }
}

const MyProfile = ({className, userInitial, settings}: Props) => {
    const [isPushEnabled, setPushEnabled] = useState(settings.pushEnabled);

    const {data: user = null} = useQuery({
        queryKey: ["user"],
        queryFn: authUser,
        initialData: userInitial,
        refetchOnReconnect: false,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    });

    return <section className={`${className} mb-[1.875rem]`}>
        <div className="mb-2.5 flex items-center justify-between">
            <Heading className="md:text-3xl" level={2}>Мой профиль</Heading>
            <Avatar avatar={getAbsoluteSeverUrl(user?.avatar)}/>
        </div>
        <ProfileEditableData user={user}/>
        <div>
            <PushNotificationsToggle isActive={settings.pushEnabled}/>
        </div>
    </section>
}

export default MyProfile;