import {
    CompanyUserShortResponse,
    EnumValue,
    FileResponse
} from "appcoretruckassist/model/models";

import { ChatLink } from "@pages/chat/models";

export interface ChatMessageResponse {
    id: number;
    messageType?: EnumValue;
    sender?: CompanyUserShortResponse;
    senderId: number;
    conversationId: number;
    content: string;
    parentMessageId?: number;
    parentMessageContent?: string;
    createdAt?: string;
    updatedAt: string;
    isEdited?: boolean;
    files?: Array<FileResponse>;
    filesCount?: number;
    media?: Array<FileResponse>;
    mediaCount?: number;
    links?: Array<ChatLink>;
    linksCount?: number;
}
