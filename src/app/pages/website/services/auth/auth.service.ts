import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

//rxjs
import { Observable } from 'rxjs';

// models
import { LoginProps } from '@pages/website/state/models/auth-login.model';
import { SignInResponse, SignUpCompanyCommand } from 'appcoretruckassist';

// environment
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    constructor(public http: HttpClient) {}

    public authLogin(loginData: LoginProps): Observable<SignInResponse> {
        return this.http.post<SignInResponse>(
            `${environment.API_ENDPOINT}/api/account/login`,
            loginData
        );
    }

    public authRegister(
        registerData: SignUpCompanyCommand
    ): Observable<object> {
        return this.http.post(
            `${environment.API_ENDPOINT}/api/account/signupcompany`,
            registerData
        );
    }
}
