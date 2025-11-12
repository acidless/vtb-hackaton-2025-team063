import {LimitType} from "@/entities/limit";
import universalFetch from "@/shared/lib/universalFetch";

export async function getLimits(): Promise<LimitType[]> {
    return universalFetch("/limits");
}

export async function addLimit(newLimit: Omit<LimitType, "id" | "spent">): Promise<LimitType> {
    return universalFetch("/limits", {
        method: "POST",
        body: newLimit,
    });
}

export async function deleteLimit(limitId: number): Promise<void> {
    await universalFetch(`/limits/${limitId}`, {
        method: "DELETE",
    });
}