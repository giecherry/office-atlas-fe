import { useState, useEffect } from 'react';
import {
    Navigation, Building2, UtensilsCrossed, Train, Bus,
    X, MapPin, Search, LocateFixed, Loader2,
    Clock, Accessibility, HandPlatter, ArrowLeft, BookUser, ExternalLink
} from 'lucide-react';
import { Location } from '../types/location';
import { useLocationStore } from '../store/location';
import { getNearbyLocations } from '../api/locations';
import { getAddressFromCoordinates } from '../utils/geocoding';
import { getGoogleMapsUrl } from '../utils/general';
import NearbySearch from './NearbySearch';

interface LocationDetailPanelProps {
    location: Location | null;
    onClose: () => void;
    isMobileModal?: boolean;
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

export default function LocationDetailPanel({ location, onClose, isMobileModal }: LocationDetailPanelProps) {
    const {
        userLocation, setUserLocation,
        showNearbySearch, enterNearbyMode, exitNearbyMode,
        setNearbyLocations, setNearbyLocationsLoading,
        setAnchorLocation, anchorLocation,
        isNavigating, setIsNavigating,
        showDirectionsPicker, setShowDirectionsPicker,
        setDirectionsOrigin,
        directionsDuration, directionsDistance, directionsSteps,
        locations, setSelectedLocation,
    } = useLocationStore();

    const [isLocating, setIsLocating] = useState(false);
    const [address, setAddress] = useState<string | null>(null);

    useEffect(() => {
        if (!location) return;
        setAddress(null);
        getAddressFromCoordinates(location.coordinates.lat, location.coordinates.lng)
            .then(setAddress);
    }, [location]);

    const availableOrigins = locations.filter(loc => loc.id !== location?.id);
    const isAnchor = showNearbySearch && anchorLocation?.id === location?.id;
    const isViewingNearbyResult = showNearbySearch && anchorLocation && location?.id !== anchorLocation.id;

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

    const handleNearbySearchClick = async () => {
        if (!location) return;
        if (showNearbySearch) {
            exitNearbyMode();
            return;
        }
        setAnchorLocation(location);
        enterNearbyMode();
        setNearbyLocationsLoading(true);
        try {
            const data = await getNearbyLocations(
                location.id,
                Number(location.coordinates.lat),
                Number(location.coordinates.lng),
                1000
            );
            setNearbyLocations(data);
        } finally {
            setNearbyLocationsLoading(false);
        }
    };

    if (!location) return null;

    return (
        <div className="bg-white flex flex-col h-full px-4 py-2">
            <div className="pt-2 border-b border-gray-200">
                {isViewingNearbyResult && (
                    <button
                        onClick={() => {
                            if (isMobileModal) {
                                onClose();
                            } else {
                                setSelectedLocation(anchorLocation);
                            }
                        }}
                        className="flex items-center gap-1.5 text-sm text-[#16417F] hover:underline mb-3 mt-2"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        {isMobileModal ? 'Back to nearby results' : `Back to ${anchorLocation.name}`}
                    </button>
                )}

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
                    {!isViewingNearbyResult && (
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
                            aria-label="Close panel"
                        >
                            <X className="w-4 h-4 text-gray-600" />
                        </button>
                    )}
                </div>

                {isViewingNearbyResult && anchorLocation && (
                    <p className="text-xs text-gray-400 ml-1 mb-1">
                        Near {anchorLocation.name}
                    </p>
                )}
            </div>

            <div className="flex-1 overflow-y-auto overflow-x-hidden flex flex-col scrollbar scrollbar-thumb-[#16417F] scrollbar-track-[#8fb0de00]">
                <div className="py-4 px-2">
                    {address && (
                        <div>
                            <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                <MapPin className="w-4 h-4" />
                                Address
                            </h3>
                            {location.type == 'office' ?
                                <>
                                    <p className="text-sm text-gray-600 mb-2">{address}</p>
                                    <a
                                        href={getGoogleMapsUrl(location.coordinates.lat, location.coordinates.lng)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-[#16417F] hover:underline"
                                    >
                                        Open in Google Maps  <ExternalLink size={14} />
                                    </a>
                                </>
                                :
                                <p className="text-sm text-gray-60 m-2">{address}</p>
                            }
                        </div>
                    )}
                    {location.type !== 'office' && (
                        <>
                            {location.openingHours && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <Clock className="w-4 h-4" />
                                        Opening Hours
                                    </h3>
                                    <div className="space-y-1">
                                        {location.openingHours.split(';').map((hours, idx) => (
                                            <p key={idx} className="text-sm text-gray-600">{hours.trim()}</p>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {location.cuisine && (
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                        <HandPlatter className="w-4 h-4" />
                                        Cuisine
                                    </h3>
                                    <p className="text-sm capitalize text-gray-600">{location.cuisine}</p>
                                </div>
                            )}

                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <BookUser className="w-4 h-4" />
                                    Contact
                                </h3>
                                <div className="flex flex-col gap-2">
                                    {location.website && (
                                        <a
                                            href={location.website}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-1 text-sm text-[#16417F] hover:underline"
                                        >
                                            Website <ExternalLink size={14} />
                                        </a>
                                    )}
                                    <a
                                        href={getGoogleMapsUrl(location.coordinates.lat, location.coordinates.lng, location.name)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-1 text-sm text-[#16417F] hover:underline"
                                    >
                                        Open in Google Maps <ExternalLink size={14} />
                                    </a>
                                </div>
                            </div>

                            {location.wheelchairAccessibility == true && (
                                <div>
                                    <Accessibility />
                                </div>
                            )}
                        </>
                    )}
                </div>

                {isAnchor && showNearbySearch && (
                    <NearbySearch />
                )}
            </div>

            <div className="border-t py-4 px-4 border-gray-200 space-y-3">
                {location.type === 'office' && (
                    <button
                        onClick={handleNearbySearchClick}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-sm font-semibold rounded-xl transition-colors"
                    >
                        <Search className="w-4 h-4" strokeWidth={3} />
                        <span>{showNearbySearch ? 'Exit Nearby' : 'Explore Nearby'}</span>
                    </button>
                )}

                <button
                    onClick={() => isNavigating ? setIsNavigating(false) : setShowDirectionsPicker(!showDirectionsPicker)}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#16417F] hover:bg-[#041E42] text-white rounded-xl transition-colors"
                >
                    <Navigation className="w-4 h-4 shrink-0 font-semibold " strokeWidth={3} />
                    {isNavigating ? (
                        <span className='font-semibold text-sm '>Stop Navigation</span>
                    ) : showDirectionsPicker ? (
                        <span className='font-semibold text-sm '>Cancel</span>
                    ) : (
                        <div className="flex flex-col items-center">
                            <span className="text-sm font-semibold leading-tight">Get Directions</span>
                            <span className="text-xs font-normal opacity-75 leading-tight">{location.name}</span>
                        </div>
                    )}
                </button>

                {isNavigating && (directionsDuration || directionsSteps.length > 0) && (
                    <div className="rounded-xl border border-blue-100 bg-blue-50 overflow-hidden">
                        {directionsDuration && (
                            <div className="flex items-center gap-2 px-3 py-2.5 text-sm text-[#16417F] font-medium border-b border-blue-100">
                                <Navigation className="w-4 h-4 shrink-0" />
                                <span>Walking time: {directionsDuration}{directionsDistance && ` · ${directionsDistance}`}</span>
                            </div>
                        )}
                        {directionsSteps.length > 0 && (
                            <ol className="max-h-48 overflow-y-auto divide-y divide-blue-100 scrollbar-thin scrollbar-thumb-[#16417F] scrollbar-track-[#8fb0de00]">
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

                        {isViewingNearbyResult && anchorLocation &&
                            <button
                                onClick={() => { setDirectionsOrigin(anchorLocation); setIsNavigating(true); setShowDirectionsPicker(false); }}
                                className="w-full flex items-center gap-2 px-3 py-2.5 hover:bg-blue-50 text-left transition-colors border-b border-gray-100 disabled:opacity-50"
                            >
                                <MapPin className="w-4 h-4shrink-0 text-[#16417F]" />
                                <span className="text-sm font-medium text-gray-900">{anchorLocation?.name}</span>
                            </button>

                        }

                        {availableOrigins.length > 0 && (
                            <div className="max-h-44 overflow-y-auto scrollbar scrollbar-thumb-[#16417F] scrollbar-track-[#8fb0de00]">
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
        </div >
    );
}
