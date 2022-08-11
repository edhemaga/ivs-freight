import { Observable, catchError, switchMap, throwError } from 'rxjs';
import {
  HttpEvent,
  HttpHandler,
  HttpRequest,
  HttpInterceptor,
  HttpErrorResponse,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AccountService, SignInResponse } from 'appcoretruckassist';
import { AuthStoreService } from '../components/authentication/state/auth.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  refresh: boolean = false;
  user: SignInResponse = JSON.parse(localStorage.getItem('user'));

  constructor(
    private accountService: AccountService,
    private authStoreService: AuthStoreService
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    let authReq = request;

    if (this.user) {
      authReq = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.user.token}`,
        },
      });
    }

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        console.log('Eror status ', err.status);

        if (err.status === 401 && !this.refresh) {
          this.refresh = true;
          console.log('REFRESH TOKEN ', {
            refreshToken: this.user.refreshToken,
          });
          return this.accountService
            .apiAccountRefreshPost({ refreshToken: this.user.refreshToken })
            .pipe(
              switchMap((res: any) => {
                this.user = {
                  ...this.user,
                  refreshToken: res.refreshToken,
                  token: res.token,
                };
                console.log('Successfuly updated ', this.user);
                localStorage.setItem('user', JSON.stringify(this.user));
                this.refresh = false;
                return next.handle(
                  request.clone({
                    setHeaders: {
                      Authorization: `Bearer ${res.token}`,
                    },
                  })
                );
              }),
              catchError((err: HttpErrorResponse) => {
                console.log('ERROR REFRESH TOKEN ', err.status);
                if (err.status === 401) {
                  this.authStoreService.accountLogut();
                  this.refresh = false;
                }
                return throwError(() => err);
              })
            );
        }
        this.refresh = false;
        return throwError(() => err);
      })
    );
  }
}
