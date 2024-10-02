import { ConversationTypeEnum, ChatGroupEnum } from '@pages/chat/enums';
import { ConversationResponse } from 'appcoretruckassist';

export interface ChatSelectedConversation extends ConversationResponse {
    conversationType?: ConversationTypeEnum;
    group?: ChatGroupEnum;
}
