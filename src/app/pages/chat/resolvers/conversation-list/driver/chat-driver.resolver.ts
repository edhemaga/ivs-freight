import { Injectable } from "@angular/core";
import { map, Observable } from "rxjs";

// Models
import { CompanyUserChatResponsePagination } from "appcoretruckassist";

// Service
import { UserChatService } from "@pages/chat/services";

@Injectable({
    providedIn: 'root'
})
export class ChatDriverResolver {

    constructor(private userChatService: UserChatService) { }

    resolve(): Observable<CompanyUserChatResponsePagination> {
        return this.userChatService.getCompanyUserList('Driver').pipe(
            map(res => {
                return res.pagination
            })
        );
    }
}