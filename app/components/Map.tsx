"use client";

import { APIProvider, Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import { getLocations } from "../api/locations";
import { useEffect } from "react";
import { useLocationStore } from "../store/location";
import { Bus, Building2, Utensils, TrainFront } from "lucide-react"
import type { locationType, Location } from "../types/location";
import { motion } from 'motion/react';



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
                            {renderCustomPin(loc)}
                        </AdvancedMarker>
                    ))}
                </Map>
            </APIProvider>
        </div>
    );
}