import {
    CompanyUserShortResponse,
    EnumValue,
    FileResponse
} from "appcoretruckassist/model/models";

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
    attachments?: Array<FileResponse>;
}
