import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

//Components
import { ChatComponent } from '@pages/chat/components/chat/chat.component';
import { ConversationContentComponent } from '@pages/chat/components/conversation/conversation-content/conversation-content.component';

//Resolvers
import {
    ChatCompanyUserResolver,
    ChatDriverResolver,
    ChatCompanyChannelResolver,
    ChatConversationResolver,
    ChatConversationInformationResolver,
} from './resolvers';

const routes: Routes = [
    {
        path: '',
        component: ChatComponent,
        resolve: {
            departments: ChatCompanyChannelResolver,
            users: ChatCompanyUserResolver,
            drivers: ChatDriverResolver,
        },
        data: {
            title: 'Chat',
        },
        children: [
            {
                path: 'conversation/:conversationId',
                component: ConversationContentComponent,
                resolve: {
                    information: ChatConversationInformationResolver,
                    messages: ChatConversationResolver,
                },
                data: {
                    title: 'Conversation',
                },
            },
        ],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ChatRoutingModule {}
