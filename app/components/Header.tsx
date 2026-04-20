'use client';
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut, Heart, Building2, UtensilsCrossed, Train, Bus, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth";
import { useLocationStore } from "../store/location";
import type { Location } from "../types/location";

function LocationTypeIcon({ type }: { type: Location['type'] }) {
    const cls = "w-4 h-4 shrink-0 text-[#041E42]";
    switch (type) {
        case 'office': return <Building2 className={cls} />;
        case 'restaurant': return <UtensilsCrossed className={cls} />;
        case 'train': return <Train className={cls} />;
        case 'bus': return <Bus className={cls} />;
    }
}

export default function Header() {
    const router = useRouter();
    const { clearAuth, user } = useAuthStore();
    const { favoritesByUser, removeFavorite, setSelectedLocation } = useLocationStore();
    const favorites = (user?.user_id ? favoritesByUser[user.user_id] : null) ?? [];
    const [favOpen, setFavOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
                setFavOpen(false);
            }
        };
        if (favOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [favOpen]);

    const handleLogout = () => {
        clearAuth();
        router.push('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#041e424a] shadow-md">
            <div className="flex items-center justify-between h-16 px-2 md:p-4 lg:px-6">
                <Link href="/" className="flex items-center gap-3">
                    <Image
                        src="/favicon.ico"
                        alt="OfficeAtlas"
                        width={30}
                        height={30}
                    />
                    <span className="text-2xl font-semibold text-[#041E42]">
                        OfficeAtlas
                    </span>
                </Link>

                <div className="flex items-center gap-1">
                    {!!user && (
                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setFavOpen(v => !v)}
                                className="relative text-[#041E42] hover:text-rose-600 transition-colors p-2 rounded-lg hover:bg-rose-50"
                                aria-label="Favorites"
                            >
                                <Heart size={22} fill={favorites.length > 0 ? 'currentColor' : 'none'} />
                                {favorites.length > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                                        {favorites.length}
                                    </span>
                                )}
                            </button>

                            {favOpen && (
                                <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden z-50">
                                    <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                                        <h3 className="text-sm font-semibold text-[#041E42]">Favorites</h3>
                                        <button onClick={() => setFavOpen(false)} className="p-1 rounded hover:bg-gray-100">
                                            <X className="w-4 h-4 text-gray-500" />
                                        </button>
                                    </div>
                                    {favorites.length === 0 ? (
                                        <p className="text-sm text-gray-400 px-4 py-4 text-center">No saved favorites yet.</p>
                                    ) : (
                                        <ul className="max-h-72 overflow-y-auto divide-y divide-gray-100">
                                            {favorites.map(loc => (
                                                <li key={loc.id} className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 group">
                                                    <button
                                                        className="flex items-center gap-3 flex-1 min-w-0 text-left"
                                                        onClick={() => { setSelectedLocation(loc); setFavOpen(false); }}
                                                    >
                                                        <LocationTypeIcon type={loc.type} />
                                                        <span className="text-sm font-medium text-gray-800 truncate">{loc.name}</span>
                                                    </button>
                                                    <button
                                                        onClick={() => removeFavorite(loc.id)}
                                                        className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-50 transition-all"
                                                        aria-label="Remove favorite"
                                                    >
                                                        <X className="w-3.5 h-3.5 text-rose-500" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {!!user && (
                        <button
                            onClick={handleLogout}
                            className="text-[#041E42] hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                            aria-label="Log out"
                        >
                            <LogOut size={24} />
                        </button>
                    )}
                </div>
            </div>
        </header>
    );
}