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
import moment from 'moment';
import { data } from 'jquery';


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
  storesArray: any = JSON.parse(localStorage.getItem('AkitaStores'));

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
    {
      'api' : 'companyaccount',
      'value' : 'ACCOUNT'
    },
    {
      'api' : 'repairshop',
      'value' : 'REPAIR SHOP'
    },
    {
      'api' : 'mvr',
      'value' : 'MVR'
    },
    {
      'api' : 'medical',
      'value' : 'MEDICAL',
    },
    {
      'api' : 'repair',
      'value' : 'REPAIR BILL'
    },
    {
      'api' : 'registration',
      'value' : 'REGISTRATION'
    },
    {
      'api' : 'inspection',
      'value' : 'INSPECTION',
    }
    
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
    
    let splitUrl = this.httpRequest.url.split('/');
    let splitLength = splitUrl.length;
    let lastPlace = splitLength - 1;
    let lastVal = parseInt(splitUrl[lastPlace]);

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
      case 'ACCOUNT':
        if ( this.httpRequest.method == 'PUT' ) {
          this.actionTitle = this.toastrType == 'toast-error' ? 'UPDATE' : 'UPDATED';
        }
        this.message = this.httpRequest.body?.name ? this.httpRequest.body.name : '';
        this.wideMessage = true;
      break;
      case 'DRIVER':
        this.message = this.httpRequest.body?.firstName ? this.httpRequest.body?.firstName : '' + ' ' + this.httpRequest.body?.lastName ? this.httpRequest.body?.lastName : '';
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
          break;
          case 2:
            this.message = this.httpRequest.body?.tableData.name ? this.httpRequest.body.tableData.name : '';
            this.actionType = 'REPAIR SHOP';
          break;
          case 3:
            this.actionType = 'SHIPPER';
            this.message = this.httpRequest.body?.tableData.businessName ? this.httpRequest.body.tableData.businessName : '';
          break;
        }
      break;
      case 'CDL':
        let dId = this.httpRequest.body?.driverId;
        let driverFullName = '';
        
        if (dId){
          driverFullName = this.storesArray.driverActive.entities[dId].fullName;
        }
        
        this.message = this.httpRequest.body?.cdlNumber ? this.httpRequest.body?.cdlNumber : '';
        if ( this.httpRequest.method == 'POST' || this.httpRequest.method == 'PUT' ){
          this.actionTitle = this.toastrType == 'toast-error' ? 'ADD NEW' : 'ADDED NEW';
          this.actionType = !dId ? 'CDL' : 'CDL - ' + driverFullName;
        }
      break;
      case 'MVR':
      case 'MEDICAL':   
        let driverId = this.httpRequest.body?.driverId;
        let driverName = this.storesArray.driverActive.entities[driverId].fullName;
        if ( !driverName ){
          driverName = this.storesArray.driverInactive.entities[driverId].fullName;
        }
        
        let issuedDate = this.httpRequest.body?.issueDate ? moment(this.httpRequest.body?.issueDate).format('MM/DD/YY') : '';
        if ( this.httpRequest.method == 'POST' ) {
          this.actionTitle = this.toastrType == 'toast-error' ? 'ADD NEW' : 'ADDED NEW';
          this.actionType = this.actionType == 'MVR' ? 'MVR - ' : 'MEDICAL - ' + driverName;
          this.message = 'Issued: ' + issuedDate;
        }
      break;
      case 'SHIPPER':
      case 'BROKER':
       let messageValue = '';
       let dataValue;
       if ( this.httpRequest.body ){
        messageValue = this.httpRequest.body.dbaName ? this.httpRequest.body.dbaName : this.httpRequest.body.businessName;
       }
      
        if ( !isNaN(lastVal) ){ 
          if ( this.storesArray.broker.entities[lastVal] || this.storesArray.shipper.entities[lastVal] ){
            dataValue = this.actionType == 'BROKER' ? this.storesArray.broker.entities[lastVal] : this.storesArray.broker.entities[lastVal];
            if ( !messageValue ){
              messageValue = dataValue.dbaName ? dataValue.dbaName : dataValue.businessName;
            }
          }
        }

        if ( apiEndPoint.indexOf('dnu') > -1 )
          {
            let moveAction = '';
            if ( dataValue.dnu ){
              moveAction = 'FROM';
              
            } else {
              moveAction = 'TO';
              this.actionTitle = this.toastrType == 'toast-error' ? 'MOVE' : 'MOVED';
            }

            this.actionType = this.toastrType == 'toast-error' ? 'BROKER ' + moveAction + ' DNU LIST' : 'BROKER ' + moveAction + ' DNU LIST';
            this.wideMessage = true;
          }

        if ( apiEndPoint.indexOf('ban') > -1 )
          {
            let moveAction = '';
            if ( dataValue.ban ){
              moveAction = 'FROM';
              
            } else {
              moveAction = 'TO';
              this.actionTitle = this.toastrType == 'toast-error' ? 'MOVE' : 'MOVED';
            }

            this.actionType = this.toastrType == 'toast-error' ? 'BROKER ' + moveAction + ' BAN LIST' : 'BROKER ' + moveAction + ' BAN LIST';
            this.wideMessage = true;
          }  
        
        this.message = messageValue;
      break;
      case 'LOGIN':
        this.message = this.httpRequest.body?.email ? this.httpRequest.body.email : '';
      break;
      case 'TRAILER':
        let trailerNum = this.httpRequest.body?.trailerNumber ? this.httpRequest.body.trailerNumber : '';
        if (!trailerNum){
          if ( !isNaN(lastVal) ){
            let trailerNum = this.storesArray.trailerActive.entities[lastVal] ? this.storesArray.trailerActive.entities[lastVal].trailerNumber : '';
            if ( !trailerNum ) {
              trailerNum = this.storesArray.truckInactive.entities[lastVal].trailerNumber;
            }
          }
        }
        this.message = trailerNum;
      break;
      case 'COMPANY':
        this.message = this.httpRequest.body?.companyName ? this.httpRequest.body.companyName : '';
      break;
      case 'TRUCK':
        let truckNum = this.httpRequest.body?.truckNumber ? this.httpRequest.body.truckNumber : '';
        if (!truckNum){
          if ( !isNaN(lastVal) ){
            truckNum = this.storesArray.truckActive.entities[lastVal] ? this.storesArray.truckActive.entities[lastVal].truckNumber : '';
            if ( !truckNum ){
              truckNum = this.storesArray.truckInactive.entities[lastVal].truckNumber;
            } 
          }
        }
        this.message = truckNum;
      break;
      case 'OWNER':
        let name = this.httpRequest.body?.name ? this.httpRequest.body.name : '';
        if ( !name ) { 
          if ( !isNaN(lastVal) ){
            name = this.storesArray.ownerActive.entities[lastVal].name ? this.storesArray.ownerActive.entities[lastVal].name : '';
            if ( !name ) {
              name = this.storesArray.ownerInactive.entities[lastVal].name;
            }
          }
         }
        this.message = name;
      break;
      case 'CONTACT':
        let contactName = this.httpRequest.body?.name ? this.httpRequest.body.name : '';
        if ( !contactName ) { 
          if ( !isNaN(lastVal) ) {
            contactName = this.storesArray.contact.entities[lastVal].name ? this.storesArray.contact.entities[lastVal].name : '';
          }
         }
        this.message = contactName;
      break;
      case 'REPAIR SHOP':
         let shopName = this.httpRequest.body?.name ? this.httpRequest.body.name : '';
         if ( !shopName ){
          if ( !isNaN(lastVal) ) {
            shopName = this.storesArray.repairShop.entities[lastVal].name ? this.storesArray.contact.entities[lastVal].name : ''; 
          }
         }
         this.message = shopName;
      break;
      case 'REPAIR BILL':
      case 'REGISTRATION':
         let messageText = '';

         if ( this.httpRequest.body?.truckId ){
            let repairTruckId = this.httpRequest.body?.truckId;
            let repairTruckNum = this.storesArray.truckActive.entities[repairTruckId] ? this.storesArray.truckActive.entities[repairTruckId].truckNumber : '';
            if ( !repairTruckNum ) {
              repairTruckNum = this.storesArray.truckInactive.entities[repairTruckId].truckNumber;
            }

            messageText = 'Truck - ' + repairTruckNum;
         }
         else if ( this.httpRequest.body?.trailerId ) {
            let repairTrailerId = this.httpRequest.body?.truckId;
            let repairTrailerNum = this.storesArray.trailerActive.entities[repairTrailerId] ? this.storesArray.trailerActive.entities[repairTrailerId].trailerNumber : '';
            if ( !repairTrailerNum ) {
              repairTrailerNum = this.storesArray.truckInactive.entities[repairTrailerId].trailerNumber;
            }

            messageText = 'Trailer - ' + repairTrailerNum;
         }

         this.wideMessage = true;
         this.message = messageText;
      break;
      case 'INSPECTION': 
         let inspectionDate = this.httpRequest.body?.issueDate ? moment(this.httpRequest.body?.issueDate).format('MM/DD/YY') : '';
         this.message = 'Issued: ' + inspectionDate;
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
