// Enums
import { ChatAttachmentType } from '@pages/chat/enums/conversation/chat-attachment-type.enum';
import { ChatConversationStatus } from '@pages/chat/enums/conversation/chat-conversation-status.enum';

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
