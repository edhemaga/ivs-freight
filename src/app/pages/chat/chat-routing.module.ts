import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

//Components
import { ChatComponent } from "@pages/chat/components/chat/chat.component";
import { ChatMessagesComponent } from "@pages/chat/components/conversation/conversation-content/chat-messages/chat-messages.component";

//Resolvers
import { ChatCompanyUserResolver } from "@pages/chat/resolvers/conversation-list/user/chat-company-user.resolver";
import { ChatDriverResolver } from "@pages/chat/resolvers/conversation-list/driver/chat-driver.resolver";
import { ChatCompanyChannelResolver } from "@pages/chat/resolvers/conversation-list/company-channel/chat-company-channel.resolver";
import { ChatConversationResolver } from "@pages/chat/resolvers/conversation/chat-conversation.resolver";
import { ChatConversationInformationResolver } from "@pages/chat/resolvers/conversation-details/chat-conversation-information.resolver";

const routes: Routes = [
    {
        path: '',
        component: ChatComponent,
        resolve: {
            users: ChatCompanyUserResolver,
            drivers: ChatDriverResolver,
            companyChannels: ChatCompanyChannelResolver
        },
        data: {
            title: 'Chat'
        },
        children: [
            {
                path: 'conversation/:conversationId',
                component: ChatMessagesComponent,
                resolve: {
                    information: ChatConversationInformationResolver,
                    messages: ChatConversationResolver
                },
                data: {
                    title: 'Conversation'
                },
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChatRoutingModule { }