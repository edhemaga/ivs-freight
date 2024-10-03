import { createAction, props } from '@ngrx/store';

// Models
import {
    ChatMessage,
    ChatMessageResponse,
    ChatSelectedConversation,
} from '@pages/chat/models';
import { ConversationInfoResponse } from 'appcoretruckassist';

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

export const setConversation = createAction(
    '[Chat] Select Conversation',
    props<ChatSelectedConversation>()
);

export const displayProfileDetails = createAction(
    '[Chat] Display Profile',
    props<{ isDisplayed: boolean }>()
);

export const setProfileDetails = createAction(
    '[Chat] Get Profile Details',
    props<ConversationInfoResponse>()
);

export const displayConversationParticipants = createAction(
    '[Chat] Display Conversation Participants',
    props<{ isDisplayed: boolean }>()
);

export const closeAllProfileInformation = createAction(
    '[Chat] Close All Profile Information'
);

export const setUnreadCount = createAction(
    '[Chat] Set Unread Count',
    props<{ count: number }>()
);
