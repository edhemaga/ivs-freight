import {
    AddressEntity,
    WorkExperienceItemReviewResponse,
} from 'appcoretruckassist';
import { ClassOfEquipmentMapped } from '@pages/applicant/models/class-of-equipment-mapped.model';

export interface WorkExperienceItemMapped {
    id: number;
    reviewId?: number;
    isEditingWorkExperience: boolean;
    employer?: string;
    jobDescription?: string | null;
    fromDate: string;
    toDate?: string | null;
    employerPhone?: string | null;
    employerEmail?: string | null;
    employerFax?: string | null;
    employerAddress: AddressEntity;
    employerAddressUnit?: string;
    isDrivingPosition?: boolean;
    currentEmployment?: boolean;
    reasonForLeaving?: string;
    accountForPeriod?: string | null;
    classesOfEquipment: ClassOfEquipmentMapped[];
    workExperienceItemReview?: WorkExperienceItemReviewResponse;
}
