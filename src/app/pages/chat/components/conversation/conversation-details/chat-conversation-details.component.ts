import { Component, Input } from '@angular/core';

// Models
import { ConversationInfoResponse } from 'appcoretruckassist';
import { ChatSelectedConversation } from '@pages/chat/models';

// Enums
import {
    ChatActivityStatusEnum,
    ChatConversationProfileDetailsType,
    ChatSearchPlaceHolders,
    ChatUserProfileResourceTypeEnum,
    ConversationTypeEnum,
} from '@pages/chat/enums';

// Services
import { ChatStoreService } from '@pages/chat/services';

// Assets routes
import { ChatSvgRoutes } from '@pages/chat/utils/routes';

@Component({
    selector: 'app-chat-conversation-details',
    templateUrl: './chat-conversation-details.component.html',
    styleUrls: ['./chat-conversation-details.component.scss'],
})
export class ChatConversationDetailsComponent {
    @Input() conversation!: ChatSelectedConversation;
    @Input() data: ConversationInfoResponse;
    @Input() profileDetailsType!: ChatConversationProfileDetailsType;

    // TODO connect to hub, replace dummy value
    public activityStatus: string = ChatActivityStatusEnum.OFFLINE;

    // Assets route
    public chatSvgRoutes = ChatSvgRoutes;

    // Enums
    public chatSearchPlaceHolders = ChatSearchPlaceHolders;
    public chatConversationProfileDetailsType =
        ChatConversationProfileDetailsType;
    public conversationTypeEnum = ConversationTypeEnum;

    // Attachment and links status
    public ChatUserProfileResourceTypeEnum = ChatUserProfileResourceTypeEnum;

    constructor(private chatStoreService: ChatStoreService) {}

    ngOnInit(): void {
        console.log(this.conversation);
    }

    public closeProfileDetails(): void {
        this.chatStoreService.closeAllProfileInformation();
    }
}
