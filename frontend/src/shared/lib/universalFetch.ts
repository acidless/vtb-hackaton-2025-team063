interface FetchOptions {
    method?: string;
    body?: any;
    headers?: Record<string, string>;
    serverCookie?: string;
}

export default async function universalFetch<T>(url: string, options: FetchOptions = {}): Promise<T> {
    let baseUrl: string;
    const headers: Record<string, string> = {...(options.headers || {})};

    if (typeof window === "undefined") {
        baseUrl = process.env.API_BASE_URL_INTERNAL || "http://localhost:3000";

        const { cookies } = await import("next/headers");
        const allCookies = (await cookies()).getAll();
        if (allCookies.length > 0) {
            headers["cookie"] = allCookies.map(c => `${c.name}=${c.value}`).join("; ");
        }
    } else {
        baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000";
    }

    if (!(options.body instanceof FormData)) {
        headers["Content-Type"] = "application/json";
    }

    const response = await fetch(`${baseUrl}${url}`, {
        ...options,
        headers,
        credentials: typeof window === "undefined" ? undefined : "include",
        body: options.body && !(options.body instanceof FormData)
            ? JSON.stringify(options.body)
            : options.body,
    });

    if (response.status === 204) {
        return null as any;
    }

    let json: any;
    try {
        json = await response.json();
    } catch {
        json = null;
    }

    if (!response.ok) {
        throw new Error(json?.message || `HTTP error ${response.status}`);
    }

    return json?.data ?? json;
}