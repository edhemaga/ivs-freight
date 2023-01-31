export interface ContactModel {
    id?: number;
    reviewId?: number;
    name: string;
    phone: string;
    relationship: string;
    isEditingContact: boolean;
    emergencyContactReview: any;
}
