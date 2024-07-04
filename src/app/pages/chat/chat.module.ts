import { NgModule } from "@angular/core";

// Modules
import { CommonModule } from "@angular/common";
import { ChatRoutingModule } from "./chat-routing.module";
import { AngularSvgIconModule } from "angular-svg-icon";

// Components
import { ChatMessageComponent } from "@pages/chat/components/chat-message/chat-message.component";
import { ChatMessagesComponent } from "@pages/chat/components/chat-messages/chat-messages.component";
import { ChatUserListComponent } from "@pages/chat/components/chat-user-list/chat-user-list.component";
import { ChatComponent } from "@pages/chat/components/chat/chat.component";

// Services
import { ChatService } from "@pages/chat/services/chat.service";

// Resolvers
import { UserResolver } from "@pages/chat/resolvers/user.resolver";
import { ChatNoDataComponent } from "@pages/chat/components/shared/chat-no-data/chat-no-data.component";

@NgModule({
    declarations: [
        ChatComponent,
        ChatUserListComponent,
        ChatMessagesComponent,
        ChatMessageComponent,

        // Shared
        ChatNoDataComponent
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
        ChatService
    ]
})
export class ChatModule { };