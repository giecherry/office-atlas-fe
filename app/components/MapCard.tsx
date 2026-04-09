"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression } from 'leaflet';
import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";

interface MapProps {
    center: LatLngExpression;
    zoom?: number;
}

const defaults = {
    zoom: 13,
};

export default function MapCard({ center = [59.204, 17.610], zoom = defaults.zoom }: MapProps) {
    return (
        <div className="w-full h-full rounded-md overflow-hidden">
            <MapContainer
                center={center}
                zoom={zoom}
                scrollWheelZoom={false}
                style={{ height: "100%", width: "100%" }}
            >
                <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={center}>
                    <Popup>Location</Popup>
                </Marker>
            </MapContainer>
        </div>
    );
}