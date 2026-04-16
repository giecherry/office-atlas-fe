'use client'

import { Building2, UtensilsCrossed, Train, Bus } from 'lucide-react';
import { useLocationStore } from '../store/location';
import type { locationType } from '../types/location';
import Search from './Search';

const typeConfig: Record<locationType, { icon: React.ReactNode; color: string; label: string }> = {
    office: { icon: <Building2 className="w-4 h-4" />, color: '#16417F', label: 'Office' },
    restaurant: { icon: <UtensilsCrossed className="w-4 h-4" />, color: '#B20018', label: 'Restaurant' },
    train: { icon: <Train className="w-4 h-4" />, color: '#EAAD06', label: 'Train' },
    bus: { icon: <Bus className="w-4 h-4" />, color: '#008064', label: 'Bus' },
};

export default function ResultList() {
    const {
        locations,
        searchQuery,
        selectedLocation,
        setSelectedLocation,
        setAnchorLocation,
        exitNearbyMode,
    } = useLocationStore();

    const filteredLocations = locations.filter(loc => {
        const matchesSearch =
            searchQuery.trim().length === 0 ||
            loc.name.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesSearch;
    });

    return (
        <div className="bg-white flex flex-col h-full px-4 pt-2 pb-2">
            <div className="pt-4 pb-2 flex flex-col gap-2">
                <div className="">
                    <h2 className="uppercase text-xl font-semibold text-gray-900">
                        Workspaces
                    </h2>
                </div>
                <span className="text-sm text-gray-500 shrink-0">
                    {filteredLocations.length} locations
                </span>
                <Search />
            </div>

            <div className="flex-1 overflow-y-auto py-0 px-2 space-y-1 scrollbar-thin scrollbar-thumb-[#16417F] scrollbar-track-[#8fb0de00]">
                {filteredLocations.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-400 text-sm">
                        No locations found
                    </div>
                ) : (
                    filteredLocations.map(loc => {
                        const config = typeConfig[loc.type];
                        const isSelected = selectedLocation?.id === loc.id;
                        return (
                            <button
                                key={loc.id}
                                onClick={() => {
                                    setSelectedLocation(loc);
                                    setAnchorLocation(loc);
                                    exitNearbyMode();
                                }}
                                className={`w-full flex items-center gap-3 px-2 py-2 rounded-xl text-left transition-colors ${isSelected
                                    ? 'bg-blue-50 border border-blue-200'
                                    : 'hover:bg-gray-50 border border-transparent'
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
