'use client';

import { useEffect, useState } from 'react';
import { Polyline } from 'react-leaflet';
import { useLocationStore } from '../store/location';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function formatInstruction(step: any): string {
    const type = step.maneuver?.type ?? '';
    const modifier = step.maneuver?.modifier ?? '';
    const name = step.name ?? '';

    if (type === 'depart') return `Head to${name ? ` ${name}` : ' your destination'}`;
    if (type === 'arrive') return 'Arrived at destination';
    if (type === 'turn') {
        if (modifier === 'left') return `Turn left${name ? ` on ${name}` : ''}`;
        if (modifier === 'right') return `Turn right${name ? ` on ${name}` : ''}`;
        return `Keep walking in this direction${name ? ` on ${name}` : ''}`;
    }
    if (type === 'roundabout' || type === 'rotary') return `Enter the roundabout${name ? ` toward ${name}` : ''}`;
    return name ? `Continue on ${name}` : 'Keep walking';
}

export default function Navigation() {
    const { userLocation, selectedLocation, isNavigating, directionsOrigin, setDirectionsDuration, setDirectionsDistance, setDirectionsSteps } = useLocationStore();
    const [routePositions, setRoutePositions] = useState<[number, number][]>([]);

    useEffect(() => {
        const origin = directionsOrigin
            ? { lat: Number(directionsOrigin.coordinates.lat), lng: Number(directionsOrigin.coordinates.lng) }
            : userLocation;

        if (!isNavigating || !origin || !selectedLocation) {
            setRoutePositions([]);
            setDirectionsDuration(null);
            setDirectionsDistance(null);
            return;
        }

        const dest = {
            lat: Number(selectedLocation.coordinates.lat),
            lng: Number(selectedLocation.coordinates.lng),
        };

        const fetchRoute = async () => {
            try {
                // OSRM: koordinater i lng,lat-format
                const url = `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?steps=true&geometries=geojson&overview=full`;
                const response = await fetch(url);

                if (!response.ok) { console.error('OSRM error:', response.status); return; }

                const data = await response.json();
                const route = data.routes?.[0];
                if (!route) { console.warn('OSRM: inget svar'); return; }

                // GeoJSON-koordinater är [lng, lat] — Leaflet behöver [lat, lng]
                const coords: [number, number][] = (route.geometry?.coordinates ?? [])
                    .map(([lng, lat]: [number, number]) => [lat, lng]);
                setRoutePositions(coords);

                if (route.duration > 0) {
                    setDirectionsDuration(`${Math.round(route.duration / 60)} min`);
                }

                if (route.distance > 0) {
                    setDirectionsDistance(
                        route.distance < 1000
                            ? `${Math.round(route.distance)} m`
                            : `${(route.distance / 1000).toFixed(1)} km`
                    );
                }

                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const steps = (route.legs?.[0]?.steps ?? []).map((s: any) => ({
                    instruction: formatInstruction(s),
                    distanceMeters: Math.round(s.distance ?? 0),
                }));
                setDirectionsSteps(steps);
            } catch (err) {
                console.error('OSRM fetch failed:', err);
            }
        };

        fetchRoute();
    }, [isNavigating, userLocation, directionsOrigin, selectedLocation, setDirectionsDuration, setDirectionsDistance, setDirectionsSteps]);

    if (routePositions.length === 0) return null;

    return (
        <Polyline
            positions={routePositions}
            pathOptions={{ color: '#16417F', weight: 5, opacity: 0.85 }}
        />
    );
}
