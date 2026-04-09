const BASE = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001").replace(/\/+$/, "");

export async function getLocations(type?: string) {
    const url = type ? `${BASE}/locations?type=${type}` : `${BASE}/locations`;
    const res = await fetch(url);
    return res.json();
}


export async function getNearbyLocations(officeId: string, radius: number = 1000, type?: string) {
    const typeParam = type ? `&type=${type}` : '';
    const res = await fetch(`${BASE}/locations/nearby/${officeId}?radius=${radius}${typeParam}`);
    const data = await res.json();
    return Array.isArray(data) ? data : data?.data || data?.nearbyLocations || [];
}