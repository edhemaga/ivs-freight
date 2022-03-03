import {Injectable} from '@angular/core';
import {environment} from 'src/environments/environment';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, map, Observable} from "rxjs";
import {SelectCompanyResponse} from "../../model/select-company";
import {CommunicatorUserService} from "../communicator/communicator-user.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser!: Observable<any>;
  private currentUserSubject!: BehaviorSubject<any>;

  constructor(
    private http: HttpClient,
    private communicatorUserService: CommunicatorUserService
  ) {
  }

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
        }
        localStorage.setItem('currentUser', JSON.stringify(user.loggedUser));
        localStorage.setItem('token', JSON.stringify(user.token));
        localStorage.setItem('userCompany', JSON.stringify(user.userCompany));
       // this.currentUserSubject.next(user);
        return user;
      })
    );
  }

  public onCompanySelect(companyId: any) {
    return this.http.get(environment.API_ENDPOINT + `user/select/company/${companyId}`).pipe(
      // @ts-ignore
      map((res: SelectCompanyResponse) => {
        localStorage.setItem('token', JSON.stringify(res.token));
      })
    );
  }

  /**
   * Register user function
   *
   * @param data any
   */
  public registerUser(data: any) {
    return this.http.post(environment.API_ENDPOINT + 'user/register', data);
  }

  /**
   * Logout function
   */
  public logout() {
    this.currentUserSubject.next(null);
    this.communicatorUserService.changeMyStatus('offline');
    localStorage.clear();
    return this.http.get(environment.API_ENDPOINT + 'user/logout');
  }


}
