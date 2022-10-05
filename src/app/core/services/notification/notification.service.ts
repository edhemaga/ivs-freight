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
    
    if ( httpRequest.url.indexOf('application') > -1 || httpRequest.url.indexOf('dispatch') > -1 || httpRequest.url.indexOf('division') > -1 ) {
      return false;
    }

    this.toastr.error("", "", {...notificationOptions, payload: { httpRequest, next }});
  }

  public successToastr(httpRequest: HttpRequest<any>, next: HttpHandler){
    
    if ( httpRequest.url.indexOf('application') > -1 || httpRequest.url.indexOf('dispatch') > -1 || httpRequest.url.indexOf('division') > -1 ) {
      return false;
    }

    this.toastr.success("", "", {...notificationOptions, payload: { httpRequest, next }});
  }

  public success(message: string, title?: string) {
    console.log('--old success toast message')
    //this.toastr.success(message, title, notificationOptions);
  }

  public error(message: string, title?: string, retryStatus?: boolean) {
    console.log('--old error toast message')
    //this.toastr.error(message, title, notificationOptions);
  }

  public warning(message: string, title?: string) {
    console.log('--old warning toast message')
    //this.toastr.warning(message, title, notificationOptions);
  }
}
