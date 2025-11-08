import {fetchData} from "@/shared/lib/fetchMock";
import {UserType} from "@/entities/user";
import {UserInput} from "@/entities/user/model/types";

export async function registerUser(user: UserInput): Promise<UserType> {
    return fetchData("/auth/register", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({...user, email: "email@example.com", "password": "Password123"}),
    });
}