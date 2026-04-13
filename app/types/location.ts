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

    // Restaurant specific
    cuisine?: string;
    website?: string;
    openingHours?: string;
    wheelchairAccessibility?: boolean;

    // Transport specific
    network?: string;
    shelter?: boolean;
}
