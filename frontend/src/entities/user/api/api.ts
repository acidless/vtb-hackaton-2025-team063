import {UserEditType, UserType} from "@/entities/user";
import universalFetch from "@/shared/lib/universalFetch";

export async function getUsers() {
    return universalFetch<{ id: number; name: string }[]>("/users", {
        method: "GET",
    });
}


export async function registerUser(user: FormData) {
    return universalFetch("/auth", {
        method: "POST",
        body: user,
    });
}

export async function loginUser(body: { id: number }): Promise<UserType> {
    return universalFetch("/auth", {
        method: "PUT",
        body
    });
}

export async function validateUser(body: Partial<UserType>): Promise<UserType> {
    return universalFetch("/auth/validation", {
        method: "POST",
        body
    });
}

export async function authUser(): Promise<UserType> {
    return universalFetch("/auth", {
        method: "GET",
    });
}

export async function logoutUser(): Promise<void> {
    await universalFetch("/auth", {
        method: "DELETE",
    });
}

export async function updateUser(userData: UserEditType): Promise<UserType> {
    return universalFetch("/users/me", {
        method: "PATCH",
        body: userData
    });
}