import { Component, OnInit, OnDestroy } from '@angular/core';
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
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import moment from 'moment';
import { data } from 'jquery';
import { Subject, takeUntil } from 'rxjs';


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
          '150ms ease-in-out',
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
  private destroy$ = new Subject<void>();
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
  leftSideMove: any = false;

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
    },
    {
      'api' : 'test',
      'value' : 'TEST'
    },
    {
      'api' : 'title',
      'value' : 'TITLE'
    },
    {
      'api' : 'RatingReview',
      'value' : 'REVIEW'
    },
    {
      'api' : 'todo',
      'value' : 'TO-DO'
    },
    {
      'api' : 'Comment',
      'value' : 'COMMENT'
    }
    
  ]
  constructor(
    protected toastrService: ToastrService,
    public toastPackage: ToastPackage,
    private notificationService: NotificationService,
    private DetailsDataService: DetailsDataService,
  ) {
    super(toastrService, toastPackage);
    this.httpRequest = this.toastPackage.config.payload.httpRequest;
    this.next = this.toastPackage.config.payload.next;
    this.toastrType = this.toastPackage.toastType;
  }

  ngOnInit(): void {
    this.createTitleBasedOnHttpRequest();


    this.DetailsDataService.leftSideMenuChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((response: boolean) => {
        if ( this.actionType != 'LOGIN' ){
          this.leftSideMove = response;
        }
      });
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
    if (this.actionType == 'LOGIN' || this.actionType == 'COMPANY') {
      this.leftSideMove = false;
    }
  
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
        let accName = this.httpRequest.body?.name ? this.httpRequest.body.name : '';
        if (!accName){
          accName = this.DetailsDataService.mainData?.name;
        }
        this.message = accName;
        this.wideMessage = true;
      break;
      case 'DRIVER':
      let driverNameFull = this.httpRequest.body?.firstName ? this.httpRequest.body?.firstName : '' + ' ' + this.httpRequest.body?.lastName ? this.httpRequest.body?.lastName : '';
      let active = this.DetailsDataService.mainData?.status ? 1 : 0;
      
      if (!driverNameFull){
          driverNameFull = this.DetailsDataService.mainData?.fullName;
        }

      if ( this.httpRequest.method == 'PUT' ){
        this.actionTitle = this.toastrType == 'toast-error' ? 'UPDATE' : 'UPDATED';

        if ( apiEndPoint.indexOf('status') > -1 ) {

          if ( active == 1 ) {
            this.actionTitle = this.toastrType == 'toast-error' ? 'DEACTIVE' : 'DEACTIVATED';
          } else {
            this.actionTitle = this.toastrType == 'toast-error' ? 'ACTIVE' : 'ACTIVATED';
          }
        }
      }
      this.message = driverNameFull;

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
      case 'REVIEW':
        this.actionTitle = this.toastrType == 'toast-error' ? 'REVIEW' : 'REVIEWED';
        switch (this.httpRequest.body?.entityTypeReviewId) {
          case 1:
            this.actionType = 'BROKER';
            this.message = this.DetailsDataService.mainData?.dbaName ? this.DetailsDataService.mainData?.dbaName : this.DetailsDataService.mainData?.businessName; 
          break;
          case 2:
            this.message = this.DetailsDataService.mainData?.name ? this.DetailsDataService.mainData?.name : '';
            this.actionType = 'REPAIR SHOP';
          break;
          case 3:
            this.actionType = 'SHIPPER';
            this.message = this.DetailsDataService.mainData?.businessName ? this.DetailsDataService.mainData?.businessName : '';
          break;
        }

        if ( this.httpRequest.method == 'DELETE'){
          this.actionTitle = this.toastrType == 'toast-error' ? 'DELETE REVIEW' : 'DELETED REVIEW';
          this.actionType = '';

          if ( this.DetailsDataService.mainData?.dbaName ) {
            this.message = this.DetailsDataService.mainData?.dbaName;
          } else if ( this.DetailsDataService.mainData?.businessName ) {
            this.message = this.DetailsDataService.mainData?.businessName;
          } else {
            this.message = this.DetailsDataService.mainData?.name; 
          }
          
        }

      break;
      case 'CDL':
        let driverFullName = this.DetailsDataService.mainData?.fullName.toUpperCase();
        let cdlNum = this.httpRequest.body?.cdlNumber ? this.httpRequest.body?.cdlNumber : ''; 
        
        if ( !cdlNum ){
          let cdlId = lastVal;
          this.DetailsDataService.mainData?.cdls.map((item: any) => {
            if (item.id == cdlId){
              cdlNum = item.cdlNumber;
            }
          });
        }

        if ( this.httpRequest.method == 'POST' ){
          this.actionTitle = this.toastrType == 'toast-error' ? 'ADD NEW' : 'ADDED NEW';
        } else if ( this.httpRequest.method == 'PUT') {
          this.actionTitle = this.toastrType == 'toast-error' ? 'ACTIVATE' : 'ACTIVATED';
        }

        this.actionType = 'CDL - ' + driverFullName;
        this.wideMessage = true;
        this.message = cdlNum;
      break;
      case 'MVR':
      case 'MEDICAL':   
        let driverName = this.DetailsDataService.mainData?.fullName.toUpperCase(); 
        
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
       if ( this.httpRequest.body ){
        messageValue = this.httpRequest.body.dbaName ? this.httpRequest.body.dbaName : this.httpRequest.body.businessName;
       }
      
      if (!messageValue){
        messageValue = this.DetailsDataService.mainData?.dbaName ? this.DetailsDataService.mainData?.dbaName : this.DetailsDataService.mainData?.businessName;
      }
      

        if ( apiEndPoint.indexOf('dnu') > -1 )
          {
            let moveAction = '';
            if ( this.DetailsDataService.mainData?.dnu ){
              moveAction = 'FROM';
              
            } else {
              moveAction = 'TO';
              this.actionTitle = this.toastrType == 'toast-error' ? 'MOVE' : 'MOVED';
            }
            
            if (this.toastrType != 'toast-error'){
              let newStatus = !this.DetailsDataService.mainData?.dnu;
              this.DetailsDataService.changeDnuStatus('dnu', newStatus);
            }
            
            this.actionType = this.toastrType == 'toast-error' ? 'BROKER ' + moveAction + ' DNU LIST' : 'BROKER ' + moveAction + ' DNU LIST';
            this.wideMessage = true;
          }

        if ( apiEndPoint.indexOf('ban') > -1 )
          {
            let moveAction = '';
            if ( this.DetailsDataService.mainData?.ban ){
              moveAction = 'FROM';
              
            } else {
              moveAction = 'TO';
              this.actionTitle = this.toastrType == 'toast-error' ? 'MOVE' : 'MOVED';
            }

            if (this.toastrType != 'toast-error'){
              let newBanStatus = !this.DetailsDataService.mainData?.ban;
              this.DetailsDataService.changeDnuStatus('ban', newBanStatus);
            }

            this.actionType = this.toastrType == 'toast-error' ? 'BROKER ' + moveAction + ' BAN LIST' : 'BROKER ' + moveAction + ' BAN LIST';
            this.wideMessage = true;
          } 
          
        if ( this.httpRequest.method == 'PUT' && apiEndPoint.indexOf('ban') == -1 && apiEndPoint.indexOf('dnu') == -1 ) {
          this.actionTitle = this.toastrType == 'toast-error' ? 'UPDATE' : 'UPDATED';
        }  
        
        this.message = messageValue;
      break;
      case 'LOGIN':
        this.message = this.httpRequest.body?.email ? this.httpRequest.body.email : '';
      break;
      case 'TRAILER':
        let trailerNum = this.httpRequest.body?.trailerNumber ? this.httpRequest.body.trailerNumber : '';
        let activeTrailer = this.DetailsDataService.mainData?.status ? true : false;
        if (!trailerNum){
          trailerNum = this.DetailsDataService.mainData?.trailerNumber;
        }

        if ( apiEndPoint.indexOf('status') > -1 ) {
          if ( activeTrailer ) {
            this.actionTitle = this.toastrType == 'toast-error' ? 'DEACTIVE' : 'DEACTIVATED';
          } else {
            this.actionTitle = this.toastrType == 'toast-error' ? 'ACTIVE' : 'ACTIVATED';
          }

          if (this.toastrType != 'toast-error'){
            let newActiveStatus = 1;
            if ( this.DetailsDataService.mainData.status == 1 ){
              newActiveStatus = 0;
            }
            this.DetailsDataService.changeDnuStatus('status', newActiveStatus);
          }
        }
        this.message = trailerNum;
      break;
      case 'COMPANY':
        let compName =  this.httpRequest.body?.companyName ? this.httpRequest.body.companyName : '';

        if (!compName){
          compName = this.DetailsDataService.mainData.companyName;
        }

        this.message = compName;
        
      break;
      case 'TRUCK':
        let truckNum = this.httpRequest.body?.truckNumber ? this.httpRequest.body.truckNumber : '';
        let activeTruck = this.DetailsDataService.mainData?.status ? true : false;
        if (!truckNum){
          truckNum = this.DetailsDataService.mainData?.truckNumber;
        }
        if ( apiEndPoint.indexOf('status') > -1 ) {
          if ( activeTruck ) {
            this.actionTitle = this.toastrType == 'toast-error' ? 'DEACTIVE' : 'DEACTIVATED';
          } else {
            this.actionTitle = this.toastrType == 'toast-error' ? 'ACTIVE' : 'ACTIVATED';
          }

          if (this.toastrType != 'toast-error'){
            let newActiveStatus = 1;
            if ( this.DetailsDataService.mainData.status == 1 ){
              newActiveStatus = 0;
            }
            this.DetailsDataService.changeDnuStatus('status', newActiveStatus);
          }
        }
        this.message = truckNum;
      break;
      case 'OWNER':
        let name = this.httpRequest.body?.name ? this.httpRequest.body.name : '';
        if ( !name ) { 
          name = this.DetailsDataService.mainData?.name;
         }
        this.message = name;
      break;
      case 'CONTACT':
        let contactName = this.httpRequest.body?.name ? this.httpRequest.body.name : '';
        if ( !contactName ) { 
          contactName = this.DetailsDataService.mainData?.name;
         }
        this.message = contactName;
      break;
      case 'REPAIR SHOP':
         let shopName = this.httpRequest.body?.name ? this.httpRequest.body.name : '';
         if ( !shopName ){
            shopName = this.DetailsDataService.mainData?.name;
         }
         this.message = shopName;
      break;
      case 'REPAIR BILL':
      case 'REGISTRATION':
      case 'TITLE':
         let messageText = '';

         if ( this.DetailsDataService.mainData?.truckNumber ){
            let repairTruckNum = this.DetailsDataService.mainData?.truckNumber;
            messageText = 'Truck - ' + repairTruckNum;
         }
         else if ( this.DetailsDataService.mainData?.trailerNumber ) {
            let repairTrailerNum = this.DetailsDataService.mainData?.trailerNumber;
            messageText = 'Trailer - ' + repairTrailerNum;
         }

         //this.wideMessage = true;
         this.message = messageText;
      break;
      case 'INSPECTION': 
         let inspectionDate = this.httpRequest.body?.issueDate ? moment(this.httpRequest.body?.issueDate).format('MM/DD/YY') : '';
         this.message = 'Issued: ' + inspectionDate;
      break;
      case 'TEST' :
        let testName = this.DetailsDataService.mainData.fullName;
        this.message = testName;   
      break;
      case 'TO-DO':
        let toDoName = this.httpRequest.body?.title ? this.httpRequest.body?.title : '';
        if (!toDoName){
          toDoName = this.DetailsDataService.mainData?.title;
        }

        if ( this.httpRequest.method == 'PUT' ){
          this.actionTitle = this.toastrType == 'toast-error' ? 'UPDATE' : 'UPDATED';
        }
        this.message = toDoName;  
      break;
      case 'COMMENT' : 
        this.message = this.DetailsDataService.mainData?.title;    
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
    let mainToastElement = document.querySelectorAll('.main-toast-holder')[0];
    mainToastElement?.classList.add('closeToastAction');
    setTimeout(()=>{
      this.toastPackage.toastRef.close();
    },150)
    
  }

  clickOnRetry() {
    this.retryStarted = true;
    this.next.handle(this.httpRequest).subscribe(() => {
      this.notificationService.errorToastr(this.httpRequest, this.next);
    });
  }
}
