import { Navigation, Star, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Location } from '../types/location';

interface LocationDetailPanelProps {
    location: Location;
    onClose: () => void;
}

export default function LocationDetailPanel({
    location,
    onClose
}: LocationDetailPanelProps) {
    if (!location) {
        return null;
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="h-full flex flex-col"
        >
            <div className="p-6 border-b">
                <div className="flex items-start justify-between mb-3">
                    <div className="flex items-start gap-4 flex-1 min-w-0">
                        <h2 className="text-lg font-semibold">{location.name}</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0 ml-2"
                        aria-label="Close panel"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
                <p className="text-sm text-gray-500">{location.type}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
                <div>
                    <h3 className="text-sm font-semibold mb-2">Description</h3>
                    <p className="text-sm text-gray-600">
                        {location.description}
                    </p>
                </div>
            </div>

            <div className="p-6 border-t border-gray-300 space-y-3">
                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#16417F] hover:bg-[#041E42] text-white rounded-xl font-medium transition-colors">
                    <Navigation className="w-4 h-4" />
                    <span>Get Directions</span>
                </button>

                <button className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-xl font-medium hover:bg-gray-50 transition-colors">
                    <Star className="w-4 h-4" />
                    <span>Add to Favorites</span>
                </button>
            </div>
        </motion.div>
    );
}