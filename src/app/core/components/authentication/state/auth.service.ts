import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { AuthStore } from './auth.store';
import { map, Observable } from 'rxjs';

import { AccountService, SignUpCompanyCommand } from 'appcoretruckassist';

@Injectable({ providedIn: 'root' })
export class AuthStoreService {
    constructor(
        private authStore: AuthStore,
        private http: HttpClient,
        private accountService: AccountService
    ) {}

    public userLogin(data: any) {
        return this.http
            .post(environment.API_ENDPOINT + '/api/account/login', data)
            .pipe(
                map((user: any) => {
                    localStorage.setItem(
                        'currentUser',
                        JSON.stringify(user.loggedUser)
                    );
                    localStorage.setItem('token', JSON.stringify(user.token));
                    localStorage.setItem(
                        'userCompany',
                        JSON.stringify(user.userCompany)
                    );
                    this.authStore.update(user);
                    return user;
                })
            );
    }

    public signUpCompany(data: SignUpCompanyCommand): Observable<any> {
        return this.accountService.apiAccountSignupcompanyPost(
            data,
            'response'
        );
    }
}
