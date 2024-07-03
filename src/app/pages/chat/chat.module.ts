import { NgModule } from "@angular/core";
import { ChatRoutingModule } from "./chat-routing.module";

// Components
import { ChatMessageComponent } from "./components/chat-message/chat-message.component";
import { ChatMessagesComponent } from "./components/chat-messages/chat-messages.component";
import { ChatUserListComponent } from "./components/chat-user-list/chat-user-list.component";
import { ChatComponent } from "./components/chat/chat.component";

// Services
import { ChatService } from "./services/chat.service";

// Resolvers
import { UserResolver } from "./resolvers/user.resolver";
import { CommonModule } from "@angular/common";
import { AngularSvgIconModule } from "angular-svg-icon";
import { ChatNoDataComponent } from "./components/shared/chat-no-data/chat-no-data.component";

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