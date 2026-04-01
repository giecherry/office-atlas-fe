'use client';

import type { locationType } from "../types/location";
import { useLocationStore } from "../store/location";
import { Bus, Building2, Utensils, TrainFront, MapPinned, Star } from "lucide-react"

const filterOptions: { type: locationType | 'all'; label: string; icon: React.ReactNode }[] = [
    { type: 'all', label: 'All', icon: <MapPinned /> },
    { type: 'office', label: 'Office', icon: <Building2 /> },
    { type: 'restaurant', label: 'Restaurant', icon: <Utensils /> },
    { type: 'train', label: 'Train', icon: <TrainFront /> },
    { type: 'bus', label: 'Bus', icon: <Bus /> },
];

export default function Filters() {
    const { activeFilters, toggleFilter, clearFilters, showFavoritesOnly, toggleFavoritesFilter, favoriteLocations } = useLocationStore();
    const showingAll = activeFilters.length === 0 && !showFavoritesOnly;
    const hasFavorites = favoriteLocations.length > 0;

    return (
        <div className="flex items-center gap-2">
            <div className="flex gap-2 flex-wrap">
                {filterOptions.map((filter) => {
                    const isActive = filter.type === 'all'
                        ? showingAll
                        : activeFilters.includes(filter.type as locationType);

                    return (
                        <button
                            key={filter.type}
                            onClick={() => toggleFilter(filter.type)}
                            className={`
                                flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap
                                ${isActive
                                    ? 'bg-[#16417F] text-white shadow-sm'
                                    : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#041E42]'
                                }
                            `}
                        >
                            <span>{filter.icon}</span>
                            <span className="text-sm font-medium">{filter.label}</span>
                        </button>
                    );
                })}

                <button
                    onClick={toggleFavoritesFilter}
                    disabled={!hasFavorites}
                    className={`
                        flex items-center gap-2 px-4 py-2 rounded-lg transition-all whitespace-nowrap
                        ${showFavoritesOnly
                            ? 'bg-[#16417F] text-white shadow-sm'
                            : hasFavorites
                                ? 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-[#041E42]'
                                : 'bg-gray-100 border border-gray-200 text-gray-400 cursor-not-allowed'
                        }
                    `}
                >
                    <Star />
                    <span className="text-sm font-medium">Favorites</span>
                    {hasFavorites && (
                        <span className={`text-xs px-1.5 py-0.5 rounded-full font-semibold
                            ${showFavoritesOnly
                                ? 'bg-white/20'
                                : 'bg-gray-200'
                            }`}>
                            {favoriteLocations.length}
                        </span>
                    )}
                </button>
            </div>

            {!showingAll && (
                <button
                    onClick={clearFilters}
                    className="text-sm text-[#16417F] hover:text-[#041E42] font-medium whitespace-nowrap px-3"
                >
                    Clear
                </button>
            )}
        </div>
    );
}