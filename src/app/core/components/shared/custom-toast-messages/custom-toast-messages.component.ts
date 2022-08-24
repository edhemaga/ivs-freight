import { Component, OnInit } from '@angular/core';
import {
  animate,
  keyframes,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Toast, ToastrService, ToastPackage } from 'ngx-toastr';
import { HttpHandler, HttpRequest } from '@angular/common/http';
import { NotificationService } from 'src/app/core/services/notification/notification.service';



const routeSpecify = {
  "/api/account/login": "Driver"
}

@Component({
  selector: 'app-custom-toast-messages',
  templateUrl: './custom-toast-messages.component.html',
  styleUrls: ['./custom-toast-messages.component.scss'],
  animations: [
    trigger('flyInOut', [
      state(
        'inactive',
        style({
          display: 'flex',
          position: 'relative',
          top: '100px',
          opacity: 1,
          transform: 'scale(1)',
        })
      ),
      transition(
        'inactive => active',
        animate(
          '150ms ease-out',
          keyframes([
            style({
              top: '100px',
            }),
            style({
              top: '0px',
            }),
          ])
        )
      ),

      transition(
        'active => removed',
        animate(
          '150ms ease-out',
          keyframes([
            style({
              opacity: 1,
            }),
            style({
              opacity: 0,
            }),
          ])
        )
      ),
    ]),
  ],
})
export class CustomToastMessagesComponent extends Toast implements OnInit {
  toastrType: string = "";
  retryBtnHovered: boolean = false;
  retryStarted: boolean = false;

  httpRequest: HttpRequest<any>;
  next: HttpHandler;

  mainTitle: string = "";
  method: string = "";
  actionTitle: string = "";
  actionType: string = "";

  apiConfObj: any[] = [
    {
      'https://localhost:7226/api/driver' : 'DRIVER'
    },
    {
      'https://localhost:7226/api/driver/modal' : 'DRIVER'
    },
  ]
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
    private notificationService: NotificationService
  ) {
    super(toastrService, toastPackage);
    this.httpRequest = this.toastPackage.config.payload.httpRequest;
    this.next = this.toastPackage.config.payload.next;
    this.toastrType = this.toastPackage.toastType;
  }

  ngOnInit(): void {
    this.createTitleBasedOnHttpRequest();
  }

  createTitleBasedOnHttpRequest(){
    console.log(this.httpRequest);
    console.log(this.httpRequest.method);
    console.log(this.httpRequest.url);
    let url = this.httpRequest.url;

     
    this.apiConfObj.map((item) => {
      console.log(item);
    })
    
    console.log(this.apiConfObj);
   
    if ( this.httpRequest.method == 'POST')
      {
        this.actionTitle = 'CREATE';
        this.actionType = 'DRIVER';
      }
    else if ( this.httpRequest.method == 'GET')
      {
        this.actionTitle = 'LOAD';
        this.actionType = 'DRIVER';
      }  

    this.message = 'Failed to laod drivers';  
  }

  closeToast(): void{
    this.toastPackage.toastRef.close();
  }

  clickOnRetry() {
    this.retryStarted = true;
    this.next.handle(this.httpRequest).subscribe(() => {
      this.notificationService.errorToastr(this.httpRequest, this.next);
    });
  }
}
