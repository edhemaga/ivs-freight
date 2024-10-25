import {
    FileResponse,
    UserAdditionalInformationResponse,
} from 'appcoretruckassist';

export interface ChatConversationDetails {
    userAdditionalInformation?: UserAdditionalInformationResponse[];
    files?: FileResponse[];
    filesCount?: number;
    media?: FileResponse[];
    mediaCount?: number;
    links?: FileResponse[];
    linksCount?: number;
}
