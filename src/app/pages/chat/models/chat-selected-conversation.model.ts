import { ConversationTypeEnum, ChatGroupEnum } from '@pages/chat/enums';

export interface ChatSelectedConversation {
    id: number[];
    type: ConversationTypeEnum;
    group: ChatGroupEnum;
}
