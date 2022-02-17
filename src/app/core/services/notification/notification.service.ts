import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public toastr: ToastrService) {
  }

  public success(message: string, title?: string) {
    this.toastr.success(message, title, {
      progressBar: true,
      progressAnimation: 'increasing',
      easeTime: 300,
      timeOut: 3000
    });
  }

  public error(message: string, title?: string) {
    this.toastr.error(message, title, {
      progressBar: true,
      progressAnimation: 'increasing',
      easeTime: 300,
      timeOut: 3000
    });
  }

  public warning(message: string, title?: string) {
    this.toastr.warning(message, title, {
      progressBar: true,
      progressAnimation: 'increasing',
      easeTime: 300,
      timeOut: 3000
    });
  }

}
