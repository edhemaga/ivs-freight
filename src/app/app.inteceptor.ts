import { Injectable } from '@angular/core';
import {
    HttpInterceptor,
    HttpRequest,
    HttpHandler,
} from '@angular/common/http';
import { catchError, Observable, tap } from 'rxjs';
import { NotificationService } from './core/services/notification/notification.service';
import { FormDataService } from './core/services/formData/form-data.service';

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
                complete: () => {
                    if (
                        httpRequest.url.indexOf('api') > -1 &&
                        httpRequest.method != 'GET'
                    ) {
                        let timeOutValue = 1200;
                        if (httpRequest.url.indexOf('login') > -1) {
                            timeOutValue = 1;
                        }
                        setTimeout(() => {
                            this.notificationService.successToastr(
                                httpRequest,
                                next
                            );
                        }, timeOutValue);
                    }
                },
            })
        );
    }

    handleBodyIn(req: HttpRequest<any>) {
        if (['post', 'put'].includes(req.method.toLowerCase())) {
            if (req.body instanceof FormData) {
                const serviceData = this.formDataService.formDataValue;

                req = req.clone({
                    body: serviceData,
                });
            }
        }
        return req;
    }
}
