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
          '150ms ease-in',
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
          '150ms ease',
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
  wideMessage: any = false;

  apiConfObj: any[] = [
    {
      'api': 'driver',
      'value': 'DRIVER'
    },
    {
      'api' : 'shipper',
      'value' : 'SHIPPER'
    },
    {
      'api' : 'account/login',
      'value' : 'LOGIN'
    },
    {
      'api' : 'broker',
      'value' : 'BROKER'
    },
    {
      'api' : 'trailer',
      'value' : 'TRAILER'
    },
    {
      'api' : 'account/signupcompany',
      'value' : 'COMPANY'
    },
    {
      'api' : 'truck',
      'value' : 'TRUCK'
    },
    {
      'api' : 'owner',
      'value' : 'OWNER'
    },
    {
      'api' : 'companycontact',
      'value' : 'CONTACT'
    },
    {
      'api' : 'cdl',
      'value' : 'CDL'
    },
    {
      'api' : 'rating',
      'value' : 'RATE'
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

  createTitleBasedOnHttpRequest() {
    console.log(this.httpRequest);
    

    let url = this.httpRequest.url.split('/api/');
    let apiEndPoint = url[1];
   
    const item = this.apiConfObj.find((item) => item.api === apiEndPoint || apiEndPoint.indexOf(item.api) > -1 );
    this.actionType = item ? item.value : '';
    
    console.log('---item--', item);
    console.log('---actionType--', this.actionType);
  
    switch (this.httpRequest.method) {
      case 'POST':
        this.actionTitle =  this.actionType == 'LOGIN' ? '' : this.toastrType == 'toast-error' ? 'ADD NEW' : 'ADDED NEW';
      break;
      case 'GET':
        this.actionTitle = this.toastrType == 'toast-error' ? 'LOAD' : 'LOADED';
      break;
      case 'PUT':
        this.actionTitle = this.toastrType == 'toast-error' ? 'REMOVE' : 'REMOVED';
      break;
      case 'DELETE':
        this.actionTitle = this.toastrType == 'toast-error' ? 'DELETE' : 'DELETED';
      break;

    }

    switch (this.actionType) {
      case 'DRIVER':
        this.message = this.httpRequest.body?.firstName + ' ' + this.httpRequest.body?.lastName;
        if ( this.httpRequest.method == 'PUT' ){
          this.actionTitle = this.toastrType == 'toast-error' ? 'UPDATE' : 'UPDATED';
        }
      break;
      case 'RATE':
        this.actionTitle = this.toastrType == 'toast-error' ? 'RATE' : 'RATED';
        switch (this.httpRequest.body?.entityTypeRatingId) {
          case 1:
            this.actionType = 'BROKER';
            this.message = this.httpRequest.body?.tableData.dbaName ? this.httpRequest.body.tableData.dbaName : this.httpRequest.body.tableData.businessName;
            console.log('message', this.message)
          break;
          case 2:
            this.actionType = 'REPAIR SHOP';
          break;
          case 3:
            this.actionType = 'SHIPPER';
          break;
        }
      break;
      case 'CDL':
        this.message = this.httpRequest.body?.firstName + ' ' + this.httpRequest.body?.lastName;
        if ( this.httpRequest.method == 'PUT' ){
          this.actionTitle = this.toastrType == 'toast-error' ? 'ADD NEW' : 'ADDED NEW';
        }
      break;
      case 'SHIPPER':
      case 'BROKER':
        if ( apiEndPoint.indexOf('dnu') > -1 )
          {
            this.actionType = this.toastrType == 'toast-error' ? 'BROKER FROM DNU LIST' : 'BROKER FROM DNU LIST';
            this.wideMessage = true;
          }
        
        this.message = this.httpRequest.body?.dbaName ? this.httpRequest.body.dbaName : this.httpRequest.body.businessName;
      break;
      case 'LOGIN':
        this.message = this.httpRequest.body?.email ? this.httpRequest.body.email : '';
      break;
      case 'TRAILER':
        this.message = this.httpRequest.body?.trailerNumber ? this.httpRequest.body.trailerNumber : '';
      break;
      case 'COMPANY':
        this.message = this.httpRequest.body?.companyName ? this.httpRequest.body.companyName : '';
      break;
      case 'TRUCK':
        this.message = this.httpRequest.body?.truckNumber ? this.httpRequest.body.truckNumber : '';
      break;
      case 'OWNER':
      case 'CONTACT':
        this.message = this.httpRequest.body?.truckNumber ? this.httpRequest.body.truckNumber : '';
      break;
    }

    if (this.actionType == 'DRIVER' && !this.message ) {
      this.message = 'Failed to laod drivers';
    }
    
    if (this.actionType == 'TRAILER' && !this.message ) {
      this.message = 'Failed to laod trailers';
    }
    

  }

  closeToast(): void {
    this.toastPackage.toastRef.close();
  }

  clickOnRetry() {
    this.retryStarted = true;
    this.next.handle(this.httpRequest).subscribe(() => {
      this.notificationService.errorToastr(this.httpRequest, this.next);
    });
  }
}
