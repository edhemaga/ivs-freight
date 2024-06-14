import { RatingReviewResponse } from "appcoretruckassist";

export interface RepairShopRatingReviewModal extends RatingReviewResponse {
    commentContent: string;
    rating: null | number;
}