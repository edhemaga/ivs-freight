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
    setAttachmentUploadActiveStatus,
    setAttachment,
    deleteAttachment,
    deleteAllAttachment
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
    attachments: null,
    isAttachmentUploadActive: false,
    isProfileDetailsDisplayed: false,
    isConversationParticipantsDisplayed: false,
    profileDetails: null,
    messageToReply: null,
    messageToEdit: null,
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
    on(displayProfileDetails, (state, newState) => ({
        ...state,
        isProfileDetailsDisplayed: newState.isDisplayed,
        isConversationParticipantsDisplayed: false,
    })),
    on(displayConversationParticipants, (state, newState) => ({
        ...state,
        isConversationParticipantsDisplayed: newState.isDisplayed,
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
    on(setAttachmentUploadActiveStatus, (state, newState) => ({
        ...state,
        isAttachmentUploadActive: newState.isDisplayed,
    })),
    on(setAttachment, (state, newState) => ({
        ...state,
        attachments: [
            ...state.attachments,
            {
                fileId: newState.fileId,
                name: newState.name,
                fileName: newState.fileName,
                url: newState.url,
                extension: newState.extension,
                guid: newState.guid,
                size: newState.size,
                fileSize: newState.fileSize,
                tags: newState.tags,
                realFile: newState.realFile,
                tagId: newState.tagId,
                incorrect: newState.incorrect,
                tagChanged: newState.tagChanged,
                savedTag: newState.savedTag,
                tagGeneratedByUser: newState.tagGeneratedByUser,
                lastHovered: newState.lastHovered,
            },
        ],
    })),
    on(deleteAttachment, (state, newState) => ({
        ...state,
        attachments: [
            ...state.attachments,
            ...state.attachments.filter(
                (attachment) => attachment.fileId !== newState.fileId
            ),
        ],
    })),
    on(deleteAllAttachment, (state) => ({
        ...state,
        attachments: null
    }))
);
