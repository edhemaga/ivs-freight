import { HttpHandler, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService, IndividualConfig } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';

const notificationOptions: Partial<IndividualConfig> = {
  progressBar: false,
  progressAnimation: 'increasing',
  positionClass: 'toast-bottom-left',
  tapToDismiss: false,
  timeOut: 3000,
  extendedTimeOut: 1500,
  easeTime: 145,
  enableHtml: true,
  toastClass: '',
};

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(
    public toastr: ToastrService,
    private router: Router,
    private activated_route: ActivatedRoute
  ) {}

  public errorToastr(httpRequest: HttpRequest<any>, next: HttpHandler, error?) {
    const user = JSON.parse(localStorage.getItem('user'));

    if (
      httpRequest.url.indexOf('pm/truck/') > -1 ||
      (error && error.status == 401) ||
      !user ||
      !user?.token ||
      httpRequest.url.indexOf('applicant') > -1 ||
      httpRequest.url.indexOf('application') > -1 ||
      httpRequest.url.indexOf('dispatch') > -1 ||
      httpRequest.url.indexOf('division') > -1
    ) {
      return false;
    }

    let currentUrl = this.activated_route.snapshot['_routerState']['url'];
    if (currentUrl.indexOf('auth') > -1) {
      notificationOptions.positionClass = 'toast-bottom-left-login';
    }

    this.toastr.error('', '', {
      ...notificationOptions,
      payload: { httpRequest, next, error },
    });
  }

  public successToastr(httpRequest: HttpRequest<any>, next: HttpHandler) {
    if (
      httpRequest.url.indexOf('pm/truck/') > -1 ||
      httpRequest.url.indexOf('login') > -1 ||
      httpRequest.url.indexOf('applicant') > -1 ||
      httpRequest.url.indexOf('application') > -1 ||
      httpRequest.url.indexOf('dispatch') > -1 ||
      httpRequest.url.indexOf('division') > -1
    ) {
      return false;
    }

    let currentUrl = this.activated_route.snapshot['_routerState']['url'];
    if (currentUrl.indexOf('auth') > -1) {
      notificationOptions.positionClass = 'toast-bottom-left-login';
    }

    this.toastr.success('', '', {
      ...notificationOptions,
      payload: { httpRequest, next },
    });
  }

  public success(message: string, title?: string) {
    console.log('--old success toast message');
    //this.toastr.success(message, title, notificationOptions);
  }

  public error(message: string, title?: string, retryStatus?: boolean) {
    console.log('--old error toast message');
    //this.toastr.error(message, title, notificationOptions);
  }

  public warning(message: string, title?: string) {
    console.log('--old warning toast message');
    //this.toastr.warning(message, title, notificationOptions);
  }
}
