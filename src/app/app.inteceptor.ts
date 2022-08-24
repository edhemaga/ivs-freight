import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { NotificationService } from './core/services/notification/notification.service';



@Injectable()
export class AppInterceptor implements HttpInterceptor {

    constructor(private notificationService:NotificationService){

    }

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(httpRequest).pipe(
        catchError((error: any) => {
            this.notificationService.errorToastr(httpRequest, next);
            
            return throwError(() => new Error(error.statusText));
        })
    );

   
  }
}