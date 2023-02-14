import { configFactory } from './../../app.config';
import { Injectable, Inject, InjectionToken } from '@angular/core';
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
import { WebsiteAuthService } from '../components/website/state/service/website-auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { JwtHelperService } from '@auth0/angular-jwt';

export const JWT_HELPER_TOKEN = new InjectionToken('jwt.helper.service');

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
    constructor(
        private accountService: AccountService,
        @Inject(JWT_HELPER_TOKEN) private jwtHelper: JwtHelperService,
        private router: Router,
        private websiteAuthService: WebsiteAuthService,
        private userLoggedService: UserLoggedService,
        private ngbModal: NgbModal
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

                if (
                    err.status === 401 &&
                    this.jwtHelper.isTokenExpired(user.token)
                ) {
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
                                    this.ngbModal.dismissAll();
                                    localStorage.clear();
                                    this.websiteAuthService.accountLogout();
                                    this.router.navigate(['/website']);
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
