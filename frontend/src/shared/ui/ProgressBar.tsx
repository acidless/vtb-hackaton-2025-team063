'use client';

import { motion } from "framer-motion";

type Props = {
    value: number;
    max: number;
    canOverflow?: boolean;
}

const ProgressBar = ({value, max, canOverflow}: Props) => {
    const percent = Math.min((value / max) * 100, 100);
    const isOverflow = percent >= 100;

    return <div className="h-1 w-full bg-accent-transparent rounded-2xl">
        <motion.div
            initial={{width: 0}}
            animate={{width: `${percent}%`}}
            transition={{duration: 0.6, ease: 'easeOut'}}
            className={`${canOverflow && isOverflow ? 'bg-error' : 'bg-accent'} h-1 rounded-2xl`}
        />
    </div>;
}

export default ProgressBar;