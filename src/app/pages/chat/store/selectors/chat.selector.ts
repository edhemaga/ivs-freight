import { createSelector, createFeatureSelector } from '@ngrx/store';
import { ChatViewTypeEnum } from '@pages/chat/enums';

// Models
import {
    ChatCompanyChannelExtended,
    ChatConversationDetails,
    ChatMessage,
    ChatMessageResponse,
    ChatSelectedConversation,
    ChatState,
} from '@pages/chat/models';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';
import { ConversationInfoResponse } from 'appcoretruckassist';

export const selectChatState = createFeatureSelector<ChatState>('chat');

export const selectMessageResponse = createSelector(
    selectChatState,
    (state: ChatState): ChatMessageResponse => ({
        pageIndex: state.messageResponsePageIndex,
        pageSize: state.messageResponsePageSize,
        count: state.messageResponseCount,
        data: state.messageResponseData.filter(
            (message: ChatMessage) => message.id !== 0
        ),
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

export const getAllDepartments = createSelector(
    selectChatState,
    (state: ChatState): ChatCompanyChannelExtended[] => state.departments
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
    (state: ChatState): ChatConversationDetails => state.profileDetails
);

export const getUnreadCount = createSelector(
    selectChatState,
    (state: ChatState): number => state.unreadCount
);

export const getUserTyping = createSelector(
    selectChatState,
    (state: ChatState): string => state.userTyping
);

export const selectAttachmentUploadStatus = createSelector(
    selectChatState,
    (state: ChatState): boolean => state.isAttachmentUploadActive
);

export const selectAttachments = createSelector(
    selectChatState,
    (state: ChatState): UploadFile[] => state.attachments
);

export const selectViewType = createSelector(
    selectChatState,
    (state: ChatState): string => state.viewType
);
