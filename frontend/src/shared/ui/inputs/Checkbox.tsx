import {Checkmark} from "@/shared/ui/icons/Checkmark";

type Props = {
    value: boolean;
    onChange: (value: boolean) => void;
}

const Checkbox = ({value, onChange, children}: Props) => {
    return <div className="flex items-center gap-2 flex-wrap cursor-pointer" onClick={() => onChange(!value)}>
        <div role="checkbox" className={`flex items-center justify-center text-white cursor-pointer w-4 h-4 border-1 transition-colors duration-300 ${value ? "bg-primary border-transparent" : "bg-tertiary border-neutral-400"} rounded-sm overflow-hidden relative`}>
            {value ? <Checkmark className="w-2 h-2"/> : <></>}
        </div>
        {children}
    </div>
}

export default Checkbox;