// Models
import { CompanyUser } from '@pages/chat/models';
import { CompanyUserForChatListResponse } from 'appcoretruckassist';

export interface CompanyUserChat extends CompanyUserForChatListResponse {
    companyUser: CompanyUser;
    unreadCount: number;
    isFavourite: boolean;
    userType: {
        id: number;
        name: string;
    };
}
