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
    setConversation,
    displayProfileDetails,
    displayConversationParticipants,
    closeAllProfileInformation,
    setUnreadCount,
    setProfileDetails,
    setUserTyping,
} from '@pages/chat/store/actions/chat.actions';

// Models
import { ChatState } from '@pages/chat/models';

const initialState: ChatState = {
    conversation: null,
    messageResponsePageIndex: 0,
    messageResponsePageSize: 0,
    messageResponseCount: 0,
    messageResponseData: [],
    unreadCount: 0,
    isProfileDetailsDisplayed: false,
    isConversationParticipantsDisplayed: false,
    profileDetails: null,
    messageToReply: null,
    messageToEdit: null,
    userTyping: '',
};

// TODO deconstruct each newState
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
        messageResponseData: [
            ...state.messageResponseData,
            {
                id: newState.id,
                messageType: newState.messageType,
                sender: newState.sender,
                senderId: newState.senderId,
                conversationId: newState.conversationId,
                content: newState.content,
                parentId: newState.parentId,
                parentMessageId: newState.parentMessageId,
                parentMessageContent: newState.parentMessageContent,
                parentMessageSenderFullname:
                    newState.parentMessageSenderFullname,
                createdAt: newState.createdAt,
                updatedAt: newState.updatedAt,
                isEdited: newState.isEdited,
                files: newState.files,
                filesCount: newState.filesCount,
                media: newState.media,
                mediaCount: newState.mediaCount,
                links: newState.links,
                linksCount: newState.linksCount,
            },
        ],
    })),
    on(editMessage, (state, newState) => ({
        ...state,
        messageToEdit: {
            id: newState.id,
            messageType: newState.messageType,
            sender: newState.sender,
            senderId: newState.senderId,
            conversationId: newState.conversationId,
            content: newState.content,
            parentId: newState.parentId,
            parentMessageId: newState.parentMessageId,
            parentMessageContent: newState.parentMessageContent,
            parentMessageSenderFullname: newState.parentMessageSenderFullname,
            createdAt: newState.createdAt,
            updatedAt: newState.updatedAt,
            isEdited: newState.isEdited,
            files: newState.files,
            filesCount: newState.filesCount,
            media: newState.media,
            mediaCount: newState.mediaCount,
            links: newState.links,
            linksCount: newState.linksCount,
        },
    })),
    on(replyMessage, (state, newState) => ({
        ...state,
        messageToReply: {
            id: newState.id,
            messageType: newState.messageType,
            sender: newState.sender,
            senderId: newState.senderId,
            conversationId: newState.conversationId,
            content: newState.content,
            parentId: newState.parentId,
            parentMessageId: newState.parentMessageId,
            parentMessageContent: newState.parentMessageContent,
            parentMessageSenderFullname: newState.parentMessageSenderFullname,
            createdAt: newState.createdAt,
            updatedAt: newState.updatedAt,
            isEdited: newState.isEdited,
            files: newState.files,
            filesCount: newState.filesCount,
            media: newState.media,
            mediaCount: newState.mediaCount,
            links: newState.links,
            linksCount: newState.linksCount,
        },
    })),
    on(resetReplyAndEditMessage, (state) => ({
        ...state,
        messageToReply: null,
        messageToEdit: null,
    })),
    on(setConversation, (state, newState) => ({
        ...state,
        conversation: {
            ...state.conversation,
            ...newState,
        },
    })),
    on(displayProfileDetails, (state) => ({
        ...state,
        isProfileDetailsDisplayed: true,
        isConversationParticipantsDisplayed: false,
    })),

    on(displayConversationParticipants, (state) => ({
        ...state,
        isConversationParticipantsDisplayed: true,
        isProfileDetailsDisplayed: false,
    })),

    on(setProfileDetails, (state, newState) => ({
        ...state,
        profileDetails: {
            userAdditionalInformation: newState.userAdditionalInformation,
            files: newState.files,
            filesCount: newState.filesCount,
            media: newState.media,
            mediaCount: newState.mediaCount,
            links: newState.links,
            linksCount: newState.linksCount,
        },
    })),
    on(closeAllProfileInformation, (state) => ({
        ...state,
        isConversationParticipantsDisplayed: false,
        isProfileDetailsDisplayed: false,
        profileDetails: null,
    })),
    on(setUnreadCount, (state, newState) => ({
        ...state,
        unreadCount: newState.count,
    })),
    on(setUserTyping, (state, newState) => ({
        ...state,
        userTyping: newState.name,
    }))
);
