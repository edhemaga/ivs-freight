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

// Services
import { UserChatService } from "@pages/chat/services/chat.service";

// Resolvers
import { UserResolver } from "@pages/chat/resolvers/user.resolver";
import { DriverResolver } from "@pages/chat/resolvers/driver.resolver";

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
    ],
    imports: [
        CommonModule,
        ChatRoutingModule,
        AngularSvgIconModule
    ],
    providers: [
        // Resolvers
        UserResolver,
        DriverResolver,

        // Services
        UserChatService
    ]
})
export class ChatModule { };