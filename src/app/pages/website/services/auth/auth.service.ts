import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { LoginProps } from '@pages/website/state/auth.model';
import { environment } from 'src/environments/environment';
import { SignInResponse } from 'appcoretruckassist';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(public http: HttpClient) { }

  authLogin(loginData: LoginProps) {
    const formData = new FormData();
    formData.append('email', loginData.email);
    formData.append('password', loginData.password);

    return this.http.post<SignInResponse>(
      `${environment.API_ENDPOINT}/api/account/login`,
      formData
    );
  }
}
