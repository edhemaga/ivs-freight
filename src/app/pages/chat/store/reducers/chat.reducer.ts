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
    openAttachmentUpload,
    closeAttachmentUpload,
    setAttachment,
    deleteAttachment,
    deleteAllAttachments,
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
    attachments: [],
    isAttachmentUploadActive: false,
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
        messageResponseData: state.messageResponseData.map((message) => {
            if (message.id !== newState.id) return message;
            return {
                id: message.id,
                messageType: null,
                sender: message.sender,
                senderId: message.senderId,
                conversationId: message.conversationId,
                content: null,
                parentId: null,
                parentMessageId: null,
                parentMessageContent: null,
                parentMessageSenderFullname: null,
                createdAt: null,
                updatedAt: null,
                isDeleted: true,
                isEdited: message.isEdited,
                files: null,
                filesCount: null,
                media: null,
                mediaCount: null,
                links: null,
                linksCount: null,
            };
        }),
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
    on(openAttachmentUpload, (state) => ({
        ...state,
        isAttachmentUploadActive: true,
    })),
    on(closeAttachmentUpload, (state) => ({
        ...state,
        isAttachmentUploadActive: false,
    })),
    on(setAttachment, (state, newState) => ({
        ...state,
        attachments: [
            ...state.attachments,
            {
                fileId: state.attachments?.length + 1 ?? 0,
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
            ...state.attachments?.filter(
                (attachment) => attachment?.fileId !== newState?.fileId
            ),
        ],
    })),
    on(deleteAllAttachments, (state) => ({
        ...state,
        attachments: [],
    })),
    on(setUserTyping, (state, newState) => ({
        ...state,
        userTyping: newState.name,
    }))
);
