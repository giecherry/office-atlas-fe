'use client'

import { Building2, UtensilsCrossed, Train, Bus, X } from 'lucide-react';
import { useLocationStore } from '../store/location';
import { useEffect, useState } from 'react';
import type { locationType } from '../types/location';
import Filters from './Filters';

const typeConfig: Record<locationType, { icon: React.ReactNode; color: string; label: string }> = {
    office: { icon: <Building2 className="w-4 h-4" />, color: '#16417F', label: 'Office' },
    restaurant: { icon: <UtensilsCrossed className="w-4 h-4" />, color: '#B20018', label: 'Restaurant' },
    train: { icon: <Train className="w-4 h-4" />, color: '#EAAD06', label: 'Train' },
    bus: { icon: <Bus className="w-4 h-4" />, color: '#008064', label: 'Bus' },
};

export default function NearbySearch() {
    const {
        selectedLocation,
        nearbyLocations,
        setNearbyLocations,
        nearbySearchRadius,
        setNearbySearchRadius,
        setShowNearbySearch,
        setSelectedLocation,
        activeFilters,
        clearFilters,
        searchQuery,
    } = useLocationStore();

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchNearby = async () => {
            if (!selectedLocation || selectedLocation.type !== 'office') return;
            setLoading(true);
            try {
                /* const data = await getNearbyLocations(selectedLocation.id, nearbySearchRadius);
                setNearbyLocations(data); */
                console.log('Fetching nearby locations for', selectedLocation.name, 'with radius', nearbySearchRadius);
            } catch (error) {
                console.error('Error fetching nearby locations:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNearby();
    }, [selectedLocation, nearbySearchRadius, setNearbyLocations]);

    const filteredNearby = (Array.isArray(nearbyLocations) ? nearbyLocations : []).filter(loc =>
        (activeFilters.length === 0 || activeFilters.includes(loc.type)) &&
        (searchQuery.trim().length === 0 || loc.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    if (!selectedLocation) {
        return null;
    }

    return (
        <div className="bg-white flex flex-col h-full px-4 py-2">
            <div className="p-2 border-b border-gray-200">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0">
                        <h2 className="uppercase text-xl font-semibold text-gray-900 mb-1">
                            Nearby
                        </h2>
                        <p className="text-xs text-gray-500">
                            {selectedLocation.name}
                        </p>
                    </div>
                    <button
                        onClick={() => {
                            setShowNearbySearch(false);
                            clearFilters();
                        }} className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0 ml-2"
                        aria-label="Close nearby search"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>

                <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg mb-3">
                    <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
                        Radius:
                    </label>
                    <input
                        type="range"
                        min="100"
                        max="3000"
                        step="100"
                        value={nearbySearchRadius}
                        onChange={(e) => setNearbySearchRadius(Number(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                        {Math.round(nearbySearchRadius / 1000 * 10) / 10} km
                    </span>
                </div>
                <Filters />
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-1">
                {loading ? (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                        Loading nearby locations...
                    </div>
                ) : filteredNearby.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                        No locations found
                    </div>
                ) : (
                    filteredNearby.map(loc => {
                        const config = typeConfig[loc.type];
                        return (
                            <button
                                key={loc.id}
                                onClick={() => {
                                    setSelectedLocation(loc);
                                    if (loc.type !== 'office') {
                                        setShowNearbySearch(false);
                                    }
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors hover:bg-gray-50 border border-transparent"
                            >
                                <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0"
                                    style={{ backgroundColor: config.color }}
                                >
                                    {config.icon}
                                </div>
                                <span className="flex-1 text-sm font-medium text-gray-900 truncate uppercase">
                                    {loc.name}
                                </span>
                                <span
                                    className="text-xs px-2 py-0.5 rounded-full text-white shrink-0"
                                    style={{ backgroundColor: config.color }}
                                >
                                    {config.label}
                                </span>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}