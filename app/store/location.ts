import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Location, locationType } from "../types/location";


type LatLng = { lat: number; lng: number };
type DirectionsStep = { instruction: string; distanceMeters: number };

interface LocationStore {
    // --- Internal locations ---
    locations: Location[];
    setLocations: (locations: Location[]) => void;

    // --- Selection ---
    // anchorLocation: the office the user is exploring from. Persists through nearby browsing.
    anchorLocation: Location | null;
    setAnchorLocation: (location: Location | null) => void;

    // selectedLocation: what's currently shown in the detail panel (can be anchor or a nearby result).
    selectedLocation: Location | null;
    setSelectedLocation: (location: Location | null) => void;

    // --- Nearby mode ---
    showNearbySearch: boolean;
    enterNearbyMode: () => void;
    exitNearbyMode: () => void;

    nearbyLocations: Location[];
    setNearbyLocations: (locations: Location[]) => void;

    nearbySearchRadius: number;
    setNearbySearchRadius: (radius: number) => void;

    nearbyLocationsLoading: boolean;
    setNearbyLocationsLoading: (loading: boolean) => void;

    // --- Nearby result filters ---
    activeFilters: locationType[];
    toggleFilter: (filter: locationType | 'all') => void;
    clearFilters: () => void;

    // --- Search ---
    searchQuery: string;
    setSearchQuery: (query: string) => void;

    // --- User location & navigation ---
    userLocation: LatLng | null;
    setUserLocation: (location: LatLng | null) => void;

    isNavigating: boolean;
    setIsNavigating: (value: boolean) => void;

    directionsDuration: string | null;
    setDirectionsDuration: (value: string | null) => void;
    directionsDistance: string | null;
    setDirectionsDistance: (value: string | null) => void;
    directionsSteps: DirectionsStep[];
    setDirectionsSteps: (steps: DirectionsStep[]) => void;

    showDirectionsPicker: boolean;
    setShowDirectionsPicker: (value: boolean) => void;
    directionsOrigin: Location | null;
    setDirectionsOrigin: (loc: Location | null) => void;
    swapDirections: () => void;
}

export const useLocationStore = create<LocationStore>()(
    persist(
        (set, get) => ({
            // --- Internal locations ---
            locations: [],
            setLocations: (locations) => set({ locations }),

            // --- Selection ---
            anchorLocation: null,
            setAnchorLocation: (location) => set({ anchorLocation: location }),

            selectedLocation: null,
            setSelectedLocation: (location) => set({
                selectedLocation: location,
                ...(location === null ? { isNavigating: false, showDirectionsPicker: false, directionsOrigin: null, directionsDuration: null, directionsDistance: null, directionsSteps: [] } : {}),
            }),

            // --- Nearby mode ---
            showNearbySearch: false,
            enterNearbyMode: () => {
                const { anchorLocation } = get();
                if (!anchorLocation) return;
                set({
                    showNearbySearch: true,
                    activeFilters: [],
                    nearbyLocations: [],
                });
            },

            exitNearbyMode: () => set({
                showNearbySearch: false,
                nearbyLocations: [],
                activeFilters: [],
            }),

            nearbyLocations: [],
            setNearbyLocations: (locations) => set({ nearbyLocations: locations }),

            nearbySearchRadius: 300,
            setNearbySearchRadius: (radius) => set({ nearbySearchRadius: radius }),

            nearbyLocationsLoading: false,
            setNearbyLocationsLoading: (loading) => set({ nearbyLocationsLoading: loading }),

            // --- Filters ---
            activeFilters: [],
            toggleFilter: (filter) => {
                const { activeFilters, showNearbySearch } = get();

                if (filter === 'all') {
                    set({ activeFilters: [] });
                    return;
                }

                if (showNearbySearch) {
                    // In nearby mode: multi-select
                    const next = activeFilters.includes(filter)
                        ? activeFilters.filter(f => f !== filter)
                        : [...activeFilters, filter];
                    set({ activeFilters: next });
                } else {
                    // In normal mode: single-select toggle
                    const isSoleActive = activeFilters.includes(filter) && activeFilters.length === 1;
                    set({ activeFilters: isSoleActive ? [] : [filter] });
                }
            },

            clearFilters: () => set({ activeFilters: [] }),

            // --- Search ---
            searchQuery: "",
            setSearchQuery: (query) => set({ searchQuery: query }),

            // --- User location & navigation ---
            userLocation: null,
            setUserLocation: (location) => set({ userLocation: location }),

            isNavigating: false,
            setIsNavigating: (value) => set({
                isNavigating: value,
                ...(value === false ? { showDirectionsPicker: false, directionsOrigin: null, directionsDuration: null, directionsDistance: null, directionsSteps: [] } : {}),
            }),

            directionsDuration: null,
            setDirectionsDuration: (value) => set({ directionsDuration: value }),
            directionsDistance: null,
            setDirectionsDistance: (value) => set({ directionsDistance: value }),
            directionsSteps: [],
            setDirectionsSteps: (steps) => set({ directionsSteps: steps }),

            showDirectionsPicker: false,
            setShowDirectionsPicker: (value) => set({ showDirectionsPicker: value }),
            directionsOrigin: null,
            setDirectionsOrigin: (loc) => set({ directionsOrigin: loc }),
            swapDirections: () => {
                const state = get();
                const origin = state.directionsOrigin;
                const destination = state.selectedLocation;

                if (!state.isNavigating || !destination) return;

                set({
                    directionsOrigin: destination as any,
                    selectedLocation: origin ?? destination,
                    directionsSteps: [],
                    directionsDuration: null,
                    directionsDistance: null,
                });
            },
        }),
        {
            name: "location-store",
        }
    )
);