import { ConversationTypeEnum, ChatGroupEnum } from '@pages/chat/enums';
import { ConversationResponse } from 'appcoretruckassist';

export interface ChatSelectedConversation extends ConversationResponse {
    group?: ChatGroupEnum;
    hasLeft?: boolean;
}
