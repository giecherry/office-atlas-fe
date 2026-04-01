"use client";

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { getLocations } from "../api/locations";
import { useState, useEffect, useCallback } from "react";
import { Location } from "../types/location";
import { useLocationStore } from "../store/location";

export default function MapCard() {

    const { locations, setLocations } = useLocationStore();

    useEffect(() => {
        const fetchData = async () => {
            const locations = await getLocations();
            setLocations(locations);
        };

        fetchData();
    }, [setLocations]);

    const getMarkerColor = (type: string) => {
        switch (type) {
            case 'office': return '#4285F4';
            case 'restaurant': return '#EA4335';
            case 'train': return '#FBBC04';
            case 'bus': return '#34A853';
            default: return '#808080';
        }
    };

    const MarkerWithInfoWindow = ({ loc }: { loc: Location }) => {
        const [markerRef, marker] = useAdvancedMarkerRef();
        const [infoWindowShown, setInfoWindowShown] = useState(false);

        const handleMarkerClick = useCallback(
            () => setInfoWindowShown(isShown => !isShown),
            []
        );

        const handleClose = useCallback(() => setInfoWindowShown(false), []);

        return (
            <>
                <AdvancedMarker
                    ref={markerRef}
                    position={{
                        lat: Number(loc.coordinates.lat),
                        lng: Number(loc.coordinates.lng)
                    }}
                    title={loc.name}
                    onClick={handleMarkerClick}
                >
                    <Pin
                        background={getMarkerColor(loc.type)}
                        borderColor={'#fff'}
                        glyphColor={'#fff'}
                    />
                </AdvancedMarker>

                {infoWindowShown && (
                    <InfoWindow anchor={marker} onClose={handleClose}>
                        <h1>{loc.name}</h1>
                        <p>{loc.description}</p>
                    </InfoWindow>
                )}
            </>
        );
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
                        <MarkerWithInfoWindow key={loc.id} loc={loc} />
                    ))}
                </Map>
            </APIProvider>
        </div>
    );
}