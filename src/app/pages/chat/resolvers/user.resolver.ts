import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { CompanyUserChat } from "../models/company-user-chat.model";
import { ChatService } from "../services/chat.service";

//TODO change any
export class UserResolver implements Resolve<any>{

    private chatService = inject(ChatService);

    resolve(): Observable<CompanyUserChat[]> {
        return this.chatService.getCompanyUserList();
    }

}