import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";

// Models
import { ChatMessageResponse } from '@pages/chat/models/chat-message-reponse.model';

// Service
import { UserChatService } from "@pages/chat/services/chat.service";

@Injectable({
    providedIn: 'root'
})
export class ChatConversationResolver {

    constructor(private userChatService: UserChatService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ChatMessageResponse[]> {

        const conversationId: number = route.params['conversationId'] ?? 0;
        if (conversationId === 0) return;

        return this.userChatService.getMessages(conversationId);
    }
}