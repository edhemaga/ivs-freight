export interface Violation {
    id?: number;
    reviewId: number;
    date: string;
    vehicleType: string;
    vehicleTypeLogoName: string;
    location: any;
    description: string;
    isEditingViolation: boolean;
    trafficViolationItemReview: any;
}
