import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

// Service
import { UserChatService } from '@pages/chat/services';

// Models
import { ChatCompanyChannelExtended } from '@pages/chat/models/chat-company-channels-extended.model';
import { ConversationResponse } from 'appcoretruckassist';

@Injectable({
    providedIn: 'root',
})
export class ChatCompanyChannelResolver {
    constructor(private userChatService: UserChatService) {}

    resolve(): Observable<ChatCompanyChannelExtended[]> {
        return this.userChatService.getCompanyChannels().pipe(
            map((channels: ConversationResponse[]) => {
                return channels.map((channel: ConversationResponse) => {
                    const remappedResponse: ChatCompanyChannelExtended = {
                        ...channel,
                        assetPath: `assets/svg/chat/${channel.name.toLowerCase()}-icon.svg`,
                    };
                    return remappedResponse;
                });
            })
        );
    }
}
