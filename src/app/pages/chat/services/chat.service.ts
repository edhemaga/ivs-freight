import { Observable } from "rxjs";
import { inject } from "@angular/core";

// Models
import { CompanyUserForChatListResponse, UserType } from "appcoretruckassist";

// Services
import { ChatService } from "appcoretruckassist/api/chat.service";

export class UserChatService {

    chatService = inject(ChatService);

    constructor() { }

    getCompanyUserList(userType: UserType): Observable<CompanyUserForChatListResponse> {
        return this.chatService.apiChatUserListGet(
            null,
            userType,
            null,
            null,
            null,
            null,
            null,
            null
        );

    }
}