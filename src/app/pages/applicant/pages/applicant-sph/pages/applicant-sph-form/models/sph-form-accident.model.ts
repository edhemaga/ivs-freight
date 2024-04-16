export interface SphFormAccident {
    accidentDate: string;
    accidentLocation: any;
    accidentState?: string;
    accidentDescription: string;
    hazmatSpill: string;
    fatalities: number;
    injuries: number;
    isEditingAccident: boolean;
}
