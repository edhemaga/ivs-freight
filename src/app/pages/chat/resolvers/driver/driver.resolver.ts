import { inject } from "@angular/core";

import { map, Observable } from "rxjs";

// Models
import { CompanyUserChatResponsePagination } from "appcoretruckassist";

// Service
import { UserChatService } from "@pages/chat/services/chat.service";

export class DriverResolver  {

    private userChatService = inject(UserChatService);

    resolve(): Observable<CompanyUserChatResponsePagination> {
        return this.userChatService.getCompanyUserList('Driver').pipe(
            map(res => {
                return res.pagination
            })
        );
    }
}