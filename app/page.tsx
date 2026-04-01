'use client'

import MapCard from "./components/Map";
import Search from "./components/Search";
import { useLocationStore } from "./store/location";


export default function Home() {
  const locations = useLocationStore((state) => state.locations);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start gap-4">
        OfficeAtlas
        <Search />
        <MapCard />
        {locations && <p>Total locations: {locations.length}</p>}
      </main>
    </div>
  );
}
