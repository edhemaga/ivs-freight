import {Injectable} from '@angular/core';
import {ToastrService} from 'ngx-toastr';
import { ModalService } from '../../components/shared/ta-modal/modal.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(public toastr: ToastrService, private modalService: ModalService) {
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
    let newMsg = ' '+message+' <div class="closeToastrBtn retryButton"></div> <div class="closeToastrBtn closeIcon" (click)="clickOnClose"></div>';
    let mainTitle = title;
    let retryStarted = false;
    this.toastr.error(newMsg, title, {
      progressBar: false,
      progressAnimation: 'increasing',
      positionClass: 'toast-bottom-left',
      easeTime: 0,
      timeOut: 300000,
      extendedTimeOut: 30000,
      tapToDismiss: false,
      enableHtml: true,
      toastClass: 'ngx-toastr myAnimationClass',
    }).onShown.subscribe((show) => { 
      document.querySelector('.closeIcon')?.addEventListener('click',()=>{
        
        if ( !retryStarted )
          {
            this.addCloseAnimation();
          }
        
      })
      
      document.querySelector('.retryButton')?.addEventListener('mouseover',()=>{

        let toastElement = <HTMLElement> document.querySelector('.ngx-toastr');
        let toastTitle = <HTMLElement> document.querySelector('.toast-title');
       
        if ( !retryStarted )
          {
              toastElement.classList.add('retryClassColor');
              let splitStr = title.split(' ');
              let newTitle = '';
              for (var i = 0; i < splitStr.length; i++) 
                {
                  splitStr[0] = 'RETRY';
                  newTitle = newTitle + ' ' + splitStr[i];
                }
                
              toastTitle.innerHTML = newTitle;
          }
      })

      document.querySelector('.retryButton')?.addEventListener('mouseleave',()=>{
        let toastElement = <HTMLElement> document.querySelector('.ngx-toastr');
        let toastTitle = <HTMLElement> document.querySelector('.toast-title');
        
        if ( !retryStarted )
          {
            toastElement.classList.remove('retryClassColor');
              let splitStr = title.split(' ');
              let newTitle = '';
              for (var i = 0; i < splitStr.length; i++) 
                {
                  splitStr[0] = 'FAILED';
                  newTitle = newTitle + ' ' + splitStr[i];
                }
                
              toastTitle.innerHTML = newTitle;
          }
      })

      document.querySelector('.retryButton')?.addEventListener('click',()=>{
        let toastElement = <HTMLElement> document.querySelector('.ngx-toastr');
        let toastTitle = <HTMLElement> document.querySelector('.toast-title');
        toastElement.classList.add('retryClassColor');

        if ( !retryStarted )
          {
              let retryBtnElement = <HTMLElement> document.querySelector('.retryButton');
              retryBtnElement?.classList.add('hideClass');

              let closeBtnElement = <HTMLElement> document.querySelector('.closeIcon');
              closeBtnElement?.classList.add('loaderClass');

              let size = 'small';
              let color = 'white';
              this.modalService.setModalSpinner({ action: null, status: true });
              //console.log('---spinner', this.modalService);
              //console.log('---spinner', this.modalService);
              closeBtnElement.innerHTML = `<app-ta-spinner [size]="${size}" [color]="${color}"></app-ta-spinner>`;

              let splitStr = title.split(' ');
              let lastWordNum = splitStr.length - 1;
              let lastWordText = splitStr[lastWordNum];
              
              let newTitle = 'CREATING ' + lastWordText;
              retryStarted = true;
              
                
              toastTitle.innerHTML = newTitle;
          }
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
      tapToDismiss: false,
      enableHtml: true,
      toastClass: 'ngx-toastr myAnimationClass',
    }).onShown.subscribe((show) => { 
      document.querySelector('.closeToastrBtn')?.addEventListener('click',()=>{
        this.addCloseAnimation();
      })
    
    });;
  }

  public addCloseAnimation(){
    let toastElement = <HTMLElement> document.querySelector('.ngx-toastr');
        toastElement.classList.add('closeAnimationBtn');
        
        setTimeout(() =>{

          this.toastr.clear();

        }, 200);
  }


}
