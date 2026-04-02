'use client'

import Filters from "./components/Filters";
import MapCard from "./components/Map";
import Search from "./components/Search";
import LocationDetailPanel from "./components/LocationDetailPanel";
import { useLocationStore } from "./store/location";

export default function Home() {
  const { selectedLocation, setSelectedLocation } = useLocationStore();

  return (
    <main className="flex flex-1 w-full flex-col items-center py-32 px-2 lg:px-16 bg-[#E4E9F1] dark:bg-black sm:items-start">
      <div className="bg-white flex flex-col gap-4 rounded-xl shadow-md p-8 mb-8 w-full">
        <Search />
        <Filters />
      </div>
      <MapCard />
      {selectedLocation && (
        <LocationDetailPanel
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </main>
  );
}
