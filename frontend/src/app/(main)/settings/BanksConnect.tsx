"use client";

import Heading from "@/shared/ui/typography/Heading";
import React from "react";
import {banks, ConnectableBank} from "@/entities/bank";

const BanksConnect = () => {
    return <section className="mx-4 md:mr-0 mb-[1.875rem]">
        <div className="mb-2.5 flex items-center justify-between flex-wrap">
            <Heading level={2}>Доступные банки</Heading>
        </div>
        <div className="flex flex-col gap-1">
            {Object.values(banks).map(bank => (<ConnectableBank bank={bank} isConnected={bank.name === "ВТБ"}/>))}
        </div>
    </section>
}

export default BanksConnect;