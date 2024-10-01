import { ChatMessageActionEnum } from '@pages/chat/enums';
import { ChatMessage } from '..';

export interface ChatConversationMessageAction {
    message: ChatMessage;
    type: ChatMessageActionEnum;
}
