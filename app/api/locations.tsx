import type { Location } from '../types/location';
import { refreshAccessToken } from './auth';
import { useAuthStore } from '../store/auth';

const BASE = (process.env.NEXT_PUBLIC_BACKEND_BASE_URL || "http://localhost:3001").replace(/\/+$/, "");

export async function getLocations(type?: string) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;

    if (!token) {
        throw new Error('Not authenticated');
    }

    const url = type ? `${BASE}/locations?type=${type}` : `${BASE}/locations`;
    const res = await fetch(url, {
        headers: { 'Authorization': `Bearer ${token}` },
    });

    if (res.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            useAuthStore.getState().clearAuth();
            throw new Error('Session expired, please log in again');
        }
        try {
            const { token: newToken } = await refreshAccessToken(refreshToken);
            useAuthStore.getState().updateToken(newToken);

            const retryRes = await fetch(url, {
                headers: { 'Authorization': `Bearer ${newToken}` },
            });
            if (!retryRes.ok) throw new Error('Failed to fetch locations');
            return retryRes.json();
        } catch {
            useAuthStore.getState().clearAuth();
            throw new Error('Session expired, please log in again');
        }
    }

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