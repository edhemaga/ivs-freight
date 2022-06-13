import { Inject, Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { configFactory } from 'src/app/app.config';
import { AuthQuery } from '../components/authentication/state/auth.query';
import { PersistState } from '@datorama/akita';

@Injectable({
  providedIn: 'root',
})
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private authQuery: AuthQuery,
    @Inject('persistStorage') private persistStorage: PersistState
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //-------------------------- PRODUCTION MODE --------------------------------
    // this.persistStorage.clearStore();
    // if (this.authQuery.getEntity(1)) {
    //   request = request.clone({
    //     headers: request.headers.set(
    //       'Authorization',
    //       'Bearer ' + this.authQuery.getEntity(1).token
    //     ),
    //   });
    //   configFactory(this.authQuery.getEntity(1).token);
    // }

    // ------------------------- DEVELOP MODE -----------------------------------

    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      request = request.clone({
        headers: request.headers.set('Authorization', 'Bearer ' + user.token),
      });
      configFactory(user.token);
    }
    return next.handle(request);
  }
}
