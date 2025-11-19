import {ConditionsApprove} from "@/widgets/conditions-approve";
import {motion} from "framer-motion";

type Props = {
    onApprove: () => {}
}

const RegisterConditionApprove = ({onApprove}: Props) => {
    return <motion.div
        className="p-4 rounded-xl bg-white"
        initial={{opacity: 0, y: 10}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: -10}}
        transition={{duration: 0.3}}>
        <ConditionsApprove onContinue={onApprove}/>
    </motion.div>
}

export default RegisterConditionApprove;