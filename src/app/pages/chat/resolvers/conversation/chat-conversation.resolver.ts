import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';

// Models
import {
    ChatMessagePaginationResponse,
    ChatMessageResponse,
} from '@pages/chat/models';
import { ChatMessage } from '@pages/chat/models';

// Service
import { UserChatService } from '@pages/chat/services';

// Helpers
import { chatMessageSenderFullname } from '@pages/chat/utils/helpers';

@Injectable({
    providedIn: 'root',
})
export class ChatConversationResolver {
    constructor(private userChatService: UserChatService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ChatMessageResponse> {
        const conversationId: number = route.params['conversationId'] ?? 0;
        if (conversationId === 0) return;

        return this.userChatService.getMessages(conversationId).pipe(
            map((res: ChatMessagePaginationResponse) => {
                const messages = res?.pagination?.data.map(
                    (message: ChatMessage) => {
                        message.isReceivedFromHub = false;
                        return chatMessageSenderFullname(
                            res?.pagination?.data,
                            message
                        );
                    }
                );
                const modifiedResponse: ChatMessageResponse = {
                    ...res.pagination,
                    data: messages,
                };
                return modifiedResponse;
            })
        );
    }
}
