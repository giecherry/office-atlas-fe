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

    searchQuery: string;
    setSearchQuery: (query: string) => void;

    selectedLocation: Location | null;
    setSelectedLocation: (location: Location | null) => void;

    userLocation: google.maps.LatLngLiteral | null;
    setUserLocation: (location: google.maps.LatLngLiteral | null) => void;

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

            activeFilters: [],
            setActiveFilters: (filters) => set({ activeFilters: filters }),
            latestFilter: null,

            toggleFilter: (filter) => {
                const { activeFilters, showNearbySearch } = get();

                if (filter === 'all') {
                    set({ activeFilters: [], latestFilter: null });
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

            clearFilters: () => set({ activeFilters: [], latestFilter: null }),


            searchQuery: "",
            setSearchQuery: (query) => set({ searchQuery: query }),

            selectedLocation: null,
            setSelectedLocation: (location) => set({ selectedLocation: location, ...(location === null ? { isNavigating: false } : {}) }),

            userLocation: null,
            setUserLocation: (location) => set({ userLocation: location }),

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
            partialize: (state) => ({ selectedLocation: state.selectedLocation }),
        }
    )
);