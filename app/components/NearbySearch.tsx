'use client'

import { Building2, UtensilsCrossed, Train, Bus, Loader2 } from 'lucide-react';
import { useLocationStore } from '../store/location';
import type { locationType } from '../types/location';
import Filters from './Filters';
import { getDistance } from '../utils/general';

const typeConfig: Record<locationType, { icon: React.ReactNode; color: string; label: string }> = {
    office: { icon: <Building2 className="w-4 h-4" />, color: '#16417F', label: 'Office' },
    restaurant: { icon: <UtensilsCrossed className="w-4 h-4" />, color: '#B20018', label: 'Restaurant' },
    train: { icon: <Train className="w-4 h-4" />, color: '#EAAD06', label: 'Train' },
    bus: { icon: <Bus className="w-4 h-4" />, color: '#008064', label: 'Bus' },
};

export default function NearbySearch() {
    const {
        anchorLocation,
        nearbyLocations,
        nearbySearchRadius,
        setNearbySearchRadius,
        setSelectedLocation,
        selectedLocation,
        activeFilters,
        nearbyLocationsLoading,
    } = useLocationStore();

    if (!anchorLocation) return null;

    const filteredNearby = (Array.isArray(nearbyLocations) ? nearbyLocations : []).filter(loc => {
        const matchesFilter = activeFilters.length === 0 || activeFilters.includes(loc.type);

        const distance = getDistance(
            { lat: anchorLocation.coordinates.lat, lng: anchorLocation.coordinates.lng },
            { lat: loc.coordinates.lat, lng: loc.coordinates.lng }
        );

        return matchesFilter && distance <= nearbySearchRadius;
    });

    return (
        <div className="bg-white flex flex-col h-full border-t border-gray-200 py-4 mt-auto ">
            <div className="mb-4">
                <div className="flex items-center gap-2 py-1 bg-gray-50 rounded-lg mb-1">
                    <label className="text-xs font-medium text-gray-600 whitespace-nowrap">
                        Radius:
                    </label>
                    <input
                        type="range"
                        min="100"
                        max="1000"
                        step="100"
                        value={nearbySearchRadius}
                        onChange={(e) => setNearbySearchRadius(Number(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <span className="text-xs font-semibold text-gray-700 whitespace-nowrap">
                        {Math.round(nearbySearchRadius / 1000 * 10) / 10} km
                    </span>
                </div>
                <p className="text-xs text-gray-400 mb-2">
                    {filteredNearby.length} nearby location{filteredNearby.length !== 1 ? 's' : ''}
                </p>
                <Filters />
            </div>
            <div className="flex-1 py-2 border-t border-gray-200">
                {nearbyLocationsLoading ? (
                    <div className="flex items-center justify-center h-32">
                        <Loader2 className="w-16 h-16 animate-spin text-[#16417F]" />
                    </div>
                ) : filteredNearby.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                        No locations found
                    </div>
                ) : (
                    filteredNearby.map(loc => {
                        const config = typeConfig[loc.type];
                        const isSelected = selectedLocation?.id === loc.id;
                        return (
                            <button
                                key={loc.id}
                                onClick={() => setSelectedLocation(loc)}
                                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors border ${isSelected
                                    ? 'bg-blue-50 border-blue-200'
                                    : 'border-transparent hover:bg-gray-50'
                                    }`}
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
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}