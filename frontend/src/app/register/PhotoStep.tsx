import Heading from "@/shared/ui/typography/Heading";
import AccentButton from "@/shared/ui/AccentButton";
import {Export} from "@/shared/ui/icons/Export";
import { motion } from "framer-motion";

function PhotoStep() {
    return <motion.div className="p-4 rounded-xl bg-white"
                       initial={{opacity: 0, y: 10}}
                       animate={{opacity: 1, y: 0}}
                       exit={{opacity: 0, y: -10}}
                       transition={{duration: 0.3}}>
        <div className="mb-2.5">
            <Heading level={3}>
                Добавьте фото
            </Heading>
        </div>
        <div className="mb-2.5 flex flex-col items-stretch gap-2.5">
            <AccentButton large background="bg-primary"
                          className="justify-center gap-1.5 text-base! py-2.5! font-normal!">
                Загрузить с устройства
                <Export/>
            </AccentButton>
            <AccentButton large background="bg-primary" className="justify-center text-base! py-2.5! font-normal!">
                Сделать фото
            </AccentButton>
        </div>
    </motion.div>
}

export default PhotoStep;