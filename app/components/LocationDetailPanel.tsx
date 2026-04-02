import { Navigation, Star, Building2, UtensilsCrossed, Train, Bus, X } from 'lucide-react';
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

export default function LocationDetailPanel({
    location,
    onClose,
}: LocationDetailPanelProps) {
    const { toggleFavorite, favoriteLocations } = useLocationStore();
    const isFavorite = location ? favoriteLocations.includes(location.id) : false;

    if (!location) {
        return null;
    }

    return (
        <div className="bg-white flex flex-col h-full px-4 py-2">
            <div className="p-2 border-b border-gray-200">
                <div className="flex items-start justify-between mb-3">
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
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Details</h3>
                    <p className="text-gray-700">
                        {location.description}
                    </p>
                </div>
            </div>

            <div className="p-6 border-t border-gray-200 space-y-3">
                <button
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#16417F] hover:bg-[#041E42] text-white rounded-xl font-medium transition-colors"
                >
                    <Navigation className="w-4 h-4" />
                    <span>Get Directions</span>
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