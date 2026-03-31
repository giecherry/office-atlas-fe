"use client";

import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { getLocations } from "../api/locations";
import { useState, useEffect } from "react";


export default function MapCard() {

    const [locations, setLocations] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const locations = await getLocations();
            setLocations(locations);
        };

        fetchData();
    }, []);

    const getMarkerColor = (type: string) => {
        switch (type) {
            case 'office': return '#4285F4';
            case 'restaurant': return '#EA4335';
            case 'train': return '#FBBC04';
            case 'bus': return '#34A853';
            default: return '#808080';
        }
    };

    return (
        <div style={{ height: '500px', width: '100%' }}>
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                <Map
                    defaultCenter={{ lat: 59.20413758789485, lng: 17.610222559007827 }}
                    defaultZoom={11}
                    mapId="YOUR_MAP_ID"
                >
                    {locations && locations.map((loc) => (
                        <AdvancedMarker
                            key={loc.id}
                            position={{
                                lat: Number(loc.coordinates.lat),
                                lng: Number(loc.coordinates.lng)
                            }}
                            title={loc.name}
                        >
                            <Pin
                                background={getMarkerColor(loc.type)}
                                borderColor={'#fff'}
                                glyphColor={'#fff'}
                            />
                        </AdvancedMarker>
                    ))}
                </Map>
            </APIProvider>
        </div>
    );
}
