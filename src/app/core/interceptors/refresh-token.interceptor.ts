import { configFactory } from './../../app.config';
import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpEvent,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse,
} from '@angular/common/http';
import { Observable, catchError, throwError, switchMap } from 'rxjs';
import { AccountService, SignInResponse } from 'appcoretruckassist';
import { Router } from '@angular/router';
import { UserLoggedService } from '../components/authentication/state/user-logged.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
    constructor(
        private accountService: AccountService,
        private router: Router,
        private userLoggedService: UserLoggedService
    ) {}

    intercept(
        httpRequest: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        return next.handle(httpRequest).pipe(
            catchError((err: HttpErrorResponse) => {
                const user: SignInResponse = JSON.parse(
                    localStorage.getItem('user')
                );
                if (err.status === 401 && user) {
                    return this.accountService
                        .apiAccountRefreshPost({
                            refreshToken: user.refreshToken,
                        })
                        .pipe(
                            switchMap((res: any) => {
                                user.token = res.token;
                                user.refreshToken = res.refreshToken;
                                localStorage.setItem(
                                    'user',
                                    JSON.stringify(user)
                                );
                                configFactory(this.userLoggedService);
                                return next.handle(
                                    httpRequest.clone({
                                        setHeaders: {
                                            Authorization: `bearer ${user.token}`,
                                        },
                                    })
                                );
                            }),
                            catchError((err: HttpErrorResponse) => {
                                if (err.status === 404 || err.status === 500) {
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
