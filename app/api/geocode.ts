export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const lat = searchParams.get('lat');
    const lon = searchParams.get('lon');

    if (!lat || !lon) {
        return Response.json({ error: 'Missing lat/lon' }, { status: 400 });
    }

    try {
        const url = new URL('https://nominatim.openstreetmap.org/reverse');
        url.searchParams.set('lat', lat);
        url.searchParams.set('lon', lon);
        url.searchParams.set('format', 'jsonv2');
        url.searchParams.set('zoom', '18');
        url.searchParams.set('layer', 'address');

        const response = await fetch(url, {
            headers: { 'Accept-Language': 'sv,en' },
        });

        if (!response.ok) return Response.json(null);
        const data = await response.json();
        return Response.json(data);
    } catch {
        return Response.json(null);
    }
}