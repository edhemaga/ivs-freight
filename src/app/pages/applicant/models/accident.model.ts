export interface SphFormAccidentModel {
    accidentDate: string;
    accidentLocation: any;
    accidentState?: string;
    accidentDescription: string;
    hazmatSpill: string;
    fatalities: number;
    injuries: number;
    isEditingAccident: boolean;
}

export interface AccidentModel {
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
