import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public toastr: ToastrService) {
  }

  public success(message: string, title?: string) {
    let newMsg = ' '+message+' <div class="closeToastrBtn" (click)="clickOnClose"></div>';
    this.toastr.success(newMsg, title, {
      progressBar: false, 
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-left',
      tapToDismiss: false,
      easeTime: 0,
      timeOut: 300000,
      extendedTimeOut: 3000,
      enableHtml: true,
      toastClass: 'ngx-toastr myAnimationClass',
    }).onShown.subscribe((show) => { 
      document.querySelector('.closeToastrBtn')?.addEventListener('click',()=>{
        this.addCloseAnimation();
      })
    });
  }

  public error(message: string, title?: string) {
    let newMsg = ' '+message+' <div class="closeToastrBtn retryButton"></div> <div class="closeToastrBtn" (click)="clickOnClose"></div>';
    this.toastr.error(newMsg, title, {
      progressBar: false,
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-left',
      easeTime: 0,
      timeOut: 300000,
      extendedTimeOut: 3000,
      toastClass: 'ngx-toastr myAnimationClass',
    }).onShown.subscribe((show) => { 
      document.querySelector('.closeToastrBtn')?.addEventListener('click',()=>{
        this.addCloseAnimation();
      })
    
    });; 
  }

  public warning(message: string, title?: string) {
    let newMsg = ' '+message+' <div class="closeToastrBtn" (click)="clickOnClose"></div>';
    this.toastr.warning(newMsg, title, {
      progressBar: false,
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-left',
      easeTime: 0,
      timeOut: 300000,
      extendedTimeOut: 3000,
      toastClass: 'ngx-toastr myAnimationClass',
    }).onShown.subscribe((show) => { 
      document.querySelector('.closeToastrBtn')?.addEventListener('click',()=>{
        this.addCloseAnimation();
      })
    
    });;
  }

  public addCloseAnimation(){
    let toastElement = document.querySelector('.ngx-toastr');
        toastElement.classList.add('closeAnimationBtn');
        
        setTimeout(() =>{

          this.toastr.clear();

        }, 200);
  }


}
