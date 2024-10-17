import { Component, Input, OnInit } from '@angular/core';

// Models
import { ConversationInfoResponse } from 'appcoretruckassist';

// Assets routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

// Enums
import {
    ChatConversationProfileDetailsType,
    ChatSearchPlaceHolders,
    ChatUserProfileResourceTypeEnum,
} from '@pages/chat/enums';
import { ChatStoreService } from '@pages/chat/services';

@Component({
    selector: 'app-chat-conversation-details',
    templateUrl: './chat-conversation-details.component.html',
    styleUrls: ['./chat-conversation-details.component.scss'],
})
export class ChatConversationDetailsComponent {
    @Input() data: ConversationInfoResponse;
    @Input() profileDetailsType!: ChatConversationProfileDetailsType;

    // TODO connect to hub, replace dummy value
    public activityStatus: string = 'Offline';

    // Assets route
    public chatSvgRoutes = ChatSvgRoutes;

    // Enums
    public chatSearchPlaceHolders = ChatSearchPlaceHolders;
    public chatConversationProfileDetailsType =
        ChatConversationProfileDetailsType;

    // Attachment and links status
    public ChatUserProfileResourceTypeEnum = ChatUserProfileResourceTypeEnum;

    constructor(private chatStoreService: ChatStoreService) {}

    ngOnInit(): void {}

    public closeProfileDetails(): void {
        this.chatStoreService.closeAllProfileInformation();
    }
}
