'use client'

import Filters from "./components/Filters";
import MapCard from "./components/Map";
import { useLocationStore } from "./store/location";


export default function Home() {
  const locations = useLocationStore((state) => state.locations);

  return (
    <main className="flex flex-1 w-full flex-col items-center justify-between py-32 px-16 bg-[#E4E9F1] dark:bg-black sm:items-start">
      <div className="bg-white flex flex-col gap-4 rounded-xl shadow-md p-8 mb-8 w-full">
        <div>Search Bar</div>
        <Filters />
      </div>
      <MapCard />
      {locations && <p>Total locations: {locations.length}</p>}
    </main>
  );
}
