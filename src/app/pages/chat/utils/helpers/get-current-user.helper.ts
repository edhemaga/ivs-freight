import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export abstract class GetCurrentUserHelper {
    public static currentUserId: number = localStorage.getItem('user')
        ? JSON.parse(localStorage.getItem('user')).companyUserId
        : 0;
}
