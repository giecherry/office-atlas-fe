"use client";

import { APIProvider, Map, AdvancedMarker, Pin, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps';
import { getLocations } from "../api/locations";
import { useState, useEffect, useCallback } from "react";
import { Location } from "../types/location";
import { useLocationStore } from "../store/location";
import { Star } from "lucide-react"


export default function MapCard() {

    const { locations, setLocations, activeFilters, showFavoritesOnly, favoriteLocations } = useLocationStore();

    useEffect(() => {
        const fetchData = async () => {
            const locations = await getLocations();
            setLocations(locations);
        };

        fetchData();
    }, [setLocations]);

    const filteredLocations = locations.filter(loc => {
        const matchesTypeFilter = activeFilters.length === 0 || activeFilters.includes(loc.type);
        const matchesFavoritesFilter = !showFavoritesOnly || favoriteLocations.includes(loc.id);
        return matchesTypeFilter && matchesFavoritesFilter;
    });

    const getMarkerColor = (type: string) => {
        switch (type) {
            case 'office': return '#16417F';
            case 'restaurant': return '#B20018';
            case 'train': return '#EAAD06';
            case 'bus': return '#008064';
            default: return '#87AFE8';
        }
    };

    const MarkerWithInfoWindow = ({ loc }: { loc: Location }) => {
        const [markerRef, marker] = useAdvancedMarkerRef();
        const [infoWindowShown, setInfoWindowShown] = useState(false);
        const { toggleFavorite, favoriteLocations } = useLocationStore();
        const isFavorite = favoriteLocations.includes(loc.id);

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
                        <div className="flex justify-between items-start">
                            <div>
                                <h1>{loc.name}</h1>
                                <p>{loc.description}</p>
                            </div>
                            <button
                                onClick={() => toggleFavorite(loc.id)}
                                className="text-2xl"
                            >
                                {isFavorite ? <Star fill='yellow' /> : <Star />}
                            </button>
                        </div>
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
                    {filteredLocations && filteredLocations.map((loc) => (
                        <MarkerWithInfoWindow key={loc.id} loc={loc} />
                    ))}
                </Map>
            </APIProvider>
        </div>
    );
}