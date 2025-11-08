import {GoalType} from "@/entities/goal";
import { fetchMock } from "@/shared/lib/fetchMock";

export async function getGoals(): Promise<GoalType[]> {
    const goals = await fetchMock("/api/goals");
    return goals.map((goal: GoalType) => ({
        ...goal,
        deadline: new Date(goal.deadline),
    }));
}

export async function addGoal(newGoal: Omit<GoalType, "id" | "moneyCollected">): Promise<GoalType> {
    const goal = await fetchMock("/api/goals", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(newGoal),
    });

    goal.deadline = new Date(goal.deadline);
    return goal;
}

export async function deleteGoal(goalId: number): Promise<void> {
    await fetchMock(`/api/goals/?id=${goalId}`, {
        method: "DELETE",
    });
}