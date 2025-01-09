import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler } from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';

// services
import { NotificationService } from '@shared/services/notification.service';
import { FormDataService } from '@shared/services/form-data.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor(
        private notificationService: NotificationService,
        private formDataService: FormDataService
    ) {}

    intercept(
        httpRequest: HttpRequest<any>,
        next: HttpHandler
    ): Observable<any> {
        if (httpRequest.body) {
            if (httpRequest.body instanceof FormData) {
                httpRequest = this.handleBodyIn(httpRequest);
            }
        }

        return next.handle(httpRequest).pipe(
            catchError((error: any) => {
                if (httpRequest.url.indexOf('api') > -1) {
                    let timeOutValue = 1200;
                    if (httpRequest.url.indexOf('login') > -1) {
                        timeOutValue = 1;
                    }
                    setTimeout(() => {
                        this.notificationService.errorToastr(
                            httpRequest,
                            next,
                            error
                        );
                    }, timeOutValue);
                }
                return next.handle(httpRequest);
            }),
            tap({
                next: (event) => {
                    if (event.type === 0) return;

                    if (
                        httpRequest.url.indexOf('api') > -1 &&
                        httpRequest.method != 'GET'
                    ) {
                        let timeOutValue = 1200;
                        if (httpRequest.url.indexOf('login') > -1) {
                            timeOutValue = 1;
                        }

                        setTimeout(() => {
                            let responseMessage = '';

                            if (event?.body?.notDeletedIds) {
                                const errorData = {
                                    error: { error: event.body.message },
                                };

                                responseMessage = `Deleted ${event.body.deletedIds.length} Broker`;

                                this.notificationService.errorToastr(
                                    httpRequest,
                                    next,
                                    errorData
                                );
                            }

                            this.notificationService.successToastr(
                                httpRequest,
                                next,
                                responseMessage
                            );
                        }, timeOutValue);
                    }
                },
            })
        );
    }

    handleBodyIn(req: HttpRequest<any>) {
        const skipFormClone = req.headers.get('skip-form');
        const token = localStorage.getItem('user')
            ? JSON.parse(localStorage.getItem('user')).token
            : 0;

        let headers = req.headers;
        if (
            ['post', 'put'].includes(req.method.toLowerCase()) &&
            !skipFormClone
        ) {
            if (req.body instanceof FormData) {
                const serviceData = this.formDataService.formDataValue;

                req = req.clone({
                    body: serviceData,
                });
            }
        } else if (skipFormClone) {
            if (token) {
                headers = headers.set('Authorization', `Bearer ${token}`);
            }
            req = req.clone({ headers: headers });
        }
        return req;
    }
}
