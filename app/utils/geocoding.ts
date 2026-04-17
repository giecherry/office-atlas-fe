interface NominatimReverseResponse {
    address: {
        road?: string;
        house_number?: string;
        postcode?: string;
        city?: string;
        town?: string;
        village?: string;
    };
    display_name: string;
}

const geocodeCache = new Map<string, string>();

export async function getAddressFromCoordinates(
    lat: number,
    lon: number
): Promise<string | null> {
    const cacheKey = `${lat.toFixed(5)},${lon.toFixed(5)}`;
    if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey)!;

    try {
        const response = await fetch(`/api/geocode?lat=${lat}&lon=${lon}`);
        if (!response.ok) return null;

        const data: NominatimReverseResponse = await response.json();
        const { road, house_number, postcode, city, town, village } = data.address;

        const street = road && house_number ? `${road} ${house_number}` : road;
        const locality = city ?? town ?? village;
        const parts = [street, postcode && locality ? `${postcode} ${locality}` : locality].filter(Boolean);

        const address = parts.length > 0 ? parts.join(', ') : data.display_name;
        geocodeCache.set(cacheKey, address);
        return address;
    } catch {
        return null;
    }
}