import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class WebsiteUserLoggedService {
    constructor() {}

    public getAccessToken(): string {
        //const user = this.authquery.getEntity(1);
        const user = JSON.parse(localStorage.getItem('user'));

        return user?.token;
    }
}
