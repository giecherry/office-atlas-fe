"use client";

import { MapContainer, TileLayer, LayersControl, useMap, Circle } from "react-leaflet";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { useLocationStore } from "../store/location";
import { LocateButton } from "./MapComponents/LocateButton";
import { CustomMarker } from "./MapComponents/CustomMarker";
import Navigation from "./Navigation";
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { getDistance } from "../utils/general";

function MapZoomController() {
    const map = useMap();
    const { selectedLocation, anchorLocation, showNearbySearch } = useLocationStore();

    useEffect(() => {
        const focusTarget = showNearbySearch ? anchorLocation : selectedLocation;
        if (focusTarget) {
            const lat = Number(focusTarget.coordinates.lat);
            const lng = Number(focusTarget.coordinates.lng);
            map.flyTo([lat, lng], 15, { duration: 0.6 });
        }
    }, [selectedLocation, anchorLocation, showNearbySearch, map]);

    return null;
}

export default function MapCard() {
    const {
        locations, activeFilters, searchQuery,
        setSelectedLocation, selectedLocation,
        showNearbySearch, nearbyLocations, nearbySearchRadius,
        anchorLocation,
    } = useLocationStore();

    const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);

    const filteredLocations = (showNearbySearch ? nearbyLocations : locations).filter(loc => {

        if (showNearbySearch && anchorLocation) {
            const matchesTypeFilter = activeFilters.length === 0 || activeFilters.includes(loc.type);
            const distance = getDistance(
                { lat: anchorLocation.coordinates.lat, lng: anchorLocation.coordinates.lng },
                { lat: loc.coordinates.lat, lng: loc.coordinates.lng }
            );
            return matchesTypeFilter && distance <= nearbySearchRadius;
        }

        const matchesSearch = searchQuery.trim().length === 0 ||
            loc.name.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesSearch;
    });

    const locationsToDisplay = showNearbySearch
        ? [
            ...(anchorLocation ? [anchorLocation] : []),
            ...filteredLocations.filter(loc => loc.id !== anchorLocation?.id),
        ]
        : [
            ...(selectedLocation && !filteredLocations.some(loc => loc.id === selectedLocation.id)
                ? [selectedLocation] : []),
            ...filteredLocations,
        ];

    return (
        <div className="w-full h-full rounded-md overflow-hidden relative isolate">
            <motion.img
                src="./map-skeleton.png"
                alt="Loading map..."
                className="absolute inset-0 w-full h-full object-cover"
                style={{ pointerEvents: 'none' }}
                initial={{ opacity: 1 }}
                animate={{ opacity: 0 }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
            />
            <motion.div
                className="absolute inset-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3, ease: 'easeInOut' }}
            >
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
                    <Navigation />

                    {/* Radius circle when in nearby mode */}
                    {showNearbySearch && anchorLocation && (
                        <Circle
                            center={[anchorLocation.coordinates.lat, anchorLocation.coordinates.lng]}
                            radius={nearbySearchRadius}
                            pathOptions={{ color: '#16417F', fillColor: '#16417F', fillOpacity: 0.3, weight: 1.5, dashArray: '4 4' }}
                        />
                    )}

                    {locationsToDisplay.map(loc => (
                        <CustomMarker
                            key={loc.id}
                            loc={loc}
                            isSelected={selectedLocation?.id === loc.id}
                            isAnchor={showNearbySearch && anchorLocation?.id === loc.id}
                            isHovered={hoveredLocationId === loc.id}
                            onMouseEnter={() => setHoveredLocationId(loc.id)}
                            onMouseLeave={() => setHoveredLocationId(null)}
                            onClick={() => setSelectedLocation(loc)}
                        />
                    ))}
                </MapContainer>
            </motion.div>
        </div>
    );
}