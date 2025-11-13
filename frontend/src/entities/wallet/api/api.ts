import {WalletType} from "@/entities/wallet";
import {DepositType} from "@/entities/transaction";
import universalFetch from "@/shared/lib/universalFetch";

export async function getWallets(): Promise<WalletType[]> {
    return universalFetch("/wallets");
}

export async function addWallet(newWallet: Omit<WalletType, "id" | "currentAmount"> & DepositType): Promise<WalletType> {
    return universalFetch("/wallets", {
        method: "POST",
        body: newWallet,
    });
}

export async function deleteWallet(walletId: number): Promise<void> {
    await universalFetch(`/wallets/${walletId}`, {
        method: "DELETE",
    });
}

export async function depositWallet(data: DepositType & { entityId?: string }): Promise<WalletType> {
    const body = Object.assign({}, data);
    delete body.entityId;

    return universalFetch(`/wallets/${data.entityId}`, {
        method: "PUT",
        body,
    });
}