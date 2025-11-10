export async function fetchMock(url: string, data?: any): Promise<any> {
    const baseUrl =
        typeof window === "undefined"
            ? process.env.MOCK_BASE_URL_INTERNAL || "http://localhost:3001"
            : "";

    const response = await fetch(`${baseUrl}${url}`, {
        cache: "no-store",
        ...data
    });

    if (response.status === 204) {
        return null;
    }

    return response.json();
}