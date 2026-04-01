import { create } from "zustand";
import type { Location } from "../types/location";

interface LocationStore {
    locations: Location[];
    setLocations: (locations: Location[]) => void;
}

export const useLocationStore = create<LocationStore>((set) => ({
    locations: [],

    setLocations: (locations) => set({ locations }),
}));