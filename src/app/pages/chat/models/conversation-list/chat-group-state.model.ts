// Enums
import {
    ChatGroupEnum,
    ChatGroupStateEnum
} from '@pages/chat/enums';

export interface ChatGroupState<T> {
    id: ChatGroupEnum,
    state: ChatGroupStateEnum,
    groupData?: T,
    hasNewMessage?: boolean
}