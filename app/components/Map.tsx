"use client";

import { APIProvider, Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { getLocations } from "../api/locations";
import { useEffect } from "react";
import { useLocationStore } from "../store/location";

export default function MapCard() {

    const { locations, setLocations, activeFilters, showFavoritesOnly, favoriteLocations, searchQuery, setSelectedLocation } = useLocationStore();

    useEffect(() => {
        const fetchData = async () => {
            const locations = await getLocations();
            setLocations(locations);
        };

        fetchData();
    }, [setLocations]);

    const filteredLocations = locations.filter(loc => {
        const matchesSearch = searchQuery.trim().length === 0 ||
            loc.name.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesTypeFilter = activeFilters.length === 0 || activeFilters.includes(loc.type);

        const matchesFavoritesFilter = !showFavoritesOnly || favoriteLocations.includes(loc.id);

        return matchesSearch && matchesTypeFilter && matchesFavoritesFilter;

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


    return (
        <div className="w-full h-200 p-6 bg-white rounded-xl shadow-md overflow-hidden lg:h-150">
            <div className="w-full h-full rounded-md overflow-hidden">
                <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                    <Map
                        defaultCenter={{ lat: 59.20413758789485, lng: 17.610222559007827 }}
                        defaultZoom={11}
                        mapId="YOUR_MAP_ID"
                    >
                        {filteredLocations && filteredLocations.map((loc) => (
                            <AdvancedMarker
                                key={loc.id}
                                position={{
                                    lat: Number(loc.coordinates.lat),
                                    lng: Number(loc.coordinates.lng)
                                }}
                                title={loc.name}
                                onClick={() => setSelectedLocation(loc)}
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
        </div>
    );
}