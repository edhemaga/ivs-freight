import { CompanyUser } from "@pages/chat/models/company-user.model";

export interface CompanyUserChat {
    companyUser: CompanyUser;
    unreadCount: number;
    isFavourite: boolean;
    userType: {
        id: number;
        name: string;
    }
}