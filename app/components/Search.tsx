'use client'

import { useLocationStore } from "../store/location";

export default function Search() {
    const { searchQuery, setSearchQuery } = useLocationStore();

    return (
        <div className="flex items-center bg-white rounded-md border border-zinc-200 shadow-sm px-2 py-2 gap-1">
            <svg className="text-zinc-400 w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                    setSearchQuery(e.target.value);
                }}
                placeholder="Search your office building"
                className="flex-1 outline-none text-zinc-600 placeholder-zinc-400 bg-transparent text-sm"
            />
        </div>
    );
}
