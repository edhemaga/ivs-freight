import { createSelector, createFeatureSelector } from '@ngrx/store';

// Models
import {
    ChatMessage,
    ChatMessageResponse,
    ChatSelectedConversation,
    ChatState,
} from '@pages/chat/models';
import { ConversationInfoResponse } from 'appcoretruckassist';

export const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectMessageResponse = createSelector(
    selectChatState,
    (state: ChatState): ChatMessageResponse => ({
        pageIndex: state.messageResponsePageIndex,
        pageSize: state.messageResponsePageSize,
        count: state.messageResponseCount,
        data: state.messageResponseData,
    })
);

export const selectReplyMessage = createSelector(
    selectChatState,
    (state: ChatState): ChatMessage => state.messageToReply
);

export const selectEditMessage = createSelector(
    selectChatState,
    (state: ChatState): ChatMessage => state.messageToEdit
);

export const activeReplyOrEdit = createSelector(
    selectChatState,
    (state: ChatState): number =>
        state.messageToReply?.id || state.messageToEdit?.id
);

export const getSelectedConversation = createSelector(
    selectChatState,
    (state: ChatState): ChatSelectedConversation => state.conversation
);

export const getIsProfileDetailsDisplayed = createSelector(
    selectChatState,
    (state: ChatState): boolean => state.isProfileDetailsDisplayed
);

export const getIsConversationParticipantsDisplayed = createSelector(
    selectChatState,
    (state: ChatState): boolean => state.isConversationParticipantsDisplayed
);

export const getConversationProfileDetails = createSelector(
    selectChatState,
    (state: ChatState): ConversationInfoResponse => state.profileDetails
);

export const getUnreadCount = createSelector(
    selectChatState,
    (state: ChatState): number => state.unreadCount
);

export const isAttachmentUploadActive = createSelector(
    selectChatState,
    (state: ChatState): boolean => state.isAttachmentUploadActive
);
