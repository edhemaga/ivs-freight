import { inject } from "@angular/core";
import { Resolve } from "@angular/router";
import { map, Observable, of } from "rxjs";

// Models
import { CreateResponse } from "appcoretruckassist";

// Service
import { UserChatService } from "@pages/chat/services/chat.service";

export class ConversationResolver implements Resolve<CreateResponse> {

    private userChatService = inject(UserChatService);

    resolve(): Observable<CreateResponse> {
        return of();
    }
}