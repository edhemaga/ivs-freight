import { NgModule } from "@angular/core";

// Modules
import { CommonModule } from "@angular/common";
import { ChatRoutingModule } from "./chat-routing.module";
import { AngularSvgIconModule } from "angular-svg-icon";

// Components
import { ChatComponent } from "@pages/chat/components/chat/chat.component";
import { ChatMessageComponent } from "@pages/chat/components/chat-message/chat-message.component";
import { ChatMessagesComponent } from "@pages/chat/components/chat-messages/chat-messages.component";
import { ChatUserListComponent } from "@pages/chat/components/chat-user-list/chat-user-list.component";
import { ChatNoDataComponent } from "@pages/chat/components/chat-no-data/chat-no-data.component";
import { ChatToolbarComponent } from "@pages/chat/components/chat-toolbar/chat-toolbar.component";

// Services
import { UserChatService } from "@pages/chat/services/chat.service";

// Resolvers
import { UserResolver } from "@pages/chat/resolvers/user.resolver";

@NgModule({
    declarations: [
        ChatComponent,
        ChatUserListComponent,
        ChatMessagesComponent,
        ChatMessageComponent,
        ChatNoDataComponent,
        ChatToolbarComponent
    ],
    imports: [
        CommonModule,
        ChatRoutingModule,
        AngularSvgIconModule
    ],
    providers: [
        // Resolvers
        UserResolver,

        // Services
        UserChatService
    ]
})
export class ChatModule { };