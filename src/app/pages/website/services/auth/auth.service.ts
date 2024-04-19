import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//rxjs
import { Observable } from 'rxjs';

// models
import { LoginProps } from '@pages/website/state/auth.model';
import { SignInResponse } from 'appcoretruckassist';

// environment
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(public http: HttpClient) {}

    authLogin(loginData: LoginProps): Observable<SignInResponse> {
        return this.http.post<SignInResponse>(
            `${environment.API_ENDPOINT}/api/account/login`,
            loginData
        );
    }
}
