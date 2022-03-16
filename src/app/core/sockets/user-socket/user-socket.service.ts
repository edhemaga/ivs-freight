import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserSocket extends Socket {
  constructor() {
    super({
      url: '',
      // url: `${environment.baseSocketUrl}/users`,
      options: {
        // @ts-ignore
        withCredentials: false,
      },
    });
  }
}
