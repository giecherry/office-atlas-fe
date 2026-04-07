"use client";

import { APIProvider, Map, AdvancedMarker, MapControl, ControlPosition, useMap } from '@vis.gl/react-google-maps';
import { getLocations } from "../api/locations";
import { useEffect, useState, useCallback, useRef } from "react";
import { useLocationStore } from "../store/location";
import { Bus, Building2, Utensils, TrainFront, LocateFixed, Loader2 } from "lucide-react";
import type { locationType, Location } from "../types/location";
import { motion } from 'motion/react';
import { getDistance } from "../utils/general";

function LocateMeControl() {
    const map = useMap();
    const [loading, setLoading] = useState(false);
    const { userLocation, setUserLocation } = useLocationStore();

    const watchIdRef = useRef<number | null>(null);
    const hasFixRef = useRef(false);
    const lastPosRef = useRef<{ lat: number; lng: number } | null>(null);
    const distance_threshold_meters = 5;
    const pan_threshold_meters = 20;

    const handleLocate = useCallback(() => {
        if (!navigator.geolocation) return;
        setLoading(true);
        hasFixRef.current = false;
        lastPosRef.current = null;

        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                const newPos = {
                    lat: pos.coords.latitude,
                    lng: pos.coords.longitude,
                };

                const prev = lastPosRef.current;

                const distance = prev ? getDistance(prev, newPos) : Infinity;

                const hasMoved = distance > distance_threshold_meters;
                if (!hasMoved) {
                    setLoading(false);
                    return;
                }

                const shouldPan = !hasFixRef.current || distance > pan_threshold_meters;

                lastPosRef.current = newPos;
                setUserLocation(newPos);

                if (shouldPan) {
                    if (!hasFixRef.current) {
                        map?.setZoom(15);
                    }
                    map?.panTo(newPos);
                    hasFixRef.current = true;
                }

                setLoading(false);
            },
            () => setLoading(false),
            { timeout: 10000 }
        );
    }, [map, setUserLocation]);

    useEffect(() => {
        return () => {
            if (watchIdRef.current !== null) {
                navigator.geolocation.clearWatch(watchIdRef.current);
            }
        };
    }, []);

    return (
        <>
            <MapControl position={ControlPosition.RIGHT_BOTTOM}>
                <div className="mb-2 mr-2">
                    <button
                        onClick={handleLocate}
                        title="Show my location"
                        className="w-10 h-10 bg-white rounded shadow-md flex items-center justify-center text-gray-600 hover:text-[#16417F] transition-colors cursor-pointer"
                    >
                        {loading
                            ? <Loader2 size={20} className="animate-spin" />
                            : <LocateFixed size={20} />
                        }
                    </button>
                </div>
            </MapControl>

            {userLocation && (
                <AdvancedMarker position={userLocation}>
                    <div className="relative flex items-center justify-center w-8 h-8">
                        <div className="absolute w-8 h-8 rounded-full bg-[#16417F] opacity-20 animate-ping" />
                        <div className="absolute w-5 h-5 rounded-full bg-[#16417F] opacity-30" />
                        <div className="w-3.5 h-3.5 rounded-full bg-[#16417F] border-2 border-white shadow-lg z-10" />
                    </div>
                </AdvancedMarker>
            )}
        </>
    );
}

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

    const pinOptions: { type: locationType; icon: React.ReactNode; color: string }[] = [
        { type: 'office', icon: <Building2 />, color: '#16417F' },
        { type: 'restaurant', icon: <Utensils />, color: '#B20018' },
        { type: 'train', icon: <TrainFront />, color: '#EAAD06' },
        { type: 'bus', icon: <Bus />, color: '#008064' },
    ];

    const renderCustomPin = (loc: Location) => {
        const pinOption = pinOptions.find(opt => opt.type === loc.type);
        return (
            <motion.div
                className="relative flex flex-col items-center"
                initial="idle"
                whileHover="hovered"
            >
                <motion.div
                    variants={{
                        idle: { opacity: 0, y: 4, pointerEvents: 'none' },
                        hovered: { opacity: 1, y: 0, pointerEvents: 'auto' },
                    }}
                    transition={{ duration: 0.15, ease: 'easeOut' }}
                    className="absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-white shadow-md"
                    style={{ backgroundColor: pinOption?.color || '#87AFE8' }}
                >
                    {loc.name}
                </motion.div>

                <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold shadow-md"
                    style={{ backgroundColor: pinOption?.color || '#87AFE8' }}
                >
                    {pinOption?.icon && (
                        pinOption.icon
                    )}
                </div>
                <div
                    className="w-0 h-0 -mt-1"
                    style={{
                        borderLeft: '7px solid transparent',
                        borderRight: '7px solid transparent',
                        borderTop: `9px solid ${pinOption?.color || '#87AFE8'}`,
                    }}
                />
            </motion.div>
        );
    };

    return (
        <div className="w-full h-full rounded-md overflow-hidden">
            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                <Map
                    defaultCenter={{ lat: 59.20413758789485, lng: 17.610222559007827 }}
                    defaultZoom={11}
                    mapId="YOUR_MAP_ID"
                >
                    <LocateMeControl />

                    {filteredLocations.map((loc) => (
                        <AdvancedMarker
                            key={loc.id}
                            position={{
                                lat: Number(loc.coordinates.lat),
                                lng: Number(loc.coordinates.lng)
                            }}
                            title={loc.name}
                            onClick={() => setSelectedLocation(loc)}
                        >
                            {renderCustomPin(loc)}
                        </AdvancedMarker>
                    ))}
                </Map>
            </APIProvider>
        </div>
    );
}