import { createAction, props } from '@ngrx/store';
import { ChatViewTypeEnum } from '@pages/chat/enums';

// Models
import {
    ChatCompanyChannelExtended,
    ChatConversationDetails,
    ChatMessage,
    ChatMessageResponse,
    ChatSelectedConversation,
} from '@pages/chat/models';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';
import { EnumValue } from 'appcoretruckassist';

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

export const setConversationNameAndType = createAction(
    '[Chat] Set Conversation Name And Type',
    props<{ name: string; conversationType: EnumValue }>()
);

export const displayProfileDetails = createAction(
    '[Chat] Display Profile Details'
);

export const setProfileDetails = createAction(
    '[Chat] Get Profile Details',
    props<ChatConversationDetails>()
);

export const displayConversationParticipants = createAction(
    '[Chat] Display Conversation Participants'
);
export const closeAllProfileInformation = createAction(
    '[Chat] Close All Profile Information'
);

export const setUnreadCount = createAction(
    '[Chat] Set Unread Count',
    props<{ count: number }>()
);

export const setUserTyping = createAction(
    '[Chat] Set User Typing',
    props<{ name: string }>()
);

export const setDepartment = createAction(
    '[Chat] Set Departments',
    props<ChatCompanyChannelExtended>()
);

export const openAttachmentUpload = createAction(
    '[Chat] Open Attachment Upload '
);

export const closeAttachmentUpload = createAction(
    '[Chat] Close Attachment Upload'
);

export const setAttachment = createAction(
    '[Chat] Upload Attachment',
    props<UploadFile>()
);

export const deleteAttachment = createAction(
    '[Chat] Delete Attachment',
    props<UploadFile>()
);

export const deleteAllAttachments = createAction(
    '[Chat] Delete All Attachments'
);

export const setViewType = createAction(
    '[Chat] Set View Type',
    props<{ viewType: ChatViewTypeEnum }>()
);

export const setFavoriteCount = createAction(
    '[Chat] Set Favorite Count',
    props<{ count: number }>()
);
