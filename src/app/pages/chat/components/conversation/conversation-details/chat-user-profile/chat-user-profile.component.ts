import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

// Store
import { Store } from '@ngrx/store';
import { closeAllProfileInformation } from '@pages/chat/store';

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
    selector: 'app-chat-user-profile',
    templateUrl: './chat-user-profile.component.html',
    styleUrls: ['./chat-user-profile.component.scss'],
})
export class ChatUserProfileComponent implements OnInit {
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
