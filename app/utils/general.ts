type LatLng = {
    lat: number;
    lng: number;
};

export const getDistance = (a: LatLng, b: LatLng): number => {
    const R = 6371e3;
    const toRad = (x: number) => (x * Math.PI) / 180;

    const dLat = toRad(b.lat - a.lat);
    const dLng = toRad(b.lng - a.lng);

    const lat1 = toRad(a.lat);
    const lat2 = toRad(b.lat);

    const aCalc =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(lat1) * Math.cos(lat2) *
        Math.sin(dLng / 2) ** 2;

    return 2 * R * Math.atan2(Math.sqrt(aCalc), Math.sqrt(1 - aCalc));
};

export function getGoogleMapsUrl(lat: number, lng: number, name?: string): string {
    const query = name
        ? encodeURIComponent(`${name} @${lat},${lng}`)
        : `${lat},${lng}`;

    return `https://www.google.com/maps/search/?api=1&query=${query}`;
}