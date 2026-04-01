'use client'

import { useState } from "react";
import { useLocationStore } from "../store/location";

export default function Search() {
    const locations = useLocationStore((state) => state.locations);
    const [query, setQuery] = useState("");

    const filtered = query.trim().length > 0
        ? locations.filter((loc) =>
            loc.name.toLowerCase().includes(query.toLowerCase())
          )
        : [];

    return (
        <div className="relative w-full">
            <div className="flex items-center bg-white rounded-2xl border border-zinc-200 shadow-sm px-4 py-3 gap-3">
                <svg className="text-zinc-400 w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                </svg>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search location (e.g. reception, food, building)"
                    className="flex-1 outline-none text-zinc-600 placeholder-zinc-400 bg-transparent text-sm"
                />
            </div>
            {filtered.length > 0 && (
                <ul className="absolute top-full mt-1 w-full bg-white rounded-xl border border-zinc-200 shadow-md z-10 overflow-hidden">
                    {filtered.map((loc) => (
                        <li key={loc.id}>
                            <button
                                className="w-full text-left px-4 py-3 hover:bg-zinc-50 text-sm text-zinc-700 border-b border-zinc-100 last:border-0"
                                onClick={() => {
                                    setQuery(loc.name);
                                }}
                            >
                                <span className="font-medium">{loc.name}</span>
                                <span className="ml-2 text-xs text-zinc-400">{loc.type}</span>
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
