const BASE = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001").replace(/\/+$/, "");

export async function getLocations(type: string = 'office') {
    const res = await fetch(`${BASE}/locations?type=${type}`);
    return res.json();
}

export async function getLocation(id: string) {
    const res = await fetch(`${BASE}/locations/${id}`);
    const data = await res.json();

    return data;
}

export async function getLocationsInBounds(type?: string) {
    const url = type ? `${BASE}/locations/in-bounds?type=${type}` : `${BASE}/locations/in-bounds`;
    const res = await fetch(url);
    return res.json();
}

export async function getNearbyLocations(officeId: string, radius: number = 1000, type?: string) {
    const typeParam = type ? `&type=${type}` : '';
    const res = await fetch(`${BASE}/locations/nearby/${officeId}?radius=${radius}${typeParam}`);
    return res.json();
}