const BASE = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001").replace(/\/+$/, "");

export async function getLocations(type?: string) {
    const url = type ? `${BASE}/locations?type=${type}` : `${BASE}/locations`;
    const res = await fetch(url);
    return res.json();
}