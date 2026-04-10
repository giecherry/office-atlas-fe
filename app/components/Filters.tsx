'use client';

import type { locationType } from "../types/location";
import { useLocationStore } from "../store/location";
import { Bus, Utensils, TrainFront, MapPinned } from "lucide-react"

const filterOptions: { type: locationType | 'all'; label: string; icon: React.ReactNode }[] = [
    { type: 'all', label: 'All', icon: <MapPinned size={14} /> },
    { type: 'restaurant', label: 'Restaurant', icon: <Utensils size={14} /> },
    { type: 'train', label: 'Train', icon: <TrainFront size={14} /> },
    { type: 'bus', label: 'Bus', icon: <Bus size={14} /> },
];

export default function Filters() {
    const { activeFilters, toggleFilter } = useLocationStore();
    const showingAll = activeFilters.length === 0;

    return (
        <div className="flex items-center gap-1.5 flex-wrap">
            {filterOptions.map((filter) => {
                const isActive = filter.type === 'all'
                    ? showingAll
                    : activeFilters.includes(filter.type as locationType);

                return (
                    <button
                        key={filter.type}
                        onClick={() => toggleFilter(filter.type)}
                        aria-label={filter.label}
                        className={`
                            flex items-center justify-center gap-2 px-2 py-1 rounded-full transition-all
                            ${isActive
                                ? 'bg-[#16417F] text-white shadow-sm'
                                : 'bg-gray-100 border border-gray-300 text-gray-600 hover:bg-gray-200'
                            }
                        `}
                    >
                        {filter.icon}
                        <span className="text-xs font-medium">{filter.label}</span>
                    </button>
                );
            })}
        </div>
    );
}