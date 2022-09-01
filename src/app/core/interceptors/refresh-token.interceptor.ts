import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpRequest,
  HttpHandler,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError, switchMap, tap } from 'rxjs';
import { AccountService, SignInResponse } from 'appcoretruckassist';
import { Router } from '@angular/router';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  constructor(private accountService: AccountService, private router: Router) {}

  intercept(
    httpRequest: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(httpRequest).pipe(
      catchError((err: HttpErrorResponse) => {
        const user: SignInResponse = JSON.parse(localStorage.getItem('user'));
        if (err.status === 401 && user) {
          console.log('Err status: ', err.status);
          return this.accountService
            .apiAccountRefreshPost({ refreshToken: user.refreshToken })
            .pipe(
              switchMap((res: any) => {
                user.token = res.token;
                user.refreshToken = res.refreshToken;
                localStorage.setItem('user', JSON.stringify(user));
                console.log('Refresh token: ', user);
                return next.handle(httpRequest);
              }),
              catchError((err: HttpErrorResponse) => {
                if (err.status === 404) {
                  localStorage.removeItem('user');
                  this.router.navigate(['/auth']);
                }
                return throwError(() => err);
              })
            );
        }
        return throwError(() => err);
      })
    );
  }
}
