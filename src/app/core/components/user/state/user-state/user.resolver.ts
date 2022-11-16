import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { GetCompanyUserListResponse } from 'appcoretruckassist';
import { Observable, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserTService } from '../user.service';
import { UserState, UserStore } from './user.store';

@Injectable({
   providedIn: 'root',
})
export class UserResolver implements Resolve<UserState> {
   constructor(
      private userService: UserTService,
      private userStore: UserStore
   ) {}
   resolve(): Observable<UserState | boolean> {
      return this.userService.getUsers(1, 1, 25).pipe(
         catchError(() => {
            return of('No user data...');
         }),
         tap((userPagination: GetCompanyUserListResponse) => {
            localStorage.setItem(
               'userTableCount',
               JSON.stringify({
                  users: userPagination.activeCount,
               })
            );

            this.userStore.set(userPagination.pagination.data);
         })
      );
   }
}
