const API_BASE_URL =
    process.env.NEXT_PUBLIC_API_BASE_URL?.replace(/\/$/, "") || "http://localhost:8080/api/v1";

export class ApiError extends Error {
    status: number;
    body: unknown;

    constructor(message: string, status: number, body: unknown) {
        super(message);
        this.name = "ApiError";
        this.status = status;
        this.body = body;
    }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
    body?: unknown;
    token?: string;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers, token, ...rest } = options;

    const response = await fetch(`${API_BASE_URL}${path}`, {
        ...rest,
        headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...(headers || {}),
        },
        body: body === undefined ? undefined : JSON.stringify(body),
        cache: rest.cache ?? "no-store",
    });

    if (response.status === 204) {
        return null as T;
    }

    const text = await response.text();
    const data = text ? safeParseJson(text) : null;

    if (!response.ok) {
        const message =
            getErrorMessage(data) || `Request failed with status ${response.status}`;
        throw new ApiError(message, response.status, data);
    }

    return data as T;
}

function safeParseJson(raw: string): unknown {
    try {
        return JSON.parse(raw);
    } catch {
        return raw;
    }
}

function getErrorMessage(data: unknown): string | null {
    if (!data || typeof data !== "object") return null;
    const payload = data as Record<string, unknown>;
    if (typeof payload.message === "string") return payload.message;
    if (typeof payload.error === "string") return payload.error;
    return null;
}