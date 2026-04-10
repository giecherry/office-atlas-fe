"use client";

import { MapContainer, TileLayer, LayersControl, useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import { useLocationStore } from "../store/location";
import { getLocations } from "../api/locations";
import { LocateButton } from "./MapComponents/LocateButton";
import { CustomMarker } from "./MapComponents/CustomMarker";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

function MapZoomController() {
    const map = useMap();
    const { selectedLocation } = useLocationStore();

    useEffect(() => {
        if (selectedLocation) {
            const lat = Number(selectedLocation.coordinates.lat);
            const lng = Number(selectedLocation.coordinates.lng);
            map.flyTo([lat, lng], 15, { duration: 0.6 });
        }
    }, [selectedLocation, map]);

    return null;
}


export default function MapCard() {
    const {
        locations, setLocations, activeFilters,
        searchQuery, setSelectedLocation, selectedLocation,
        showNearbySearch, nearbyLocations
    } = useLocationStore();

    const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const offices = await getLocations();
                setLocations(offices);
            } catch (error) {
                console.error('Error fetching offices:', error);
            }
        };
        fetchData();
    }, [setLocations]);

    const filteredLocations = (showNearbySearch ? nearbyLocations : locations).filter(loc => {
        const matchesSearch = searchQuery.trim().length === 0 ||
            loc.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesTypeFilter = activeFilters.length === 0 || activeFilters.includes(loc.type);
        return matchesSearch && matchesTypeFilter;
    });

    const locationsToDisplay = showNearbySearch
        ? [
            ...(selectedLocation && selectedLocation.type === 'office' ? [selectedLocation] : []),
            ...filteredLocations
        ]
        : [
            ...(selectedLocation && !filteredLocations.some(loc => loc.id === selectedLocation.id) ? [selectedLocation] : []),
            ...filteredLocations
        ];

    return (
        <div className="w-full h-full rounded-md overflow-hidden">
            <MapContainer
                center={[59.180, 17.630]}
                zoom={12.5}
                scrollWheelZoom={true}
                touchZoom={true}
                style={{ height: "100%", width: "100%" }}
            >
                <LayersControl>
                    <LayersControl.BaseLayer name="Street Map">
                        <TileLayer
                            attribution='&copy; OpenStreetMap contributors'
                            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer checked name="Satellite">
                        <TileLayer
                            attribution='&copy; Esri'
                            url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                        />
                    </LayersControl.BaseLayer>
                    <LayersControl.BaseLayer name="Terrain">
                        <TileLayer
                            attribution='&copy; OpenTopoMap'
                            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
                        />
                    </LayersControl.BaseLayer>
                </LayersControl>
                <MapZoomController />
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