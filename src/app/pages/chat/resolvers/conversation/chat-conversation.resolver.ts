import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot } from '@angular/router';
import { map, Observable } from 'rxjs';

// Models
import { ChatMessageResponse } from '@pages/chat/models/chat-message-response.model';
import { ChatMessage } from '@pages/chat/models';

// Service
import { UserChatService } from '@pages/chat/services';

@Injectable({
    providedIn: 'root',
})
export class ChatConversationResolver {
    constructor(private userChatService: UserChatService) {}

    resolve(route: ActivatedRouteSnapshot): Observable<ChatMessageResponse> {
        const conversationId: number = route.params['conversationId'] ?? 0;
        if (conversationId === 0) return;

        return this.userChatService.getMessages(conversationId).pipe(
            map((res) => {
                const messages = res?.pagination?.data.map(
                    (message: ChatMessage) => {
                        if (!message.parentMessageId) return message;
                        return {
                            ...message,
                            parentMessageSenderFullname:
                                res?.pagination?.data.find(
                                    (_message: ChatMessage) =>
                                        _message.id === message.parentMessageId
                                )?.sender?.fullName,
                        };
                    }
                );
                const modifiedResponse: ChatMessageResponse = {
                    pagination: {
                        ...res.pagination,
                        data: messages,
                    },
                };
                return modifiedResponse;
            })
        );
    }
}
