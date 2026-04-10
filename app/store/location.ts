import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Location, locationType } from "../types/location";

type LatLng = { lat: number; lng: number };
type DirectionsStep = { instruction: string; distanceMeters: number };

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

    userLocation: LatLng | null;
    setUserLocation: (location: LatLng | null) => void;

    isNavigating: boolean;
    setIsNavigating: (value: boolean) => void;

    directionsDuration: string | null;
    setDirectionsDuration: (value: string | null) => void;
    directionsSteps: DirectionsStep[];
    setDirectionsSteps: (steps: DirectionsStep[]) => void;

    showDirectionsPicker: boolean;
    setShowDirectionsPicker: (value: boolean) => void;
    directionsOrigin: Location | null;
    setDirectionsOrigin: (loc: Location | null) => void;

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
                        const newFilters = activeFilters.includes(filter)
                            ? activeFilters.filter(f => f !== filter)
                            : [...activeFilters, filter];
                        set({ activeFilters: newFilters, latestFilter: filter });
                    } else {
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
            toggleFavoritesFilter: () => set({ showFavoritesOnly: !get().showFavoritesOnly }),

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
            setSelectedLocation: (location) => set({
                selectedLocation: location,
                ...(location === null ? { isNavigating: false, showDirectionsPicker: false, directionsOrigin: null, directionsDuration: null, directionsSteps: [] } : {}),
            }),

            userLocation: null,
            setUserLocation: (location) => set({ userLocation: location }),

            isNavigating: false,
            setIsNavigating: (value) => set({
                isNavigating: value,
                ...(value === false ? { showDirectionsPicker: false, directionsOrigin: null, directionsDuration: null, directionsSteps: [] } : {}),
            }),

            directionsDuration: null,
            setDirectionsDuration: (value) => set({ directionsDuration: value }),
            directionsSteps: [],
            setDirectionsSteps: (steps) => set({ directionsSteps: steps }),

            showDirectionsPicker: false,
            setShowDirectionsPicker: (value) => set({ showDirectionsPicker: value }),
            directionsOrigin: null,
            setDirectionsOrigin: (loc) => set({ directionsOrigin: loc }),

            showNearbySearch: false,
            setShowNearbySearch: (value) => {
                if (value) {
                    set({ showNearbySearch: true, activeFilters: [] });
                } else {
                    set({ showNearbySearch: false, activeFilters: ['office'] });
                }
            },
            nearbyLocations: [],
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
