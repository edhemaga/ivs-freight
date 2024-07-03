export interface License {
    id?: number | null;
    reviewId?: number;
    licenseNumber?: string | null;
    country?: string;
    state?: string;
    stateShort?: string;
    classType?: string;
    expDate?: string;
    issueDate?: string;
    endorsments?: any;
    restrictions?: any;
    restrictionsCode?: string[];
    endorsmentsCode?: string[];
    isEditingLicense?: boolean;
    licenseReview?: any;
    license?: string;
    name?: string;
    files?: any;
    documents?: any;
    filesForDeleteIds?: number[]
}
