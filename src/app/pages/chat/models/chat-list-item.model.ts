// Enums
import {
    ChatAttachmentTypeEnum,
    ChatConversationStatusEnum,
} from '@pages/chat/enums';

export interface ChatListItem {
    id: number;
    name: string;
    lastContent?: {
        content: string;
        createdAt: string;
    };
    notificationCount?: number;
    status: ChatConversationStatusEnum;
    pathToAsset: string;
    assetExtension: ChatAttachmentTypeEnum;
    isRound?: boolean;
}
