import {motion} from "framer-motion";
import Checkbox from "@/shared/ui/inputs/Checkbox";
import {useState} from "react";
import {useMutation} from "@tanstack/react-query";
import {notificationsSubscribe, notificationsUnsubscribe} from "@/entities/notification";

type Props = {
    isActive: boolean;
}

const PushNotificationsToggle = ({isActive}: Props) => {
    const [isPushEnabled, setPushEnabled] = useState(isActive);

    const {mutate: enableNotifications} = useMutation({
        mutationFn: notificationsSubscribe,
        onError: error => {
            setPushEnabled(prevState => !prevState);
        }
    });

    const {mutate: disableNotifications} = useMutation({
        mutationFn: notificationsUnsubscribe,
        onError: error => {
            setPushEnabled(prevState => !prevState);
        }
    });

    function toggleNotifications() {
        if(isPushEnabled) {
            disableNotifications();
        } else {
            enableNotifications();
        }

        setPushEnabled(prevState => !prevState);
    }

    return <div className="bg-tertiary rounded-xl px-2.5">
        <motion.div className="h-[2.625rem] flex items-center justify-between"
                    initial={{opacity: 0, y: 10}}
                    animate={{opacity: 1, y: 0}}
                    exit={{opacity: 0, y: -10}}
                    transition={{duration: 0.3}}>
            <p className="text-base font-medium">Push-уведомления</p>
            <Checkbox value={isPushEnabled} onChange={toggleNotifications}/>
        </motion.div>
    </div>;
}

export default PushNotificationsToggle;