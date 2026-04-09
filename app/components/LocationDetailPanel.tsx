import { Navigation, Star, Building2, UtensilsCrossed, Train, Bus, X, MapPin, Clock, Phone, Globe, Search } from 'lucide-react';
import { Location } from '../types/location';
import { useLocationStore } from '../store/location';

interface LocationDetailPanelProps {
    location: Location | null;
    onClose: () => void;
}

const getLocationIcon = (type: Location['type']) => {
    const iconClass = "w-10 h-10 text-[#041E42]";
    switch (type) {
        case 'office':
            return <Building2 className={iconClass} />;
        case 'restaurant':
            return <UtensilsCrossed className={iconClass} />;
        case 'train':
            return <Train className={iconClass} />;
        case 'bus':
            return <Bus className={iconClass} />;
    }
};

const getPriceLevelDisplay = (priceLevel?: string) => {
    if (!priceLevel) return null;

    const level = priceLevel.replace('PRICE_LEVEL_', '');

    const priceLevels: Record<string, { icons: string; label: string; color: string }> = {
        'UNSPECIFIED': { icons: '?', label: 'Price unknown', color: 'text-gray-600' },
        'FREE': { icons: '🆓', label: 'Free', color: 'text-green-600' },
        'INEXPENSIVE': { icons: '$', label: 'Budget-friendly', color: 'text-green-600' },
        'MODERATE': { icons: '$$', label: 'Moderate', color: 'text-blue-600' },
        'EXPENSIVE': { icons: '$$$', label: 'Expensive', color: 'text-orange-600' },
        'VERY_EXPENSIVE': { icons: '$$$$', label: 'Very expensive', color: 'text-red-600' },
    };

    return priceLevels[level];
};

export default function LocationDetailPanel({
    location,
    onClose,
}: LocationDetailPanelProps) {
    const { toggleFavorite, favoriteLocations, isNavigating, setIsNavigating, userLocation, setShowNearbySearch } = useLocationStore();

    const isFavorite = location ? favoriteLocations.includes(location.id) : false;
    const isOffice = location?.type === 'office';
    const isGoogleLocation = !isOffice;

    if (!location) {
        return null;
    }

    return (
        <div className="bg-white flex flex-col h-full px-4 py-2">
            <div className="p-2 border-b border-gray-200">
                <div className="flex items-start justify-between mb-1">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className={`p-3 rounded-xl text-white shrink-0`}>
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
                {isGoogleLocation && (location.rating || location.priceLevel || location.distance_km) && (
                    <div className="flex items-center gap-4 text-sm text-gray-600 px-2 pb-2">
                        {location.rating && (
                            <div className="flex items-center gap-1.5">
                                <Star size={16} className="text-yellow-500" />
                                <span className="font-semibold text-gray-900">{location.rating}</span>
                                <span className="text-xs text-gray-400">({location.userRatingCount || 0})</span>
                            </div>
                        )}

                        {location.priceLevel && getPriceLevelDisplay(location.priceLevel) && (
                            <span className={`text-base ${getPriceLevelDisplay(location.priceLevel)?.color}`}>
                                {getPriceLevelDisplay(location.priceLevel)?.icons}
                            </span>
                        )}

                        {location.distance_km && (
                            <div className="flex items-center gap-1.5">
                                <MapPin size={16} className="text-gray-400" />
                                <span>{location.distance_km.toFixed(2)} km</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Details</h3>
                    <p className="text-gray-700">
                        {location.description}
                    </p>
                </div>

                {isGoogleLocation && (
                    <>
                        {location.openingHours?.weekdayDescriptions && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                                    <Clock className="w-4 h-4" />
                                    Hours
                                </h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                    {location.openingHours.weekdayDescriptions.map((day, idx) => (
                                        <p key={idx}>{day}</p>
                                    ))}
                                </div>
                            </div>
                        )}

                        {(location.phoneNumber || location.websiteUri || location.googleMapsUri) && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-700 mb-2">Contact</h3>
                                <div className="space-y-2">
                                    {location.phoneNumber && (
                                        <a
                                            href={`tel:${location.phoneNumber}`}
                                            className="flex items-center gap-2 text-sm text-[#16417F] hover:underline"
                                        >
                                            <Phone className="w-4 h-4" />
                                            {location.phoneNumber}
                                        </a>
                                    )}
                                    {location.websiteUri && (
                                        <a
                                            href={location.websiteUri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-[#16417F] hover:underline"
                                        >
                                            <Globe className="w-4 h-4" />
                                            Website
                                        </a>
                                    )}
                                    {location.googleMapsUri && (
                                        <a
                                            href={location.googleMapsUri}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-2 text-sm text-[#16417F] hover:underline"
                                        >
                                            <MapPin className="w-4 h-4" />
                                            View on Google Maps
                                        </a>
                                    )}
                                </div>
                            </div>
                        )}

                    </>
                )}

                {/* {isOffice && (
                    <div>
                        <button
                            onClick={() => setShowNearbySearch(true)}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-xl font-medium transition-colors"
                        >
                            <Search className="w-4 h-4" />
                            <span>Explore Nearby</span>
                        </button>
                    </div>
                )} */}
            </div>

            <div className="p-6 border-t border-gray-200 space-y-3">
                <button
                    onClick={() => setIsNavigating(!isNavigating)}
                    disabled={!userLocation}
                    title={!userLocation ? "Aktivera din plats först" : undefined}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#16417F] hover:bg-[#041E42] text-white rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Navigation className="w-4 h-4" />
                    <span>{isNavigating ? "Avsluta navigering" : "Get Directions"}</span>
                </button>

                <button
                    onClick={() => toggleFavorite(location.id)}
                    className={`
                        w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl font-medium transition-colors border
                        ${isFavorite
                            ? 'bg-[#F9EEC3] text-[#F1C21B] border-[#F1C21B] hover:bg-[#F8E596]'
                            : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-[#16417F]'
                        }
                    `}
                >
                    <Star className={`w-4 h-4 ${isFavorite ? 'fill-current' : ''}`} />
                    <span>{isFavorite ? 'Saved to Favorites' : 'Add to Favorites'}</span>
                </button>
            </div>
        </div>
    );
}