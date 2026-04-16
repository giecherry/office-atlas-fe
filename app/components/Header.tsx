'use client';
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "../store/auth";

export default function Header() {
    const router = useRouter();
    const { isAuthenticated, clearAuth } = useAuthStore();
    const [authenticated, setAuthenticated] = useState(false);

    useEffect(() => {
        const sync = () => setAuthenticated(isAuthenticated());
        sync();
        window.addEventListener('auth-change', sync);
        return () => window.removeEventListener('auth-change', sync);
    }, [isAuthenticated]);


    const handleLogout = () => {
        clearAuth();
        router.push('/login');
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#041e424a] shadow-md">
            <div className="flex items-center justify-between h-16 px-2 md:p-4  lg:px-6 ">
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
                {authenticated &&
                    <button
                        onClick={handleLogout}
                        className="text-[#041E42] hover:text-red-700 transition-colors p-2 rounded-lg hover:bg-red-50"
                        aria-label="Log out"
                    >
                        <LogOut size={24} />
                    </button>
                }
            </div>
        </header>
    );
}