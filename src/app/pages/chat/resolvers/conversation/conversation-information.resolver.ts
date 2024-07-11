import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve } from "@angular/router";

// Services
import { UserChatService } from "@pages/chat/services/chat.service";

export class ConversationInformationResolver implements Resolve<any> {
    private userChatService = inject(UserChatService);

    resolve(route: ActivatedRouteSnapshot) {

        const conversationId: number = route.params['conversationId'] ?? 0;
        if (conversationId === 0) return;

        return this.userChatService.getConversation(conversationId);
    }
}