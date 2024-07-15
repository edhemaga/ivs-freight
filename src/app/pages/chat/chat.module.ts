import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

// Modules
import { CommonModule } from "@angular/common";
import { ChatRoutingModule } from "@pages/chat/chat-routing.module";
import { AngularSvgIconModule } from "angular-svg-icon";
import { SharedModule } from '@shared/shared.module';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Components
import { ChatComponent } from "@pages/chat/components/chat/chat.component";
import { ChatUserListComponent } from "@pages/chat/components/user/chat-user-list/chat-user-list.component";
import { ChatUserListItemComponent } from "@pages/chat/components/user/chat-user-list-item/chat-user-list-item.component";
import { ChatMessageComponent } from "@pages/chat/components/conversation/chat-message/chat-message.component";
import { ChatMessagesComponent } from "@pages/chat/components/conversation/chat-messages/chat-messages.component";
import { MessagesNotSelectedComponent } from "@pages/chat/components/conversation/messages-not-selected/messages-not-selected.component";
import { ChatToolbarComponent } from "@pages/chat/components/chat-toolbar/chat-toolbar.component";
import { ChatNoDataComponent } from "@pages/chat/components/chat-no-data/chat-no-data.component";
import { UserStatusBadgeComponent } from "@pages/chat/components/user-status-badge/user-status-badge.component";

//Shared components
import { TaProfileImagesComponent } from "@shared/components/ta-profile-images/ta-profile-images.component";
import { TaInputComponent } from "@shared/components/ta-input/ta-input.component";
import { TaAppTooltipV2Component } from "@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component";

// Services
import { UserChatService } from "@pages/chat/services/chat.service";
import { HubService } from "@pages/chat/services/hub.service";

// Resolvers
import { UserResolver } from "@pages/chat/resolvers/user/user.resolver";
import { DriverResolver } from "@pages/chat/resolvers/driver/driver.resolver";
import { ConversationInformationResolver } from "@pages/chat/resolvers/conversation/conversation-information.resolver";
import { ConversationResolver } from "@pages/chat/resolvers/conversation/conversation.resolver";

// Pipes
import { NameInitialsPipe } from "@shared/pipes/name-initials.pipe";
import { FormatTimePipe } from "@shared/pipes/format-time.pipe";

@NgModule({
    declarations: [
        ChatComponent,

        // CHAT LIST
        ChatUserListComponent,
        ChatUserListItemComponent,

        // CONVERSATIONS
        ChatMessagesComponent,
        ChatMessageComponent,
        MessagesNotSelectedComponent,

        // AUXILLARY COMPONENTS
        ChatToolbarComponent,
        ChatNoDataComponent,
        UserStatusBadgeComponent
    ],
    imports: [
        // Modules
        CommonModule,
        ChatRoutingModule,
        AngularSvgIconModule,
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        NgbModule,

        // Pipes
        NameInitialsPipe,
        FormatTimePipe,

        // Shared Components
        TaProfileImagesComponent,
        TaInputComponent,
        TaAppTooltipV2Component
    ],
    providers: [
        // Services
        UserChatService,
        HubService,

        // Resolvers
        UserResolver,
        DriverResolver,
        ConversationInformationResolver,
        ConversationResolver,

        // Pipes
        NameInitialsPipe
    ]
})
export class ChatModule { };