import type { Location } from "../types/location";

interface OverpassNode {
    type: 'node' | 'way';
    id: number;
    lat?: number;
    lon?: number;
    center?: { lat: number; lon: number };
    tags: Record<string, string>;
}

interface OverpassResponse {
    elements: OverpassNode[];
}

const overpassCache = new Map<string, { timestamp: number; results: Location[] }>();
const CACHE_DURATION = 60 * 60 * 1000;

function calculateBbox(lat: number, lon: number, radiusMeters: number): string {
    const R = 6371000;
    const latOffset = (radiusMeters / R) * (180 / Math.PI);
    const lonOffset = (radiusMeters / (R * Math.cos((lat * Math.PI) / 180))) * (180 / Math.PI);

    return `${lat - latOffset},${lon - lonOffset},${lat + latOffset},${lon + lonOffset}`;
}

function buildOverpassQuery(bbox: string): string {
    return `[timeout:10][out:json];(node["amenity"="restaurant"](${bbox});way["amenity"="restaurant"](${bbox});node["amenity"="fast_food"](${bbox});way["amenity"="fast_food"](${bbox});node["railway"="station"](${bbox});way["railway"="station"](${bbox});node["highway"="bus_stop"](${bbox}););out geom;`;
}
async function queryOverpass(query: string): Promise<OverpassResponse> {
    const endpoint = 'https://overpass-api.de/api/interpreter';

    for (let attempt = 0; attempt < 3; attempt++) {
        try {
            const response = await fetch(endpoint, {
                method: 'POST',
                body: query,
                signal: AbortSignal.timeout(15000),
            });

            if (response.status === 504 || response.status === 429) {
                if (attempt < 2) {
                    const delay = 500 * Math.pow(2, attempt);
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }
                throw new Error(`HTTP ${response.status}`);
            }

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            if (attempt === 2) throw error;
            const delay = 500 * Math.pow(2, attempt);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }

    throw new Error('Failed to query Overpass API');
}

function getLocationTypeFromTags(tags: Record<string, string>): 'restaurant' | 'train' | 'bus' | null {
    if (tags.amenity === 'restaurant' || tags.amenity === 'fast_food') {
        return 'restaurant';
    }

    if (tags.railway === 'station' || tags.railway === 'halt') {
        return 'train';
    }

    if (tags.highway === 'bus_stop') {
        return 'bus';
    }

    return null;
}

function convertOverpassToLocation(node: OverpassNode): Location | null {
    const lat = node.lat ?? node.center?.lat;
    const lon = node.lon ?? node.center?.lon;

    if (!lat || !lon) return null;

    const type = getLocationTypeFromTags(node.tags);
    if (!type) return null;

    const name = node.tags.name || `${type.charAt(0).toUpperCase() + type.slice(1)}`;

    return {
        id: `${node.type}-${node.id}`,
        name,
        description: node.tags.description || '',
        coordinates: { lat, lng: lon },
        type,
        cuisine: node.tags.cuisine,
        website: node.tags.website,
        openingHours: node.tags.opening_hours,
        network: node.tags.network,
        shelter: node.tags.shelter === 'yes',
        wheelchairAccessibility: node.tags.wheelchair === 'yes',
    };
}

export async function getNearbyFromOverpass(
    locationId: string,
    lat: number,
    lon: number,
    radiusMeters: number = 1000
): Promise<Location[]> {
    const cached = overpassCache.get(locationId);
    if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
        return cached.results;
    }

    try {
        const bbox = calculateBbox(lat, lon, radiusMeters);
        const query = buildOverpassQuery(bbox);
        const response = await queryOverpass(query);

        const allResults: Location[] = response.elements
            .map(node => convertOverpassToLocation(node))
            .filter((loc): loc is Location => loc !== null);

        if (allResults.length > 0) {
            overpassCache.set(locationId, {
                timestamp: Date.now(),
                results: allResults,
            });
        }

        return allResults;
    } catch (error) {
        console.error('Error fetching from Overpass API:', error);
        return [];
    }
}

export function clearOverpassCache(locationId?: string): void {
    if (locationId) {
        overpassCache.delete(locationId);
    } else {
        overpassCache.clear();
    }
}