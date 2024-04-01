export interface LicenseModel {
    id?: number | null;
    reviewId: number;
    licenseNumber: string | null;
    country: string;
    state: string;
    stateShort?: string;
    classType: string;
    expDate: string;
    endorsments?: any;
    restrictions?: any;
    restrictionsCode?: string[];
    endorsmentsCode?: string[];
    isEditingLicense: boolean;
    licenseReview: any;
}
