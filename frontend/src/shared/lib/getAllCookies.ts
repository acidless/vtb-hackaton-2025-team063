import { cookies } from "next/headers";

export default async function getAllCookiesHeader() {
    const cookieStore = await cookies();
    const allCookies = cookieStore.getAll();

    return allCookies.map(c => `${c.name}=${c.value}`).join("; ");
}