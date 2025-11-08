import { fetchMock } from "@/shared/lib/fetchMock";
import {LimitType} from "@/entities/limit";

export async function getLimits(): Promise<LimitType[]> {
    return fetchMock("/api/expenses/limits");
}

export async function addLimit(newLimit: Omit<LimitType, "id" | "category"> & {category: number}): Promise<LimitType> {
    return fetchMock("/api/expenses/limits", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newLimit),
    });
}

export async function deleteLimit(limitId: number): Promise<void> {
    await fetchMock(`/api/expenses/limits/?id=${limitId}`, {
        method: "DELETE",
    });
}