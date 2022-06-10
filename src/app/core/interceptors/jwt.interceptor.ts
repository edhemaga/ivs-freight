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

    this.persistStorage.clearStore();

    if (this.authQuery.getEntity(1)) {
      request = request.clone({
        headers: request.headers.set(
          'Authorization',
          'Bearer ' + this.authQuery.getEntity(1).token
        ),
      });
      configFactory(this.authQuery.getEntity(1).token);
    }
    return next.handle(request);
  }
}
