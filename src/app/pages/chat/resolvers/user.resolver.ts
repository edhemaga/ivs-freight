import { inject } from "@angular/core";
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from "@angular/router";
import { Observable, of } from "rxjs";
import { ChatService } from "../services/chat.service";

//TODO change any
export class UserResolver implements Resolve<any>{

    private chatService = inject(ChatService);

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
        return this.chatService.getCompanyUserList();
    }

}