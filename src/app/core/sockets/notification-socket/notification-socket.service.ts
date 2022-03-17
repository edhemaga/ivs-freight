import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';

@Injectable({providedIn: 'root'})

export class NotificationSocket extends Socket {

  constructor() {
    super({
      url: "",
      //  url: `${environment.baseSocketUrl}/notifications`,
      options: {
        // @ts-ignore
        withCredentials: false
      }
    });
  }

}
