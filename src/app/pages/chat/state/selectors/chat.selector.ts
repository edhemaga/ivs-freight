import { createSelector, createFeatureSelector } from '@ngrx/store';

// Models
import { ChatState } from '..';
import { ChatMessage, ChatMessageResponse } from '@pages/chat/models';

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
    (state: ChatState): number => state.messageToReply?.id || state.messageToEdit?.id
)
