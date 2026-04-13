import { useState } from 'react';
import { Navigation, Building2, UtensilsCrossed, Train, Bus, X, MapPin, Search, LocateFixed, Loader2 } from 'lucide-react';
import { Location } from '../types/location';
import { useLocationStore } from '../store/location';

interface LocationDetailPanelProps {
    location: Location | null;
    onClose: () => void;
}

const getLocationIcon = (type: Location['type']) => {
    const iconClass = "w-10 h-10 text-[#041E42]";
    switch (type) {
        case 'office': return <Building2 className={iconClass} />;
        case 'restaurant': return <UtensilsCrossed className={iconClass} />;
        case 'train': return <Train className={iconClass} />;
        case 'bus': return <Bus className={iconClass} />;
    }
};

export default function LocationDetailPanel({ location, onClose }: LocationDetailPanelProps) {
    const {
        userLocation, setUserLocation,
        setShowNearbySearch, showNearbySearch,
        isNavigating, setIsNavigating,
        showDirectionsPicker, setShowDirectionsPicker,
        setDirectionsOrigin,
        directionsDuration, directionsSteps,
        locations,
    } = useLocationStore();

    const [isLocating, setIsLocating] = useState(false);

    const availableOrigins = locations.filter(loc => loc.id !== location?.id);

    const handleUseMyLocation = () => {
        if (userLocation) {
            setDirectionsOrigin(null);
            setIsNavigating(true);
            setShowDirectionsPicker(false);
        } else {
            setIsLocating(true);
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                    setDirectionsOrigin(null);
                    setIsNavigating(true);
                    setShowDirectionsPicker(false);
                    setIsLocating(false);
                },
                () => setIsLocating(false),
                { timeout: 10000, enableHighAccuracy: true }
            );
        }
    };

    if (!location) return null;

    return (
        <div className="bg-white flex flex-col h-full px-4 py-2">
            <div className="p-2 border-b border-gray-200">
                <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="p-3 rounded-xl text-white shrink-0">
                            {getLocationIcon(location.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <h2 className="uppercase text-xl font-semibold text-gray-900 mb-1">
                                {location.name}
                            </h2>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0 ml-2"
                        aria-label="Close panel"
                    >
                        <X className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Details</h3>
                    <p className="text-gray-700">{location.description}</p>
                </div>
            </div>

            <div className="p-6 border-t border-gray-200 space-y-3">
                <button
                    onClick={() => setShowNearbySearch(!showNearbySearch)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-colors"
                >
                    <Search className="w-4 h-4" />
                    <span>Explore Nearby</span>
                </button>

                <button
                    onClick={() => isNavigating ? setIsNavigating(false) : setShowDirectionsPicker(!showDirectionsPicker)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#16417F] hover:bg-[#041E42] text-white rounded-xl font-medium transition-colors"
                >
                    <Navigation className="w-4 h-4" />
                    <span>{isNavigating ? "Avsluta navigering" : "Get Directions"}</span>
                </button>

                {isNavigating && (directionsDuration || directionsSteps.length > 0) && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50 overflow-hidden">
                        {directionsDuration && (
                            <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#16417F] font-medium border-b border-blue-100">
                                <Navigation className="w-4 h-4 shrink-0" />
                                <span>Walking time: {directionsDuration}</span>
                            </div>
                        )}
                        {directionsSteps.length > 0 && (
                            <ol className="max-h-48 overflow-y-auto divide-y divide-blue-100">
                                {directionsSteps.map((step, i) => (
                                    <li key={i} className="flex items-start gap-2 px-3 py-2">
                                        <span className="mt-0.5 w-4 h-4 rounded-full bg-[#16417F] text-white text-[10px] flex items-center justify-center shrink-0 font-bold">
                                            {i + 1}
                                        </span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs text-gray-800">{step.instruction}</p>
                                            {step.distanceMeters > 0 && (
                                                <p className="text-[10px] text-gray-400 mt-0.5">
                                                    {step.distanceMeters < 1000
                                                        ? `${step.distanceMeters} m`
                                                        : `${(step.distanceMeters / 1000).toFixed(1)} km`}
                                                </p>
                                            )}
                                        </div>
                                    </li>
                                ))}
                            </ol>
                        )}
                    </div>
                )}

                {showDirectionsPicker && !isNavigating && (
                    <div className="rounded-xl border border-gray-200 overflow-hidden">
                        <p className="text-xs font-semibold text-gray-500 uppercase px-3 pt-3 pb-2">Start position</p>
                        <button
                            onClick={handleUseMyLocation}
                            disabled={isLocating}
                            className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-blue-50 text-left transition-colors border-b border-gray-100 disabled:opacity-50"
                        >
                            {isLocating
                                ? <Loader2 className="w-4 h-4 text-[#16417F] animate-spin shrink-0" />
                                : <LocateFixed className="w-4 h-4 text-[#16417F] shrink-0" />
                            }
                            <span className="text-sm font-medium text-gray-900">My location</span>
                        </button>
                        {availableOrigins.length > 0 && (
                            <div className="max-h-44 overflow-y-auto">
                                {availableOrigins.map(loc => (
                                    <button
                                        key={loc.id}
                                        onClick={() => { setDirectionsOrigin(loc); setIsNavigating(true); setShowDirectionsPicker(false); }}
                                        className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-gray-50 text-left transition-colors border-b border-gray-100 last:border-0"
                                    >
                                        <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
                                        <span className="text-sm text-gray-800 truncate">{loc.name}</span>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
