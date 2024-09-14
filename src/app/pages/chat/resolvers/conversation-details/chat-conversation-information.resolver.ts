import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";

import { Observable } from "rxjs";

// Models
import { ConversationResponse } from "appcoretruckassist";

// Services
import { UserChatService } from "@pages/chat/services";

@Injectable({
    providedIn: 'root'
})
export class ChatConversationInformationResolver {
    constructor(private userChatService: UserChatService) { }

    resolve(route: ActivatedRouteSnapshot): Observable<ConversationResponse> {

        const conversationId: number = route.params['conversationId'] ?? 0;
        if (conversationId === 0) return;

        return this.userChatService.getConversation(conversationId);
    }
}