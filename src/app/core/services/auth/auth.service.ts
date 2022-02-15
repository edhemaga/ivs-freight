import { Injectable } from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private http: HttpClient,
  ) {}

  /**
   * User login function
   *
   * @param data Any
   */
  public userLogin(data: any) {
    return this.http.post(environment.API_ENDPOINT + 'user/login', data).pipe(
      map((user: any) => {
        const {userType, companyId} = user.loggedUser;
        if (userType && (userType === 'company_owner' || userType === 'admin')) {
          this.http
            .post(environment.baseChatApiUrl + '/access', {
              companyId,
              token: `Bearer ${user.token}`,
            })
            .subscribe(() => {
            });
        }
        localStorage.setItem('currentUser', JSON.stringify(user.loggedUser));
        localStorage.setItem('token', JSON.stringify(user.token));
        localStorage.setItem('userCompany', JSON.stringify(user.userCompany));
       /*  this.communicatorUserService.requestChatUserData(
          user.loggedUser.companyId,
          user.loggedUser.id
        ); */
        //this.currentUserSubject.next(user);
        return user;
      })
    );
  }


}
