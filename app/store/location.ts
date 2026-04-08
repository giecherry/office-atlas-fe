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

    userLocation: google.maps.LatLngLiteral | null;
    setUserLocation: (location: google.maps.LatLngLiteral | null) => void;

    isNavigating: boolean;
    setIsNavigating: (value: boolean) => void;


    showNearbySearch: boolean;
    setShowNearbySearch: (value: boolean) => void;
    nearbyLocations: Location[];
    setNearbyLocations: (locations: Location[]) => void;
    nearbySearchRadius: number;
    setNearbySearchRadius: (radius: number) => void;
}


export const useLocationStore = create<LocationStore>()(
    persist(
        (set, get) => ({
            locations: [],
            setLocations: (locations) => set({ locations }),

            activeFilters: ['office'],
            setActiveFilters: (filters) => set({ activeFilters: filters }),
            latestFilter: 'office',

            toggleFilter: (filter) => {
                const { activeFilters, showFavoritesOnly, showNearbySearch } = get();

                if (filter === 'all') {
                    if (showFavoritesOnly || activeFilters.length > 0) {
                        set({ activeFilters: [], showFavoritesOnly: false, latestFilter: null });
                    }
                } else {
                    if (showNearbySearch) {
                        // Multi-select for NearbySearch
                        const newFilters = activeFilters.includes(filter)
                            ? activeFilters.filter(f => f !== filter)
                            : [...activeFilters, filter];
                        set({ activeFilters: newFilters, latestFilter: filter });
                    } else {
                        // Single-select for ResultList
                        if (activeFilters.includes(filter) && activeFilters.length === 1) {
                            set({ activeFilters: [], latestFilter: null });
                        } else {
                            set({ activeFilters: [filter], latestFilter: filter });
                        }
                    }
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
            setSelectedLocation: (location) => set({ selectedLocation: location, ...(location === null ? { isNavigating: false } : {}) }),

            userLocation: null,
            setUserLocation: (location) => set({ userLocation: location }),

            isNavigating: false,
            setIsNavigating: (value) => set({ isNavigating: value }),

            showNearbySearch: false,
            setShowNearbySearch: (value) => {
                if (value) {
                    set({ showNearbySearch: true, activeFilters: [] });
                } else {
                    set({ showNearbySearch: false, activeFilters: ['office'] });
                }
            }, nearbyLocations: [],
            setNearbyLocations: (locations) => set({ nearbyLocations: locations }),
            nearbySearchRadius: 1000,
            setNearbySearchRadius: (radius) => set({ nearbySearchRadius: radius }),
        }),
        {
            name: "location-store",
            partialize: (state) => ({ favoriteLocations: state.favoriteLocations }),
        }
    )
);