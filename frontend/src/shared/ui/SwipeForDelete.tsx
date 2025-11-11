"use client";

import {motion, useAnimation, useMotionValue} from "framer-motion";
import {ReactNode, useState} from "react";
import {Delete} from "@/shared/ui/icons/Delete";

type Props = {
    canSwipe?: boolean;
    onDelete: () => void;
    children: ReactNode;
}

const SwipeForDelete = ({onDelete, children, canSwipe = true}: Props) => {
    const [open, setOpen] = useState(false);
    const x = useMotionValue(0);
    const controls = useAnimation();

    const handleDragEnd = (_: any, info: any) => {
        if (info.offset.x < -40) {
            setOpen(true);
        } else {
            setOpen(false);
        }
    };

    async function handleDelete() {
        await controls.start({ x: 0, transition: { duration: 0.25 } });
        setOpen(false);
        onDelete();
    }

    return <>
        <motion.button
            className={`absolute cursor-pointer right-0 top-0 bottom-0 rounded-xl w-[40px] bg-error flex items-center justify-center text-white ${open ? "pointer-events-auto" : "pointer-events-none"}`}
            initial={{opacity: 0}}
            animate={{opacity: open ? 1 : 0}}
            transition={{duration: 0.25}}
            onClick={handleDelete}
        >
            <Delete className="pointer-events-none"/>
        </motion.button>

        <motion.article
            drag={canSwipe ? "x" : false}
            dragConstraints={{left: -45, right: 0}}
            style={{x}}
            onDragEnd={handleDragEnd}
            animate={{x: open ? -45 : 0}}
            transition={{type: "spring", stiffness: 300, damping: 30}}
        >
            {children}
        </motion.article>
    </>
}

export default SwipeForDelete;