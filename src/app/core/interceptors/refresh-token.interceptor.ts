import { Observable, catchError, switchMap, throwError, tap } from 'rxjs';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService, SignInResponse } from 'appcoretruckassist';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private refresh: boolean = false;
  private user: SignInResponse = JSON.parse(localStorage.getItem('user'));

  constructor(private accountService: AccountService) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401 && !this.refresh) {
          this.refresh = true;

          console.log('REFRESH TOKEN');
          console.log(this.refresh);

          return this.accountService
            .apiAccountRefreshPost({ refreshToken: this.user.refreshToken })
            .pipe(
              switchMap((res: any) => {
                this.user = {
                  ...this.user,
                  refreshToken: res,
                };

                console.log('USER WITH NEW TOKEN');
                console.log(this.user);

                localStorage.setItem('user', JSON.stringify(this.user));

                return next.handle(null);
              })
            );
        }
        this.refresh = false;
        return throwError(() => err);
      })
    );
  }
}
