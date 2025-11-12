import {ChildAccountCreateDummy, ChildAccountType} from "@/entities/child-account";
import {Carousel} from "@mantine/carousel";
import CollectionEmpty from "@/shared/ui/CollectionEmpty";
import {AnimatePresence} from "framer-motion";
import {JSX} from "react";

type Props = {
    childAccounts: ChildAccountType[];
    component: (account: ChildAccountType) => JSX.Element;
}

export const ChildAccountsCarousel = ({childAccounts, component}: Props) => {
    return <AnimatePresence>
        {childAccounts.length
            ? <Carousel withIndicators slideGap="0.5rem" classNames={{
                root: "px-9",
                controls: "px-0! pointer-events-none",
                control: "pointer-events-auto bg-white shadow-md hover:bg-gray-50 rounded-full w-7 h-7 flex items-center justify-center border border-gray-200",
                indicators: "-bottom-4!",
                indicator: "transition-all",
            }}>
                {
                    childAccounts.map((account) => {
                        return <Carousel.Slide>{component(account)}</Carousel.Slide>;
                    })
                }
                <Carousel.Slide>
                    <ChildAccountCreateDummy/>
                </Carousel.Slide>
            </Carousel>
            : <div className="flex items-center gap-1">
                <CollectionEmpty>У вас пока нет созданных детских счетов</CollectionEmpty>
            </div>
        }
    </AnimatePresence>
}