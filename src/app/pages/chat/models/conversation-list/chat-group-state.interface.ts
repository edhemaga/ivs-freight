// Enums
import { ChatGroupStateEnum } from "@pages/chat/enums/conversation/conversation-list/chat-group-state.enum";
import { ChatGroupEnum } from "@pages/chat/enums/conversation/conversation-list/chat-group.enum";

export interface ChatGroupStateInterface<T> {
    id: ChatGroupEnum,
    state: ChatGroupStateEnum,
    groupData?: T
}