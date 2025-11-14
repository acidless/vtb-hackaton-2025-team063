import EditableField from "@/app/(main)/settings/EditableField";
import {updateUser, useFormattedPhone, UserType} from "@/entities/user";
import {forwardRef} from "react";
import {IMaskInput} from "react-imask";
import {useQueryClient} from "@tanstack/react-query";
import phoneToPlain from "@/shared/lib/phoneToPlain";

const MaskedPhoneInput = forwardRef<HTMLInputElement, any>((props, ref) => (
    <IMaskInput
        {...props}
        inputRef={ref}
        mask="+{7} (000) 000-00-00"
        unmask={false}
        type="tel"
        inputMode="numeric"
        className="min-w-0 flex-1 large text-sm text-primary py-2.5 px-2.5 bg-tertiary rounded-xl font-normal outline-primary"
    />
));

type Props = {
    user: UserType | null;
}

const ProfileEditableData = ({user}: Props) => {
    const queryClient = useQueryClient();
    const formattedPhone = useFormattedPhone(user?.phone);

    function onSuccess() {
        queryClient.invalidateQueries({queryKey: ["user"]});
    }

    return <div className="flex flex-col items-stretch gap-1 mb-[1.875rem]">
        <EditableField value={user?.name || ""} mutationFn={updateUser} transformValue={(name) => ({name})}
                       onSuccess={onSuccess}/>
        <EditableField InputComponent={MaskedPhoneInput} value={formattedPhone} mutationFn={updateUser}
                       transformValue={(phone) => ({phone: phoneToPlain(phone)})}
                       onSuccess={onSuccess}/>
    </div>
}

export default ProfileEditableData