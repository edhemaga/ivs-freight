import { AuthQuery } from './auth.query';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserLoggedService {
  constructor(private authQuery: AuthQuery) {}

  getAccessToken() {
    //const user = this.authquery.getEntity(1);
    const user = JSON.parse(localStorage.getItem('user'));
    return user.token;
  }
}