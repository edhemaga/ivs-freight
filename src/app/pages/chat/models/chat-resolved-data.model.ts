// Models
import {
    CompanyUserChatResponsePaginationReduced,
    ChatCompanyChannelExtended
} from "@pages/chat/models";


export interface ChatResolvedData {
    title: string;
    drivers: CompanyUserChatResponsePaginationReduced;
    users: CompanyUserChatResponsePaginationReduced;
    departments: ChatCompanyChannelExtended[];
    companyChannels: ChatCompanyChannelExtended[];
}