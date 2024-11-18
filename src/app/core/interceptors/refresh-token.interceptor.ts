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
import { WebsiteAuthService } from '@pages/website/services/website-auth.service';
import { WebsiteUserLoggedService } from '@pages/website/services/website-user-logged.service';

// models
import { AccountService, SignInResponse } from 'appcoretruckassist';

// config
import { configFactory } from '@core/configs/app.config';

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
        const user: SignInResponse = JSON.parse(localStorage.getItem('user'));
        // If a token exists, clone the request and add the Authorization header
        if (user?.token) {
            const clonedRequest = httpRequest.clone({
                headers: httpRequest.headers.set(
                    'Authorization',
                    `Bearer ${user.token}`
                ),
            });

            // Pass the cloned request instead of the original request to the next handler
            return next
                .handle(clonedRequest)
                .pipe(
                    catchError((e) =>
                        this.catchErrorInterceptor(e, user, httpRequest, next)
                    )
                );
        }

        return next
            .handle(httpRequest)
            .pipe(
                catchError((e) =>
                    this.catchErrorInterceptor(e, user, httpRequest, next)
                )
            );
    }

    catchErrorInterceptor(
        err: HttpErrorResponse,
        user: SignInResponse,
        httpRequest: HttpRequest<any>,
        next: HttpHandler
    ) {
        if (err.status === 401 && user && user.refreshToken) {
            return this.accountService
                .apiAccountRefreshPost({
                    refreshToken: user.refreshToken,
                })
                .pipe(
                    switchMap((res) => {
                        user.token = res.token;
                        user.refreshToken = res.refreshToken;

                        localStorage.setItem('user', JSON.stringify(user));

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

                        this.ngbModal.dismissAll();

                        localStorage.clear();

                        this.websiteAuthService.accountLogout();

                        return throwError(() => err);
                    })
                );
        }
        return throwError(() => err);
    }
}
