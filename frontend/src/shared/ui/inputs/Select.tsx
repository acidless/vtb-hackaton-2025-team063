import {useEffect, useMemo, useRef, useState} from "react";
import {ChevronDown} from "@/shared/ui/icons/ChevronDown";

type Props = {
    className?: string;
    onChange?: (value: string) => void;
    options: { value: string; label: string }[];
}

const Select = ({options, className, onChange}: Props) => {
    const [value, setValue] = useState(0);
    const [isOpen, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    function handleChange(value: string, index: number) {
        setValue(index);

        if(onChange){
            onChange(value);
        }

        setOpen(false);
    }

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return <div ref={ref} className={`relative ${className}`}>
        <div
            onClick={() => setOpen(!isOpen)}
            className="pl-1.5 pr-2.5 py-1.5 text-xs placeholder:text-3xl bg-tertiary rounded-xl font-normal flex items-center justify-between gap-4">
            <p>{options[value].label}</p>
            <ChevronDown className={`transition-transform duration-300 ${isOpen ? "rotate-180" : "rotate-0"}`} />
        </div>
        <div className={`z-10 absolute w-full p-2 top-[105%] transition-all duration-300 rounded-xl bg-tertiary ${isOpen ? " opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 -translate-y-1/2 pointer-events-none"}`}>
            <ul className="list-none flex flex-col gap-1">
                {options.map((option, i) => (
                    <li onClick={() => handleChange(option.value, i)} className={`font-normal text-xs ${i === value ? 'text-active' : 'text-primary'}`} key={option.label}>{option.label}</li>
                ))}
            </ul>
        </div>
    </div>
}

export default Select;