import { inject } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";

// Models
import { CompanyUserChat } from "@pages/chat/models/company-user-chat.model";

// Service
import { ChatService } from "@pages/chat/services/chat.service";

//TODO change any
export class UserResolver implements Resolve<any> {

    private chatService = inject(ChatService);

    resolve(): Observable<CompanyUserChat[]> {
        return this.chatService.getCompanyUserList();
    }

}