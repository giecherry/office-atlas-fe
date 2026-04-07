import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Location, locationType } from "../types/location";

interface LocationStore {
    locations: Location[];
    setLocations: (locations: Location[]) => void;
    activeFilters: locationType[];
    setActiveFilters: (filters: locationType[]) => void;
    toggleFilter: (filter: locationType | 'all') => void;
    clearFilters: () => void;
    latestFilter: locationType | null;

    showFavoritesOnly: boolean;
    toggleFavoritesFilter: () => void;
    favoriteLocations: string[];
    toggleFavorite: (locationId: string) => void;

    searchQuery: string;
    setSearchQuery: (query: string) => void;

    selectedLocation: Location | null;
    setSelectedLocation: (location: Location | null) => void;
}

export const useLocationStore = create<LocationStore>()(
    persist(
        (set, get) => ({
            locations: [],
            setLocations: (locations) => set({ locations }),

            activeFilters: [],
            setActiveFilters: (filters) => set({ activeFilters: filters }),
            latestFilter: null,

            toggleFilter: (filter) => {
                const { activeFilters, showFavoritesOnly } = get();

                if (filter === 'all') {
                    if (showFavoritesOnly || activeFilters.length > 0) {
                        set({ activeFilters: [], showFavoritesOnly: false, latestFilter: null });
                    }
                } else {
                    const newFilters = activeFilters.includes(filter)
                        ? activeFilters.filter(f => f !== filter)
                        : [...activeFilters, filter];
                    set({ activeFilters: newFilters, latestFilter: filter });
                }
            },

            clearFilters: () => set({ activeFilters: [], showFavoritesOnly: false, latestFilter: null }),
            showFavoritesOnly: false,
            toggleFavoritesFilter: () => {
                set({ showFavoritesOnly: !get().showFavoritesOnly });
            },

            favoriteLocations: [],
            toggleFavorite: (locationId) => {
                const { favoriteLocations } = get();
                const newFavorites = favoriteLocations.includes(locationId)
                    ? favoriteLocations.filter(id => id !== locationId)
                    : [...favoriteLocations, locationId];
                set({ favoriteLocations: newFavorites });
            },

            searchQuery: "",
            setSearchQuery: (query) => set({ searchQuery: query }),

            selectedLocation: null,
            setSelectedLocation: (location) => set({ selectedLocation: location }),
        }),
        {
            name: "location-store",
            partialize: (state) => ({ favoriteLocations: state.favoriteLocations }),
        }
    )
);