// Models
import {
    ChatGroupState,
    ChatCompanyChannelExtended
} from "@pages/chat/models";
import { CompanyUserChatResponsePagination } from "appcoretruckassist";

// Enums
import {
    ChatGroupEnum,
    ChatGroupStateEnum
} from "@pages/chat/enums";

export class ChatConversationGroupStateConstant {
    static groupsState: ChatGroupState<ChatCompanyChannelExtended[] | CompanyUserChatResponsePagination>[] = [
        {
            id: ChatGroupEnum.Department,
            state: ChatGroupStateEnum.Expanded,
            hasNewMessage: false,
        }, {
            id: ChatGroupEnum.Truck,
            state: ChatGroupStateEnum.Expanded,
            hasNewMessage: false,
        },
        {
            id: ChatGroupEnum.Dispatch,
            state: ChatGroupStateEnum.Expanded,
            hasNewMessage: false,
        }, {
            id: ChatGroupEnum.CompanyUser,
            state: ChatGroupStateEnum.Expanded,
            hasNewMessage: false,
        }, {
            id: ChatGroupEnum.Driver,
            state: ChatGroupStateEnum.Expanded,
            hasNewMessage: false,
        }
    ];


}