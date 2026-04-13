import { getNearbyFromOverpass } from '../../utils/overpass';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const locationId = searchParams.get('locationId');
    const lat = parseFloat(searchParams.get('lat') || '0');
    const lon = parseFloat(searchParams.get('lon') || '0');
    const radius = parseInt(searchParams.get('radius') || '1000');

    if (!locationId || !lat || !lon) {
        return Response.json({ error: 'Missing parameters' }, { status: 400 });
    }

    try {
        const data = await getNearbyFromOverpass(locationId, lat, lon, radius);

        return Response.json(data);
    } catch (error) {
        console.error('Nearby route error:', error);
        return Response.json({ error: 'Failed to fetch nearby locations' }, { status: 500 });
    }
}