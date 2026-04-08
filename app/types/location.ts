export type locationType =
    | "office"
    | "restaurant"
    | "train"
    | "bus";


export interface Location {
    id: string;
    name: string;
    type: locationType;
    coordinates: {
        lat: number;
        lng: number;
    };
    description: string;


    // Optional fields from Google Places API
    rating?: number;
    userRatingCount?: number;
    googleMapsUri?: string;
    websiteUri?: string;
    phoneNumber?: string;
    priceLevel?: string;
    businessStatus?: string;
    openingHours?: {
        weekdayDescriptions?: string[];
    };
    photos?: Array<{
        name: string;
        heightPx?: number;
        widthPx?: number;
        flagContentUri?: string;
        authorAttributions?: Array<{
            displayName: string;
            uri?: string;
            photoUri?: string;
        }>;
    }>;
    distance_km?: number;
    created_at?: string;
}

