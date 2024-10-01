// Store
import { createReducer, on } from '@ngrx/store';

// Actions
import {
    setMessageResponse,
    deleteMessage,
    addMessage,
    editMessage,
    replyMessage,
    resetReplyAndEditMessage,
} from '@pages/chat/state/actions/chat.actions';

// Models
import {
    ChatCompanyChannelExtended,
    ChatMessage,
    ChatSelectedConversation,
} from '@pages/chat/models';
import {
    CompanyUserChatResponsePagination,
    ConversationResponse,
} from 'appcoretruckassist';

// Enums
import { ChatViewTypeEnum } from '@pages/chat/enums';

export type ChatState = {
    // Conversation list
    departments?: ChatCompanyChannelExtended;
    truckChannel?: ChatCompanyChannelExtended;
    dispatchBoardChannel?: ChatCompanyChannelExtended;
    companyUsers?: CompanyUserChatResponsePagination;
    drivers?: CompanyUserChatResponsePagination;

    // Conversation
    conversation?: ConversationResponse;
    selectedConversation?: ChatSelectedConversation;

    // Messages
    messageResponsePageIndex: number;
    messageResponsePageSize: number;
    messageResponseCount: number;
    messageResponseData: ChatMessage[];

    // Conversation details
    isProfileDetailsDisplayed?: boolean;
    isConversationParticipantsDisplayed?: boolean;
    userTyping?: unknown;

    // Actions
    messageToReply?: ChatMessage | null;
    messageToEdit?: ChatMessage | null;
    isAttachmentUploadActive?: boolean;

    //Search
    userSearchTerm?: string;
    messageSearchTerm?: string;

    // Settings
    viewType?: ChatViewTypeEnum;
};

const initialState: ChatState = {
    conversation: {},
    messageResponsePageIndex: 0,
    messageResponsePageSize: 0,
    messageResponseCount: 0,
    messageResponseData: [],
    isProfileDetailsDisplayed: false,
    isConversationParticipantsDisplayed: false,
    messageToReply: null,
    messageToEdit: null,
};

export const chatDataReducer = createReducer(
    initialState,
    on(setMessageResponse, (state, newState) => ({
        ...state,
        messageResponsePageIndex: newState.pageIndex,
        messageResponsePageSize: newState.pageSize,
        messageResponseCount: newState.count,
        messageResponseData: newState.data,
    })),
    on(deleteMessage, (state, newState) => ({
        ...state,
        messageResponseCount: state.messageResponseCount - 1,
        messageResponseData: state.messageResponseData.filter(
            (message) => message.id !== newState.id
        ),
    })),
    on(addMessage, (state, newState) => ({
        ...state,
        messageResponseCount: state.messageResponseCount + 1,
        messageResponseData: [...state.messageResponseData, newState],
    })),
    on(editMessage, (state, newState) => ({
        ...state,
        messageToEdit: { ...newState },
    })),
    on(replyMessage, (state, newState) => ({
        ...state,
        messageToReply: { ...newState },
    })),
    on(resetReplyAndEditMessage, (state) => ({
        ...state,
        messageToReply: null,
        messageToEdit: null,
    }))
);
