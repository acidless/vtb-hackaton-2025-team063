'use client';

type Props = {
    className?: string;
    onClick: () => void;
    children: any;
}

const ActionBlock = ({children, onClick, className = ""}: Props) => {
    return <button onClick={onClick}
                   className={`rounded-xl px-4 py-3 bg-primary-light text-left text-base cursor-pointer ${className}`}>
        {children}
    </button>
}

export default ActionBlock;