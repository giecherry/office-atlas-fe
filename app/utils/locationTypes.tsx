import { Building2, UtensilsCrossed, Train, Bus } from 'lucide-react';
import type { locationType } from '../types/location';

export interface LocationTypeConfig {
    color: string;
    label: string;
    icon: (className?: string) => React.ReactNode;
}

export const LOCATION_TYPE_CONFIG: Record<locationType, LocationTypeConfig> = {
    office: { color: '#16417F', label: 'Office', icon: (cls) => <Building2 className={cls ?? 'w-4 h-4'} /> },
    restaurant: { color: '#B20018', label: 'Restaurant', icon: (cls) => <UtensilsCrossed className={cls ?? 'w-4 h-4'} /> },
    train: { color: '#EAAD06', label: 'Train', icon: (cls) => <Train className={cls ?? 'w-4 h-4'} /> },
    bus: { color: '#008064', label: 'Bus', icon: (cls) => <Bus className={cls ?? 'w-4 h-4'} /> },
};