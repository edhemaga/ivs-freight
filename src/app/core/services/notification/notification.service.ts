import {Injectable} from '@angular/core';
import {ToastrService, ToastPackage} from 'ngx-toastr';
import { ModalService } from '../../components/shared/ta-modal/modal.service'; 

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public toastr: ToastrService, private modalService: ModalService) {
  }

  public success(message: string, title?: string) {
    this.toastr.success(message, title, {
      progressBar: false, 
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-left',
      tapToDismiss: false,
      timeOut: 3000,
      extendedTimeOut: 3000,
      easeTime: 150,
      enableHtml: true,
      toastClass: '',
    }).onShown.subscribe((show) => { 
      document.querySelector('.closeIcon')?.addEventListener('click',()=>{
        this.addCloseAnimation();
      })
    });
  }

  public error(message: string, title?: string, retryStatus?: boolean) {
    let mainTitle = title;
    let retryStarted = false;
   
    this.toastr.error(message, title, {
      progressBar: false,
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-left',
      timeOut: 3000,
      easeTime: 150,
      extendedTimeOut: 3000,
      tapToDismiss: false,
      enableHtml: true,
      toastClass: retryStatus ? 'showRetry' : '',
    }).onShown.subscribe((show) => { 
      document.querySelector('.closeIcon')?.addEventListener('click',()=>{
        
        if ( !retryStarted )
          {
            this.addCloseAnimation();
          }
        
      })

      document.querySelector('.retryButton')?.addEventListener('click',()=>{
        console.log('--here--')
      })
    });
  }

  public warning(message: string, title?: string) {
    this.toastr.warning(message, title, {
      progressBar: false,
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-left',
      easeTime: 150,
      timeOut: 3000,
      extendedTimeOut: 3000,
      tapToDismiss: false,
      enableHtml: true,
      toastClass: '',
      
    }).onShown.subscribe((show) => { 
      document.querySelector('.closeIcon')?.addEventListener('click',()=>{
        this.addCloseAnimation();
      })
    
    });;
  }

  public addCloseAnimation(){ 
      let toastElement = <HTMLElement> document.querySelector('.main-toast-holder');
      toastElement.classList.add('closeAnimationBtn');
      
      setTimeout(() =>{

        this.toastr.clear();

      }, 200); 
  }


}
