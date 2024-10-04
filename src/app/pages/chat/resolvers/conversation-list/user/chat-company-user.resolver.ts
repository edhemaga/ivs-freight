import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

// Models
import { CompanyUserChatResponsePagination } from 'appcoretruckassist';

// Service
import { UserChatService } from '@pages/chat/services';

// Enums
import { ChatSearchPlaceHolders } from '@pages/chat/enums';

@Injectable({
    providedIn: 'root',
})
export class ChatCompanyUserResolver {
    public chatSearchPlaceHolders = ChatSearchPlaceHolders;

    constructor(private userChatService: UserChatService) {}

    resolve(): Observable<CompanyUserChatResponsePagination> {
        return this.userChatService
            .getCompanyUserList(this.chatSearchPlaceHolders.USER)
            .pipe(
                map((res) => {
                    return res.pagination;
                })
            );
    }
}
