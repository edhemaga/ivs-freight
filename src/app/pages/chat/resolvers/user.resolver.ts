import { inject } from "@angular/core";
import { Resolve } from "@angular/router";
import { Observable } from "rxjs";
import { CompanyUserChat } from "../models/company-user-chat.model";
import { ChatService } from "../services/chat.service";

//TODO change any
export class UserResolver implements Resolve<any> {

    private chatService = inject(ChatService);

    resolve(): Observable<CompanyUserChat[]> {
        return this.chatService.getCompanyUserList();
    }

}