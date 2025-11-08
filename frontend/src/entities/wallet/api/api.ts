import { fetchMock } from "@/shared/lib/fetchMock";
import {WalletType} from "@/entities/wallet";

export async function getWallets(): Promise<WalletType[]> {
    return fetchMock("/api/accounts/wallets");
}

export async function addWallet(newWallet: Omit<WalletType, "id" | "category" | "money"> & {category: number}): Promise<WalletType> {
    return fetchMock("/api/accounts/wallets", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newWallet),
    });
}

export async function deleteWallet(walletId: number): Promise<void> {
    await fetchMock(`/api/accounts/wallets/?id=${walletId}`, {
        method: "DELETE",
    });
}