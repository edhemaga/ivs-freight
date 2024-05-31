import { CompanyUserShortResponse } from "appcoretruckassist";

export interface BrokerRatingReview {
    ratingId?: number | null;
    thumb?: number | null;
    reviewId?: number | null;
    comment?: string | null;
    commentContent?: string | null;
    companyUser?: CompanyUserShortResponse;
    companyUserId?: number;
    rating?: number;
    isItCurrentCompanyUser?: boolean;
    createdAt?: string;
    updatedAt?: string;
    id?: number;
}
