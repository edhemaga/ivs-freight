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
      progressBar: false, 
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-left',
      closeButton: true,
      easeTime: 0,
      timeOut: 3000,
      toastClass: 'ngx-toastr myAnimationClass',
    });
  }

  public error(message: string, title?: string) {
    this.toastr.error(message, title, {
      progressBar: false,
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-left',
      closeButton: true,
      easeTime: 0,
      timeOut: 3000,
      toastClass: 'ngx-toastr myAnimationClass',
    }).onAction.subscribe(()=>{
      console.log('---here----');
    });
  }

  public warning(message: string, title?: string) {
    this.toastr.warning(message, title, {
      progressBar: false,
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-left',
      closeButton: true,
      easeTime: 0,
      timeOut: 3000,
      toastClass: 'ngx-toastr myAnimationClass',
    });
    
  }

}
