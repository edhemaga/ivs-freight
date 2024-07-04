import { inject } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";

// Models
import { CompanyUserForChatListResponse } from "appcoretruckassist/model/companyUserForChatListResponse";

// Service
import { UserChatService } from "@pages/chat/services/chat.service";

//TODO change any
export class DriverResolver implements Resolve<any> {

    private userChatService = inject(UserChatService);

    resolve(): Observable<CompanyUserForChatListResponse> {
        return this.userChatService.getCompanyUserList('Driver');
    }

}