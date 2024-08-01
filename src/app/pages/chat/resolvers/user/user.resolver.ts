import { inject } from "@angular/core";

import { map, Observable } from "rxjs";

// Models
import { CompanyUserChatResponsePagination } from "appcoretruckassist";

// Service
import { UserChatService } from "@pages/chat/services/chat.service";

//TODO change any
export class UserResolver  {

    private userChatService = inject(UserChatService);

    resolve(): Observable<CompanyUserChatResponsePagination> {
        return this.userChatService.getCompanyUserList('User').pipe(
            map(res => {
                return res.pagination
            })
        );
    }

}