import {BankKey} from "@/entities/bank";

export type UserType = {
    id: number;
    name: string;
    phone: string;
    avatar: string;
    connectedAt: string;
}

export type UserEditType = {
    name?: string;
    phone?: string;
}

export type UserInputType = {
    name: string;
    gender: string;
    phone: string;
    photo: File;
    photoSrc: string;
    code?: number;
    banks: BankKey[];
}