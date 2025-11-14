import {UserEditType, UserType} from "@/entities/user";
import universalFetch from "@/shared/lib/universalFetch";

export async function registerUser(user: FormData) {
    return universalFetch("/auth", {
        method: "POST",
        body: user,
    });
}

export async function loginUser(body: { phone: string }): Promise<UserType> {
    return universalFetch("/auth", {
        method: "PUT",
        body
    });
}

export async function authUser(): Promise<UserType> {
    return universalFetch("/auth", {
        method: "GET",
    });
}

export async function updateUser(userData: UserEditType): Promise<UserType> {
    return universalFetch("/users/me", {
        method: "PATCH",
        body: userData
    });
}