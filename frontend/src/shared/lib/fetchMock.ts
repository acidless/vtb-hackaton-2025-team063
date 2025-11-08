export async function fetchMock(url: string, data?: any): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_MOCK_BASE_URL}${url}`, {
        cache: "no-store",
        ...data
    });

    if (response.status === 204) {
        return null;
    }

    return response.json();
}

export async function fetchData(url: string, data?: any): Promise<any> {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, data);

    if (response.status === 204) {
        return null;
    }

    return response.json();
}