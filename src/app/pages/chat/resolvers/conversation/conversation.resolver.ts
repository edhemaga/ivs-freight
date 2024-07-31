import { inject } from "@angular/core";
import { ActivatedRouteSnapshot } from "@angular/router";
import { Observable } from "rxjs";

// Models
import { MessageResponse } from "appcoretruckassist";

// Service
import { UserChatService } from "@pages/chat/services/chat.service";

export class ConversationResolver  {

    private userChatService = inject(UserChatService);

    resolve(route: ActivatedRouteSnapshot): Observable<MessageResponse[]> {

        const conversationId: number = route.params['conversationId'] ?? 0;
        if (conversationId === 0) return;

        return this.userChatService.getMessages(conversationId);
    }
}