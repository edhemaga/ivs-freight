import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpEvent,
  HttpResponse,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { catchError, Observable, throwError, tap, finalize, of } from 'rxjs';
import { NotificationService } from './core/services/notification/notification.service';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
  constructor(private notificationService: NotificationService) {}

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<any> {
    return next.handle(httpRequest).pipe(
      catchError((error: any) => {
        if (httpRequest.url.indexOf('api') > -1) {
          let timeOutValue = 1200;
          if (httpRequest.url.indexOf('login') > -1) {
            timeOutValue = 1;
          }
          setTimeout(() => {
            this.notificationService.errorToastr(httpRequest, next);
          }, timeOutValue);
        }

        return next.handle(httpRequest)
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
              this.notificationService.successToastr(httpRequest, next);
            }, timeOutValue);
          }
        },
      })
    );
  }
}
