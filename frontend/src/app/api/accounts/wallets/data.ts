import {WalletType} from "@/entities/wallet";
import {getExpenseCategories} from "@/app/api/expenses/categories/data";

let wallets: (Omit<WalletType, "categoryId"> & {category: number})[] = [
    {id: 1, name: "Развелечения", bank: "abank", period:"week", category: 1, currentAmount: 10000, amount: 20000},
    {id: 2, name: "Продукты", bank: "sbank", period:"week", category: 2, currentAmount: 0, amount: 40000},
    {id: 3, name: "ЖКХ и связь", bank: "abank", period:"week", category: 3, currentAmount: 4500, amount: 5000},
];

export function getWallets() {
    const categories = getExpenseCategories();
    return wallets.map(w => ({...w, category: categories.find((c) => c.id === w.category)}));
}

export function addWallet(wallet: Omit<WalletType, "id" | "categoryId"> & {category: number}) {
    const newWallet = {
        ...wallet,
        id: Math.max(0, ...wallets.map((g) => g.id)) + 1,
        money: 0,
    };

    wallets.push(newWallet);
    return wallet;
}

export function deleteWallet(walletId: number) {
    wallets = wallets.filter((wallet) => wallet.id !== walletId);
}
