import { createAction, props } from '@ngrx/store';

// Models
import { ChatMessage, ChatMessageResponse } from '@pages/chat/models';

export const setMessageResponse = createAction(
    '[Chat] Set Message Response',
    props<ChatMessageResponse>()
);

export const deleteMessage = createAction(
    '[Chat] Delete Message',
    props<ChatMessage>()
);

export const addMessage = createAction(
    '[Chat] Add Message',
    props<ChatMessage>()
);

export const editMessage = createAction(
    '[Chat] Edit Message',
    props<ChatMessage | null>()
);

export const replyMessage = createAction(
    '[Chat] Reply Message',
    props<ChatMessage | null>()
);

export const resetReplyAndEditMessage = createAction(
    '[Chat] Clear Reply and Edit'
);
