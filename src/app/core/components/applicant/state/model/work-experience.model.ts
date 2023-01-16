export interface WorkExpereienceModel {
    id?: number;
    reviewId?: number;
    applicantId?: string;
    employer: string;
    jobDescription: string;
    fromDate: string;
    toDate: string;
    employerPhone: string;
    employerEmail: string;
    employerFax: string;
    employerAddress: any;
    employerAddressUnit: string;
    isDrivingPosition: boolean;
    classesOfEquipment: any;
    truckType?: string;
    trailerType?: string;
    trailerLength?: string;
    cfrPart?: boolean;
    fmCSA?: boolean;
    reasonForLeaving: string;
    accountForPeriod: string;
    isEditingWorkExperience: boolean;
    workExperienceItemReview: any;
}
