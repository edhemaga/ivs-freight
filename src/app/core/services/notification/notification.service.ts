import { HttpHandler, HttpRequest } from '@angular/common/http';
import {Injectable} from '@angular/core';
import {ToastrService, IndividualConfig} from 'ngx-toastr';

const notificationOptions: Partial<IndividualConfig> = {
  progressBar: false, 
  progressAnimation: 'increasing',
  positionClass: 'toast-bottom-left',
  tapToDismiss: false,
  timeOut: 3000,
  extendedTimeOut: 3000,
  easeTime: 100,
  enableHtml: true,
  toastClass: ''
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public toastr: ToastrService) {
  } 

  public errorToastr(httpRequest: HttpRequest<any>, next: HttpHandler){
    this.toastr.error("", "", {...notificationOptions, payload: { httpRequest, next }});
  }

  public successToastr(httpRequest: HttpRequest<any>, next: HttpHandler){
    this.toastr.success("", "", {...notificationOptions, payload: { httpRequest, next }});
  }

  public success(message: string, title?: string) {
    this.toastr.success(message, title, notificationOptions);
  }

  public error(message: string, title?: string, retryStatus?: boolean) {
    this.toastr.error(message, title, notificationOptions);
  }

  public warning(message: string, title?: string) {
    this.toastr.warning(message, title, notificationOptions);
  }
}
