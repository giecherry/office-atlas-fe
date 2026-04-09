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
    distance_km?: number;
    created_at?: string;
}

