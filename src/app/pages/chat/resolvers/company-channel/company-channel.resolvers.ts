import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

// Models
import { ConversationResponse } from "appcoretruckassist";

// Service
import { UserChatService } from "@pages/chat/services/chat.service";

@Injectable({
    providedIn: 'root'
})
export class CompanyChannelResolver {

    constructor(private userChatService: UserChatService) { }

    resolve(): Observable<ConversationResponse> {
        return this.userChatService.getCompanyChannels();
    }

}