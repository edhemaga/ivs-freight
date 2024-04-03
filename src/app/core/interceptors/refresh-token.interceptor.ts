import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpEvent,
    HttpRequest,
    HttpHandler,
    HttpErrorResponse,
} from '@angular/common/http';

import { Observable, catchError, throwError, switchMap } from 'rxjs';

// bootstrap
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

// services
import { WebsiteAuthService } from 'src/app/pages/website/services/website-auth.service';
import { WebsiteUserLoggedService } from 'src/app/pages/website/services/website-user-logged.service';

// models
import { AccountService, SignInResponse } from 'appcoretruckassist';

// config
import { configFactory } from './../../app.config';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
    constructor(
        private accountService: AccountService,
        private websiteAuthService: WebsiteAuthService,
        private userLoggedService: WebsiteUserLoggedService,
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
                                    this.ngbModal.dismissAll();

                                    localStorage.clear();

                                    this.websiteAuthService.accountLogout();
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
