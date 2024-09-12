// Enums
import {
    ChatAttachmentType,
    ChatConversationStatus
} from '@pages/chat/enums';

export interface ChatListItem {
    id: number;
    name: string;
    lastContent?: {
        content: string,
        createdAt: string
    };
    notificationCount?: number;
    status: ChatConversationStatus;
    pathToAsset: string;
    assetExtension: ChatAttachmentType;
    isRound?: boolean
}
