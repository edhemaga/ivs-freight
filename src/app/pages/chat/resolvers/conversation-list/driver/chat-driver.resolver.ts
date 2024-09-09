import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

// Models
import { CompanyUserChatResponsePagination } from "appcoretruckassist";

// Service
import { UserChatService } from "@pages/chat/services/chat.service";

@Injectable({
    providedIn: 'root'
})
export class ChatDriverResolver {

    constructor(private userChatService: UserChatService) { }

    resolve(): Observable<CompanyUserChatResponsePagination> {
        return this.userChatService.getCompanyUserList('Driver', 1, 6).pipe(
            map(res => {
                return res.pagination
            })
        );
    }
}