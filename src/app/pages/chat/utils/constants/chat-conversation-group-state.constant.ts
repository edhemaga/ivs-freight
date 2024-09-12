// Models
import { ChatCompanyChannelExtended } from "@pages/chat/models/chat-company-channels-extended.model";
import { ChatGroupState } from "@pages/chat/models/conversation-list/chat-group-state.model";
import { CompanyUserChatResponsePagination } from "appcoretruckassist";

// Enums
import { ChatGroupEnum } from "@pages/chat/enums/conversation/conversation-list/chat-group.enum";
import { ChatGroupStateEnum } from "@pages/chat/enums/conversation/conversation-list/chat-group-state.enum";

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