import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

//Components
import { ChatComponent } from "@pages/chat/components/chat/chat.component";
import { ChatMessagesComponent } from "@pages/chat/components/chat-messages/chat-messages.component";

//Resolvers
import { UserResolver } from "@pages/chat/resolvers/user.resolver";
import { DriverResolver } from "@pages/chat/resolvers/driver.resolver";
import { ConversationResolver } from "@pages/chat/resolvers/conversation.resolver";

//Services

const routes: Routes = [
    {
        path: '',
        component: ChatComponent,
        resolve: {
            users: UserResolver,
            drivers: DriverResolver
        },
        children: [
            {
                path: 'conversation/:conversationId',
                component: ChatMessagesComponent,
                resolve: {
                    messages: ConversationResolver
                }
            }
        ]

    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChatRoutingModule { }