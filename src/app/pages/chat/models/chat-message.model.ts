import {
    CompanyUserShortResponse,
    EnumValue,
    FileResponse,
} from 'appcoretruckassist/model/models';

import { ChatLink } from '@pages/chat/models';

export interface ChatMessage {
    id: number;
    messageType?: EnumValue;
    sender?: CompanyUserShortResponse;
    senderId: number;
    conversationId: number;
    content: string;
    parentId?: number;
    parentMessageId?: number;
    parentMessageContent?: string;
    parentMessageSenderFullname?: string;
    createdAt?: string;
    updatedAt: string;
    isDeleted?: boolean;
    isEdited?: boolean;
    files?: Array<FileResponse>;
    filesCount?: number;
    media?: Array<FileResponse>;
    mediaCount?: number;
    links?: Array<ChatLink>;
    linksCount?: number;
}
