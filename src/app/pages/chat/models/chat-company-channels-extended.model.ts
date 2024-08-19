import { ConversationResponse } from "appcoretruckassist";

export interface ChatCompanyChannelExtended extends ConversationResponse {
    assetPath: string;
}