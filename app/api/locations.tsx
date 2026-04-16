import type { Location } from '../types/location';

const BASE = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001").replace(/\/+$/, "");

export async function getLocations(type?: string) {

    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
        throw new Error('Not authenticated');
    }

    const url = type ? `${BASE}/locations?type=${type}` : `${BASE}/locations`;
    const res = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!res.ok) {
        throw new Error('Failed to fetch locations');
    }

    return res.json();
}

export async function getNearbyLocations(
    locationId: string,
    lat: number,
    lon: number,
    radiusMeters: number = 1000
): Promise<Location[]> {
    try {
        const url = new URL('/api/nearby', typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin);
        url.searchParams.set('locationId', locationId);
        url.searchParams.set('lat', lat.toString());
        url.searchParams.set('lon', lon.toString());
        url.searchParams.set('radius', radiusMeters.toString());

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        return await response.json();
    } catch (error) {
        console.error('Error fetching nearby locations:', error);
        return [];
    }
}