import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import { AuthService } from '../services/auth/auth.service';
import { configFactory } from 'src/app/app.config';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService,) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = JSON.parse(localStorage.getItem('token'));
    if (request.url.includes('/api/')) {
      if (token) {
        request = request.clone({
          setHeaders: {
            api_key: '1234',
            'Content-Type': 'application/json',
            Authorization: 'Bearer ' + token
          }
        });
        configFactory(token);
      } else {
        this.authService.logout();
      }
    }
    return next.handle(request);
  }
}
