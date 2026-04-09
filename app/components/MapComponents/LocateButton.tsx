import { useMap } from "react-leaflet";
import L from 'leaflet';
import { useEffect, useCallback, useRef, useState } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { useLocationStore } from "../../store/location";
import { getDistance } from "../../utils/general";
import { LocateFixed } from "lucide-react";

export function LocateButton() {
    const map = useMap();
    const [loading, setLoading] = useState(false);
    const { userLocation, setUserLocation } = useLocationStore();
    const watchIdRef = useRef<number | null>(null);
    const lastPosRef = useRef<{ lat: number; lng: number } | null>(null);

    const handleLocate = useCallback(() => {
        if (!navigator.geolocation) return;
        setLoading(true);
        lastPosRef.current = null;

        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
        }

        watchIdRef.current = navigator.geolocation.watchPosition(
            (pos) => {
                const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
                const prev = lastPosRef.current;
                const distance = prev ? getDistance(prev, newPos) : Infinity;
                const isFirstFix = !prev;

                if (isFirstFix || distance > 20) {
                    lastPosRef.current = newPos;
                    setUserLocation(newPos);
                    map.setView([newPos.lat, newPos.lng], isFirstFix ? 15 : map.getZoom());
                }
                setLoading(false);
            },
            () => setLoading(false),
            { timeout: 10000, enableHighAccuracy: true }
        );
    }, [map, setUserLocation]);

    useEffect(() => {
        if (!map) return;
        const control = L.control({ position: 'bottomright' });
        const iconHTML = renderToStaticMarkup(<LocateFixed size={28} />);
        control.onAdd = () => {
            const div = L.DomUtil.create('div', 'user-marker');
            div.innerHTML = `
                <button class="w-10 h-10 flex items-center justify-center text-[#16417F] bg-white rounded-xl hover:bg-[#16417F]  hover:text-white transition-all cursor-pointer" id="locateBtn">
                    ${iconHTML}
                </button>
            `;
            div.querySelector('#locateBtn')?.addEventListener('click', handleLocate);
            return div;
        };
        control.addTo(map);
        return () => {
            map.removeControl(control);
        };
    }, [map, handleLocate]);

    useEffect(() => {
        if (!map || !userLocation) return;
        const userIcon = L.divIcon({
            html: `
                <div class="relative flex items-center justify-center w-8 h-8">
                    <div class="absolute w-8 h-8 rounded-full bg-[#16417F] opacity-20 animate-pulse"></div>
                    <div class="absolute w-5 h-5 rounded-full bg-[#16417F] opacity-30"></div>
                    <div class="w-3.5 h-3.5 rounded-full bg-[#16417F] border-2 border-white shadow-lg z-10"></div>
                </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            className: 'user-marker',
        });
        const marker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon }).addTo(map);
        return () => {
            map.removeLayer(marker);
        };
    }, [map, userLocation]);

    return null;
}
