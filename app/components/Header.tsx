'use client';
import Image from "next/image";

export default function Header() {
    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b-2 border-[#041e424a] shadow-md">
            <div className="flex items-center justify-between h-16 px-2 lg:px-16 ">
                <div className="flex items-center gap-3">
                    <Image
                        src="/favicon.ico"
                        alt="OfficeAtlas"
                        width={30}
                        height={30}
                    />
                    <span className="text-2xl font-semibold text-[#041E42]">
                        OfficeAtlas
                    </span>
                </div>
            </div>
        </header>
    );
}