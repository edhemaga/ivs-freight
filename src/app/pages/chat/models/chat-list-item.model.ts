// Enums
import { AttachmentType } from '@pages/chat/enums/conversation/attachment-type.enum';
import { ConversationStatus } from '@pages/chat/enums/conversation/conversation-status.enum';

export interface ChatListItem {
    id: number;
    name: string;
    lastContent?: {
        content: string,
        createdAt: string
    };
    notificationCount?: number;
    status: ConversationStatus;
    pathToAsset: string;
    assetExtension: AttachmentType;
    iconShape?: 'round' | 'rectangular'
}
