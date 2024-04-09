export interface Accident {
    id?: number;
    reviewId: number;
    location: any;
    date: string;
    fatalities: number;
    injuries: number;
    hazmatSpill?: boolean;
    vehicleType: string;
    description: string;
    isEditingAccident: boolean;
    accidentItemReview: any;
}
