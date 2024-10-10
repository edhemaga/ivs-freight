import { ReactiveFormsModule } from '@angular/forms';

// Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ChatRoutingModule } from '@pages/chat/chat-routing.module';
import { StoreModule } from '@ngrx/store';

// Components
import { ChatComponent } from '@pages/chat/components/chat/chat.component';
import { ConversationContentComponent } from '@pages/chat/components/conversation/conversation-content/conversation-content.component';
import { ConversationListComponent } from '@pages/chat/components/conversation/conversation-list/conversation-list.component';
import { ChatMessageComponent } from '@pages/chat/components/conversation/conversation-content/chat-message/chat-message.component';
import { ChatMessagesComponent } from '@pages/chat/components/conversation/conversation-content/chat-messages/chat-messages.component';
import { ChatContentFooterComponent } from '@pages/chat/components/conversation/conversation-content/chat-content-footer/chat-content-footer.component';
import { ChatMessageAttachmentPreviewComponent } from '@pages/chat/components/shared/chat-message-attachment-preview/chat-message-attachment-preview.component';
import { ChatUserProfileComponent } from '@pages/chat/components/conversation/conversation-details/chat-user-profile/chat-user-profile.component';
import { ChatHeaderComponent } from '@pages/chat/components/shared/chat-header/chat-header.component';
import { ChatListComponent } from '@pages/chat/components/shared/chat-list/chat-list.component';
import { ChatListItemComponent } from '@pages/chat/components/shared/chat-list/chat-list-item/chat-list-item.component';
import { ChatVerticalDividerComponent } from '@pages/chat/components/shared/chat-vertical-divider/chat-vertical-divider.component';

// Conversation details
import { ChatProfileResourcesComponent } from '@pages/chat/components/conversation/conversation-details/chat-user-profile/chat-profile-resources/chat-profile-resources.component';
import { ChatChannelParticipantListComponent } from '@pages/chat/components/conversation/conversation-details/chat-channel-participant-list/chat-channel-participant-list.component';

//Shared components
import { TaProfileImagesComponent } from '@shared/components/ta-profile-images/ta-profile-images.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaSearchV2Component } from '@shared/components/ta-search-v2/ta-search-v2.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaSearchComponent } from '@shared/components/ta-search/ta-search.component';
import { CaProfileImageComponent } from 'ca-components';

// Store
import { chatDataReducer } from '@pages/chat/store';

// Pipes
import {
    NameInitialsPipe,
    FormatTimePipe,
    FormatDatePipe,
    FormatPhonePipe,
    FileExtensionPipe,
    TrackByPropertyPipe,
} from '@shared/pipes';
import {
    ChatDatePipe,
    ChatHeaderClassPipe,
    ChatHeaderGroupIconPipe,
    ChatMessageClassPipe,
    ChatAnyExist,
    ChatRemoveFullnamePipe,
    ChatDepartmentIconPipe,
} from '@pages/chat/utils/pipes';

// Directives
import {
    DragAndDropDirective,
    HoverDirective,
    ToggleBackgroundDirective,
} from '@pages/chat/utils/directives';
import { HoverSvgDirective } from '@shared/directives/hover-svg.directive';

@NgModule({
    declarations: [
        ChatComponent,

        // Chat list
        ConversationListComponent,

        // Conversation
        ConversationContentComponent,
        ChatMessagesComponent,
        ChatContentFooterComponent,
        ChatMessageComponent,
        ChatMessageAttachmentPreviewComponent,

        // Conversation details
        ChatUserProfileComponent,
        ChatChannelParticipantListComponent,

        // Auxillary components
        ChatHeaderComponent,
        ChatListComponent,
        ChatListItemComponent,
        ChatVerticalDividerComponent,
        ChatProfileResourcesComponent,

        // Directives
        DragAndDropDirective,
        HoverDirective,
        ToggleBackgroundDirective,

        // Pipes
        ChatHeaderClassPipe,
        ChatHeaderGroupIconPipe,
        ChatMessageClassPipe,
        ChatDatePipe,
        ChatAnyExist,
        ChatRemoveFullnamePipe,
        ChatDepartmentIconPipe,
    ],
    providers: [
        // Pipes
        NameInitialsPipe,
    ],
    imports: [
        // Modules
        CommonModule,
        ChatRoutingModule,
        AngularSvgIconModule,
        ReactiveFormsModule,
        NgbModule,

        // Shared Components
        TaInputComponent,
        TaSearchComponent,
        TaSearchV2Component,
        TaProfileImagesComponent,
        TaAppTooltipV2Component,
        TaUploadFilesComponent,
        CaProfileImageComponent,

        // Pipes
        NameInitialsPipe,
        FormatTimePipe,
        FormatDatePipe,
        FileExtensionPipe,
        TrackByPropertyPipe,
        FormatPhonePipe,

        // Directives
        HoverSvgDirective,

        // Store
        StoreModule.forFeature('chat', chatDataReducer),
    ],
})
export class ChatModule {}
