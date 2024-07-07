import { NgModule } from "@angular/core";

// Modules
import { CommonModule } from "@angular/common";
import { ChatRoutingModule } from "./chat-routing.module";
import { AngularSvgIconModule } from "angular-svg-icon";

// Components
import { ChatComponent } from "@pages/chat/components/chat/chat.component";
import { ChatUserListComponent } from "@pages/chat/components/chat-user-list/chat-user-list.component";
import { ChatUserListItemComponent } from "@pages/chat/components/chat-user-list-item/chat-user-list-item.component";
import { ChatMessageComponent } from "@pages/chat/components/chat-message/chat-message.component";
import { ChatMessagesComponent } from "@pages/chat/components/chat-messages/chat-messages.component";
import { ChatToolbarComponent } from "@pages/chat/components/chat-toolbar/chat-toolbar.component";
import { ChatNoDataComponent } from "@pages/chat/components/chat-no-data/chat-no-data.component";
import { TaProfileImagesComponent } from "@shared/components/ta-profile-images/ta-profile-images.component";
import { UserStatusBadgeComponent } from "@pages/chat/components/user-status-badge/user-status-badge.component";

// Services
import { UserChatService } from "@pages/chat/services/chat.service";

// Resolvers
import { UserResolver } from "@pages/chat/resolvers/user.resolver";
import { DriverResolver } from "@pages/chat/resolvers/driver.resolver";

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

        // Pipes
        NameInitialsPipe,
        FormatTimePipe,

        // Components
        TaProfileImagesComponent
    ],
    providers: [
        // Resolvers
        UserResolver,
        DriverResolver,

        // Services
        UserChatService,

        // Pipes
        NameInitialsPipe
    ]
})
export class ChatModule { };