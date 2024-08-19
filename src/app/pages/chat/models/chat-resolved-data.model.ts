import { CompanyUserChatResponsePaginationReduced } from "@pages/chat/models/company-user-chat-response.model";
import { ChatCompanyChannelExtended } from "@pages/chat/models/chat-company-channels-extended.model";

export interface ChatResolvedData {
    title: string;
    drivers: CompanyUserChatResponsePaginationReduced;
    users: CompanyUserChatResponsePaginationReduced;
    companyChannels: ChatCompanyChannelExtended[];
}