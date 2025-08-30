const BASE = import.meta.env.VITE_API_URL;

export async function http<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${BASE}${path}`, {
        headers: {"Content-Type": "application/json", ...(init?.headers || {})},
        ...init,
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || `HTTP ${res.status}`);
    }
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("application/json")) return undefined as unknown as T;
    return (await res.json()) as T;
}
