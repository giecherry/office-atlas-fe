const BASE = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001").replace(/\/+$/, "");

export async function getLocations() {
    const res = await fetch(`${BASE}/locations`);
    const data = await res.json();

    return data;
}

export async function getLocation(id: string) {
    const res = await fetch(`${BASE}/locations/${id}`);
    const data = await res.json();

    return data;
}