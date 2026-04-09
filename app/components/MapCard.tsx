"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import { useEffect, useState } from "react";
import { useLocationStore } from "../store/location";
import { getLocations } from "../api/locations";
import { LocateButton } from "./MapComponents/LocateButton";
import { CustomMarker } from "./MapComponents/CustomMarker";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";


export default function MapCard() {
    const {
        locations, setLocations, activeFilters, showFavoritesOnly, favoriteLocations,
        searchQuery, setSelectedLocation, selectedLocation
    } = useLocationStore();

    const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const allLocations = await getLocations();
                setLocations(allLocations);
            } catch (error) {
                console.error('Error fetching locations:', error);
            }
        };
        fetchData();
    }, [setLocations]);

    const filteredLocations = locations.filter(loc => {
        const matchesSearch = searchQuery.trim().length === 0 ||
            loc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const isSelectedOffice = selectedLocation?.id === loc.id && selectedLocation?.type === 'office';
        const matchesTypeFilter = isSelectedOffice || activeFilters.length === 0 || activeFilters.includes(loc.type);
        const matchesFavoritesFilter = !showFavoritesOnly || favoriteLocations.includes(loc.id);
        return matchesSearch && matchesTypeFilter && matchesFavoritesFilter;
    });

    const locationsToDisplay = [
        ...(selectedLocation && !filteredLocations.some(loc => loc.id === selectedLocation.id) ? [selectedLocation] : []),
        ...filteredLocations
    ];

    return (
        <div className="w-full h-full rounded-md overflow-hidden">
            <MapContainer
                center={[59.204, 17.611]}
                zoom={11}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocateButton />
                {locationsToDisplay.map(loc => (
                    <CustomMarker
                        key={loc.id}
                        loc={loc}
                        isSelected={selectedLocation?.id === loc.id}
                        isHovered={hoveredLocationId === loc.id}
                        onMouseEnter={() => setHoveredLocationId(loc.id)}
                        onMouseLeave={() => setHoveredLocationId(null)}
                        onClick={() => setSelectedLocation(loc)}
                    />
                ))}
            </MapContainer>
        </div>
    );
}