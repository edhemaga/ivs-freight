// Models
import {
    ChatCompanyChannelExtended,
    ChatConversationDetails,
    ChatMessage,
    ChatSelectedConversation,
} from '@pages/chat/models';
import {
    CompanyUserChatResponsePagination,
    ConversationInfoResponse,
} from 'appcoretruckassist';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';

// Enums
import { ChatViewTypeEnum } from '@pages/chat/enums';

export type ChatState = {
    // Conversation list
    departments?: ChatCompanyChannelExtended[];
    truckChannel?: ChatCompanyChannelExtended[];
    dispatchBoardChannel?: ChatCompanyChannelExtended[];
    companyUsers?: CompanyUserChatResponsePagination;
    drivers?: CompanyUserChatResponsePagination;

    // Conversation
    conversation?: ChatSelectedConversation;

    // Messages
    messageResponsePageIndex: number;
    messageResponsePageSize: number;
    messageResponseCount: number;
    messageResponseData: ChatMessage[];
    unreadCount?: number;
    favoriteCount?: number;
    attachments: UploadFile[];

    // Conversation details
    isProfileDetailsDisplayed?: boolean;
    isConversationParticipantsDisplayed?: boolean;
    profileDetails: ChatConversationDetails;
    userTyping: string;

    // Actions
    messageToReply?: ChatMessage | null;
    messageToEdit?: ChatMessage | null;
    isAttachmentUploadActive?: boolean;

    //Search
    userSearchTerm?: string;
    messageSearchTerm?: string;

    // Settings
    viewType?: string;
};
