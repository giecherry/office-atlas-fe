'use client';

import { Marker } from "react-leaflet";
import L from 'leaflet';
import { useRef } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import type { Location } from "../../types/location";
import { LOCATION_TYPE_CONFIG } from '../../utils/locationTypes';


function renderCustomPin(loc: Location, isSelected: boolean = false, isHovered: boolean = false, isAnchor: boolean = false): string {
    const config = LOCATION_TYPE_CONFIG[loc.type];
    let pinColor: string;

    if (isAnchor || isSelected && loc.type === 'office') {
        pinColor = '#4A89F3';
    } else if (isSelected) {
        pinColor = `color-mix(in srgb, ${config.color || '#87AFE8'} 60%, white)`;
    } else {
        pinColor = config.color || '#87AFE8';
    }

    const showLabel = isSelected || isHovered || isAnchor;
    const iconHTML = renderToStaticMarkup(<>{config.icon('w-6 h-6')}</>);
    return `
        <div class="flex flex-col items-center transition-transform duration-300" style="cursor: pointer;">
            <div class="absolute -top-8 left-1/2 whitespace-nowrap px-2 py-0.5 rounded-md text-white shadow-md text-sm font-medium${showLabel ? ' marker-label-active' : ''}" style="background-color: ${pinColor}; opacity: ${showLabel ? '1' : '0'}; pointer-events: none;">
                ${loc.name}
            </div>
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shadow-md transition-all duration-300" style="background-color: ${pinColor}; box-shadow: ${isSelected ? '0 0 12px rgba(0,0,0,0.3)' : '0 2px 8px rgba(0,0,0,0.2)'}">
                ${iconHTML}
            </div>
            <div class="w-0 h-0" style="border-left: 7px solid transparent; border-right: 7px solid transparent; border-top: 9px solid ${pinColor}; margin-top: -1px;"></div>
        </div>
    `;
}

interface CustomMarkerProps {
    loc: Location;
    isSelected: boolean;
    isHovered: boolean;
    isAnchor: boolean;
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onClick: () => void;
}

export function CustomMarker({
    loc,
    isSelected,
    isAnchor,
    isHovered,
    onMouseEnter,
    onMouseLeave,
    onClick,
}: CustomMarkerProps) {
    const markerRef = useRef<L.Marker>(null);

    const icon = L.divIcon({
        html: renderCustomPin(loc, isSelected, isHovered, isAnchor),
        iconSize: [40, 50],
        iconAnchor: [20, 50],
        popupAnchor: [0, -50],
        className: '',
    });

    return (
        <Marker
            ref={markerRef}
            position={[Number(loc.coordinates.lat), Number(loc.coordinates.lng)]}
            icon={icon}
            eventHandlers={{
                click: onClick,
                mouseover: onMouseEnter,
                mouseout: onMouseLeave,
            }}
            title={loc.name}
        >
        </Marker>
    );
}
