'use client'

import { useState, useEffect } from "react";
import { getLocations } from "./api/locations";

export default function Home() {
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const locations = await getLocations();
      setData(locations);
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex flex-1 w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        OfficeAtlas

        <div>
          {data ? (
            <ul>
              {data.map((location) => (
                <li key={location.id}>{location.name}- {location.type}</li>

              ))}
            </ul>
          ) : (
            <p>Loading...</p>
          )}
        </div>

      </main>
    </div>
  );
}
