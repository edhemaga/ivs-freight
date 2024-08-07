import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

//Components
import { ChatComponent } from "@pages/chat/components/chat/chat.component";
import { ChatMessagesComponent } from "@pages/chat/components/conversation/chat-messages/chat-messages.component";

//Resolvers
import { UserResolver } from "@pages/chat/resolvers/user/user.resolver";
import { DriverResolver } from "@pages/chat/resolvers/driver/driver.resolver";
import { ConversationResolver } from "@pages/chat/resolvers/conversation/conversation.resolver";
import { ConversationInformationResolver } from "@pages/chat/resolvers/conversation/conversation-information.resolver";
import { CompanyChannelResolver } from '@pages/chat/resolvers/company-channel/company-channel.resolvers';

const routes: Routes = [
    {
        path: '',
        component: ChatComponent,
        resolve: {
            users: UserResolver,
            drivers: DriverResolver,
            companyChannels: CompanyChannelResolver
        },
        data: {
            title: 'Chat'
        },
        children: [
            {
                path: 'conversation/:conversationId',
                component: ChatMessagesComponent,
                resolve: {
                    information: ConversationInformationResolver,
                    messages: ConversationResolver
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