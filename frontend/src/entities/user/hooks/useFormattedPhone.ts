"use client";

import IMask from "imask";
import {useEffect, useState} from "react";

export function useFormattedPhone(phoneNumber?: string) {
    const mask = IMask.createMask({mask: "+7 (000) 000-00-00"});
    const [formattedPhone, setFormattedPhone] = useState("");

    useEffect(() => {
        if(phoneNumber) {
            mask.resolve(phoneNumber);
            setFormattedPhone(mask.value);
        }
    }, [phoneNumber]);

    return formattedPhone;
}