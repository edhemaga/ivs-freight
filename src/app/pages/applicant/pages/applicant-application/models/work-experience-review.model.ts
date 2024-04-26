export interface WorkExperienceReview {
    workExperienceItemId: number;
    isPrimary: boolean;
    commonMessage: string;
    isEmployerValid: boolean;
    employerMessage: string | null;
    isJobDescriptionValid: boolean;
    isFromValid: boolean;
    isToValid: boolean;
    jobDescriptionMessage: string | null;
    isPhoneValid: boolean;
    isFaxValid: boolean;
    isEmailValid: boolean;
    contactMessage: string | null;
    isAddressValid: boolean;
    isAddressUnitValid: boolean;
    addressMessage: string | null;
    isAccountForPeriodBetweenValid: boolean;
    accountForPeriodBetweenMessage: string | null;
}