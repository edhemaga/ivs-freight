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
import { DetailsDataService } from '../../../services/details-data/details-data.service';
import moment from 'moment';
import { Subject } from 'rxjs';

const routeSpecify = {
    '/api/account/login': 'Driver',
};

@Component({
    selector: 'app-custom-toast-messages',
    templateUrl: './custom-toast-messages.component.html',
    styleUrls: ['./custom-toast-messages.component.scss'],
    animations: [
        trigger('flyInOut', [
            state(
                'inactive',
                style({
                    position: 'relative',
                    top: '100px',
                })
            ),
            transition(
                'inactive => active',
                animate(
                    '230ms ease',
                    keyframes([
                        style({
                            position: 'relative',
                            top: '100px',
                        }),
                        style({
                            position: 'relative',
                            top: '0px',
                        }),
                    ])
                )
            ),

            transition(
                'active => removed',
                animate(
                    '230ms ease',
                    keyframes([
                        style({
                            opacity: 1,
                            position: 'relative',
                            top: '0px',
                        }),
                        style({
                            position: 'relative',
                            top: '100px',
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
    toastrType: string = '';
    retryBtnHovered: boolean = false;
    retryStarted: boolean = false;

    httpRequest: HttpRequest<any>;
    next: HttpHandler;
    errorData: any;

    mainTitle: string = '';
    method: string = '';
    actionTitle: string = '';
    actionType: string = '';
    wideMessage: any = false;
    storesArray: any = JSON.parse(localStorage.getItem('AkitaStores'));

    apiConfObj: any[] = [
        {
            api: 'driver',
            value: 'DRIVER',
        },
        {
            api: 'shipper',
            value: 'SHIPPER',
        },
        {
            api: 'account/login',
            value: 'LOGIN',
        },
        {
            api: 'broker',
            value: 'BROKER',
        },
        {
            api: 'trailer',
            value: 'TRAILER',
        },
        {
            api: 'account/signupcompany',
            value: 'COMPANY',
        },
        {
            api: 'company/documents',
            value: 'DOCUMENT',
        },
        {
            api: 'companycontactlabel',
            value: 'LABEL',
        },
        {
            api: 'companyaccountlabel',
            value: 'LABEL',
        },
        {
            api: 'companyaccount',
            value: 'ACCOUNT',
        },
        {
            api: 'companycontact',
            value: 'CONTACT',
        },
        {
            api: 'companyuser',
            value: 'USER',
        },
        {
            api: 'factoringcompany',
            value: 'FACTORING COMPANY',
        },
        {
            api: 'companyoffice',
            value: 'OFFICE',
        },
        {
            api: 'company',
            value: 'COMPANY',
        },
        {
            api: 'truck',
            value: 'TRUCK',
        },
        {
            api: 'owner',
            value: 'OWNER',
        },
        {
            api: 'cdl',
            value: 'CDL',
        },
        {
            api: 'rating',
            value: 'RATE',
        },
        {
            api: 'repairshop',
            value: 'REPAIR SHOP',
        },
        {
            api: 'mvr',
            value: 'MVR',
        },
        {
            api: 'medical',
            value: 'MEDICAL',
        },
        {
            api: 'repair',
            value: 'REPAIR BILL',
        },
        {
            api: 'registration',
            value: 'REGISTRATION',
        },
        {
            api: 'inspection',
            value: 'INSPECTION',
        },
        {
            api: 'test',
            value: 'TEST',
        },
        {
            api: 'title',
            value: 'TITLE',
        },
        {
            api: 'RatingReview',
            value: 'REVIEW',
        },
        {
            api: 'todo',
            value: 'TASK',
        },
        {
            api: 'Comment',
            value: 'COMMENT',
        },
        {
            api: 'forgotpassword',
            value: 'PASSWORD',
        },
        {
            api: 'note',
            value: 'NOTE',
        },
        {
            api: 'route',
            value: 'ROUTE',
        },
        {
            api: 'map',
            value: 'MAP',
        },
        {
            api: 'stop',
            value: 'STOP',
        },
        {
            api: 'insurancepolicy',
            value: 'INSURANCE POLICY',
        },

        {
            api: 'parking',
            value: 'PARKING',
        },
        {
            api: 'terminal',
            value: 'TERMINAL',
        },
        {
            api: 'load',
            value: 'LOAD',
        },
    ];
    constructor(
        protected toastrService: ToastrService,
        public toastPackage: ToastPackage,
        private notificationService: NotificationService,
        private DetailsDataService: DetailsDataService
    ) {
        super(toastrService, toastPackage);
        this.httpRequest = this.toastPackage.config.payload
            ? this.toastPackage.config.payload?.httpRequest
            : '';
        this.next = this.toastPackage.config.payload
            ? this.toastPackage.config.payload.next
            : '';
        this.errorData = this.toastPackage.config.payload?.error
            ? this.toastPackage.config.payload.error
            : '';
        this.toastrType = this.toastPackage.toastType;
    }

    ngOnInit(): void {
        this.createTitleBasedOnHttpRequest();
    }

    createTitleBasedOnHttpRequest() {
        console.log(this.httpRequest);

        let url = this.httpRequest.url.split('/api/');
        let apiEndPoint = url[1];

        const item = this.apiConfObj.find(
            (item) =>
                item.api === apiEndPoint || apiEndPoint.indexOf(item.api) > -1
        );
        this.actionType = item ? item.value : '';

        let splitUrl = this.httpRequest.url.split('/');
        let splitLength = splitUrl.length;
        let lastPlace = splitLength - 1;
        let lastVal = parseInt(splitUrl[lastPlace]);

        switch (this.httpRequest.method) {
            case 'POST':
                this.actionTitle =
                    this.actionType == 'LOGIN'
                        ? ''
                        : this.toastrType == 'toast-error'
                        ? 'ADD NEW'
                        : 'ADDED NEW';
                break;
            case 'GET':
                this.actionTitle =
                    this.toastrType == 'toast-error' ? 'LOAD' : 'LOADED';
                break;
            case 'PUT':
            case 'PATCH':
                //this.actionTitle = this.toastrType == 'toast-error' ? 'REMOVE' : 'REMOVED';
                this.actionTitle =
                    this.toastrType == 'toast-error' ? 'UPDATE' : 'UPDATED';
                break;
            case 'DELETE':
                this.actionTitle =
                    this.toastrType == 'toast-error' ? 'DELETE' : 'DELETED';
                break;
        }

        if (this.errorData?.error?.error) {
            this.message = this.errorData.error.error;
            return false;
        }

        switch (this.actionType) {
            case 'ACCOUNT':
                let accName = this.DetailsDataService?.mainData
                    ? this.DetailsDataService.mainData?.name
                    : '';
                if (!accName) {
                    accName = this.httpRequest.body?.name
                        ? this.httpRequest.body.name
                        : '';
                }

                if (apiEndPoint.indexOf('companyaccountlabel') > -1) {
                    this.actionType = 'LABEL';
                }

                this.message = accName;
                this.wideMessage = true;
                break;
            case 'LOAD':

                let loadNum = '';
                if ( this.httpRequest.body?.has('referenceNumber') ) {
                    loadNum = this.httpRequest.body.getAll('referenceNumber')[0];
                }

                this.message = loadNum;
                break;
            case 'USER':
                let userName =
                    this.httpRequest.body.firstName +
                    ' ' +
                    this.httpRequest.body.lastName;
                this.message = userName;
                break;
            case 'DRIVER':
                let bodyName = '';

                if ( this.httpRequest.body?.has('firstName') ) {
                    bodyName = this.httpRequest.body.getAll('firstName')[0];
                }

                let bodyLastName = '';
                
                if ( this.httpRequest.body?.has('lastName') ) {
                    bodyLastName = this.httpRequest.body.getAll('lastName')[0];
                }

                let driverNameFull = '';

                if (bodyName && bodyLastName) {
                    driverNameFull = bodyName + ' ' + bodyLastName;
                }

                let active = this.DetailsDataService.mainData?.status ? 1 : 0;
                if (!driverNameFull) {
                    driverNameFull = this.DetailsDataService.mainData?.fullName
                        ? this.DetailsDataService.mainData?.fullName
                        : this.DetailsDataService.mainData?.firstName +
                          ' ' +
                          this.DetailsDataService.mainData?.lastName;
                }

                if (this.httpRequest.method == 'PUT') {
                    if (apiEndPoint.indexOf('status') > -1) {
                        if (active == 1) {
                            this.actionTitle =
                                this.toastrType == 'toast-error'
                                    ? 'DEACTIVE'
                                    : 'DEACTIVATED';
                        } else {
                            this.actionTitle =
                                this.toastrType == 'toast-error'
                                    ? 'ACTIVE'
                                    : 'ACTIVATED';
                        }
                    }
                }
                this.message = driverNameFull;

                break;
            case 'RATE':
                let likedStatus = this.DetailsDataService.mainData.raiting
                    ? this.DetailsDataService.mainData.raiting?.hasLiked
                    : this.DetailsDataService.mainData.shopRaiting?.hasLiked;
                let dislikedStatus = this.DetailsDataService.mainData.raiting
                    ? this.DetailsDataService.mainData.raiting?.hasDislike
                    : this.DetailsDataService.mainData.shopRaiting?.hasDislike;

                if (!likedStatus && !dislikedStatus) {
                    this.actionTitle =
                        this.toastrType == 'toast-error'
                            ? 'REMOVE RATE'
                            : 'REMOVED RATE';
                }
                if (likedStatus || dislikedStatus) {
                    this.actionTitle =
                        this.toastrType == 'toast-error' ? 'RATE' : 'RATED';
                }

                switch (this.httpRequest.body?.entityTypeRatingId) {
                    case 1:
                        this.actionType = 'BROKER';
                        this.message = this.DetailsDataService.mainData?.dbaName
                            ? this.DetailsDataService.mainData?.dbaName
                            : this.DetailsDataService.mainData?.businessName;
                        break;
                    case 2:
                        this.message = this.DetailsDataService.mainData?.name
                            ? this.DetailsDataService.mainData?.name
                            : '';
                        this.actionType = 'REPAIR SHOP';
                        break;
                    case 3:
                        this.actionType = 'SHIPPER';
                        this.message = this.DetailsDataService.mainData
                            ?.businessName
                            ? this.DetailsDataService.mainData?.businessName
                            : '';
                        break;
                }
                break;
            case 'REVIEW':
                this.actionTitle = this.toastrType == 'toast-error' ? 'REVIEW' : 'REVIEWED';
                
                if ( this.httpRequest.body?.id ) {
                    this.actionTitle = this.toastrType == 'toast-error' ? 'UPDATE' : 'UPDATED';
                    this.message = this.httpRequest.body ? this.httpRequest.body?.comment : '';
                }
                
                switch (this.httpRequest.body?.entityTypeReviewId) {
                    case 1:
                        this.actionType = 'BROKER';
                        this.message = this.DetailsDataService.mainData?.dbaName
                            ? this.DetailsDataService.mainData?.dbaName
                            : this.DetailsDataService.mainData?.businessName;
                        break;
                    case 2:
                        this.message = this.DetailsDataService.mainData?.name
                            ? this.DetailsDataService.mainData?.name
                            : '';
                        this.actionType = 'REPAIR SHOP';
                        break;
                    case 3:
                        this.actionType = 'SHIPPER';
                        this.message = this.DetailsDataService.mainData
                            ?.businessName
                            ? this.DetailsDataService.mainData?.businessName
                            : '';
                        break;
                }

                if (this.httpRequest.method == 'DELETE') {
                    this.actionTitle =
                        this.toastrType == 'toast-error'
                            ? 'DELETE REVIEW'
                            : 'DELETED REVIEW';
                    this.actionType = '';

                    if (this.DetailsDataService.mainData?.dbaName) {
                        this.message =
                            this.DetailsDataService.mainData?.dbaName;
                    } else if (this.DetailsDataService.mainData?.businessName) {
                        this.message =
                            this.DetailsDataService.mainData?.businessName;
                    } else {
                        this.message = this.DetailsDataService.mainData?.name;
                    }
                }

                break;
            case 'CDL':
                let driverFullName = this.DetailsDataService.mainData?.fullName
                    ? this.DetailsDataService.mainData?.fullName.toUpperCase()
                    : this.DetailsDataService.mainData?.firstName.toUpperCase() +
                      ' ' +
                      this.DetailsDataService.mainData?.lastName.toUpperCase();
                let cdlNum = ''
                
                if ( this.httpRequest.body?.has('cdlNumber') ) {
                    cdlNum = this.httpRequest.body.getAll('cdlNumber')[0];
                } else {
                    cdlNum = this.DetailsDataService.cardMainTitle;
                }
                
                if (!this.httpRequest.body?.cdlNumber) {
                    let cdlId = lastVal;
                    this.DetailsDataService.mainData?.cdls?.map((item: any) => {
                        if (item.id == cdlId) {
                            cdlNum = item.cdlNumber;
                        }
                    });
                }

                if (this.httpRequest.method == 'POST') {
                    this.actionTitle =
                        this.toastrType == 'toast-error'
                            ? 'ADD NEW'
                            : 'ADDED NEW';
                } else if (this.httpRequest.method == 'PUT') {
                    this.actionTitle =
                        this.toastrType == 'toast-error'
                            ? 'ACTIVATE'
                            : 'ACTIVATED';
                }

                if (apiEndPoint.indexOf('deactivate') > -1) {
                    this.actionTitle =
                        this.toastrType == 'toast-error' ? 'VOID' : 'VOIDED';
                }

                this.actionType = 'CDL - ' + driverFullName;
                this.wideMessage = true;
                this.message = cdlNum;
                break;
            case 'MVR':
            case 'MEDICAL':
                let driverName = this.DetailsDataService.mainData?.fullName
                    ? this.DetailsDataService.mainData?.fullName.toUpperCase()
                    : this.DetailsDataService.mainData?.firstName.toUpperCase() +
                      ' ' +
                      this.DetailsDataService.mainData?.lastName.toUpperCase();

                let dateFromData = '';
                
                if ( this.httpRequest.body?.has('issueDate') ) {
                    dateFromData = this.httpRequest.body.getAll('issueDate')[0];
                }

                
                let issuedDate = dateFromData
                    ? moment(dateFromData).format('MM/DD/YY')
                    : '';
                if (
                    this.httpRequest.method == 'POST' ||
                    this.httpRequest.method == 'PUT'
                ) {
                    this.actionTitle =
                        this.toastrType == 'toast-error'
                            ? 'ADD NEW'
                            : 'ADDED NEW';
                    this.actionType =
                        this.actionType == 'MVR'
                            ? 'MVR - ' + driverName
                            : 'MEDICAL - ' + driverName;
                    this.message = 'Issued: ' + issuedDate;
                }
                break;
            case 'SHIPPER':
            case 'BROKER':
                let messageValue = '';
                if (this.httpRequest.body) {
                    messageValue = this.httpRequest.body.getAll('dbaName')[0]
                        ? this.httpRequest.body.getAll('dbaName')[0]
                        : this.httpRequest.body.getAll('businessName')[0];
                }

                if (!messageValue) {
                    messageValue = this.DetailsDataService.mainData?.dbaName
                        ? this.DetailsDataService.mainData?.dbaName
                        : this.DetailsDataService.mainData?.businessName;
                }

                if (apiEndPoint.indexOf('dnu') > -1) {
                    let moveAction = '';
                    if (this.DetailsDataService.mainData?.dnu) {
                        moveAction = 'TO';
                        this.actionTitle =
                            this.toastrType == 'toast-error' ? 'MOVE' : 'MOVED';
                    } else {
                        moveAction = 'FROM';
                        this.actionTitle =
                            this.toastrType == 'toast-error'
                                ? 'REMOVE'
                                : 'REMOVED';
                    }

                    if (this.toastrType != 'toast-error') {
                        let newStatus = !this.DetailsDataService.mainData?.dnu;
                        this.DetailsDataService.changeDnuStatus(
                            'dnu',
                            newStatus
                        );
                    }

                    this.actionType =
                        this.toastrType == 'toast-error'
                            ? 'BROKER ' + moveAction + ' DNU LIST'
                            : 'BROKER ' + moveAction + ' DNU LIST';
                    this.wideMessage = true;
                }

                if (apiEndPoint.indexOf('ban') > -1) {
                    let moveAction = '';
                    if (this.DetailsDataService.mainData?.ban) {
                        moveAction = 'TO';
                        this.actionTitle =
                            this.toastrType == 'toast-error' ? 'MOVE' : 'MOVED';
                    } else {
                        moveAction = 'FROM';
                        this.actionTitle =
                            this.toastrType == 'toast-error'
                                ? 'REMOVE'
                                : 'REMOVED';
                    }

                    if (this.toastrType != 'toast-error') {
                        let newBanStatus =
                            !this.DetailsDataService.mainData?.ban;
                        this.DetailsDataService.changeDnuStatus(
                            'ban',
                            newBanStatus
                        );
                    }

                    this.actionType =
                        this.toastrType == 'toast-error'
                            ? 'BROKER ' + moveAction + ' BAN LIST'
                            : 'BROKER ' + moveAction + ' BAN LIST';
                    this.wideMessage = true;
                }

                this.message = messageValue;
                break;
            case 'LOGIN':
                this.actionType =
                    this.toastrType == 'toast-error' ? 'LOGIN' : 'LOGGED IN';
                let errorMessage = this.errorData?.error?.error
                    ? this.errorData.error.error
                    : 'Error occurred';
                this.message = errorMessage;
                break;
            case 'TRAILER':
                let trailerNum = '';
                
                if ( this.httpRequest.body?.has('trailerNumber') ) {
                    trailerNum = this.httpRequest.body.getAll('trailerNumber')[0];
                }
                
                let activeTrailer = this.DetailsDataService.mainData?.status
                    ? true
                    : false;
                if (!trailerNum) {
                    trailerNum =
                        this.DetailsDataService.mainData?.trailerNumber;
                }

                if (apiEndPoint.indexOf('status') > -1) {
                    if (activeTrailer) {
                        this.actionTitle =
                            this.toastrType == 'toast-error'
                                ? 'DEACTIVE'
                                : 'DEACTIVATED';
                    } else {
                        this.actionTitle =
                            this.toastrType == 'toast-error'
                                ? 'ACTIVE'
                                : 'ACTIVATED';
                    }

                    if (this.toastrType != 'toast-error') {
                        let newActiveStatus = 1;
                        if (this.DetailsDataService.mainData.status == 1) {
                            newActiveStatus = 0;
                        }
                        this.DetailsDataService.changeDnuStatus(
                            'status',
                            newActiveStatus
                        );
                    }
                }
                this.message = trailerNum;
                break;
            case 'COMPANY':
                let compName = this.httpRequest.body?.companyName
                    ? this.httpRequest.body.companyName
                    : '';

                if (!compName) {
                    compName = this.DetailsDataService?.mainData?.companyName
                        ? this.DetailsDataService?.mainData?.companyName
                        : this.DetailsDataService?.mainData?.name;
                }

                this.message = compName;

                break;
            case 'TRUCK':
                let truckNum = '';
                
                if ( this.httpRequest.body?.has('truckNumber') ) {
                    truckNum = this.httpRequest.body.getAll('truckNumber')[0];
                }
                
                let activeTruck = this.DetailsDataService.mainData?.status
                    ? true
                    : false;
                if (!truckNum) {
                    truckNum = this.DetailsDataService.mainData?.truckNumber;
                }
                if (apiEndPoint.indexOf('status') > -1) {
                    if (activeTruck) {
                        this.actionTitle =
                            this.toastrType == 'toast-error'
                                ? 'DEACTIVE'
                                : 'DEACTIVATED';
                    } else {
                        this.actionTitle =
                            this.toastrType == 'toast-error'
                                ? 'ACTIVE'
                                : 'ACTIVATED';
                    }

                    if (this.toastrType != 'toast-error') {
                        let newActiveStatus = 1;
                        if (this.DetailsDataService.mainData.status == 1) {
                            newActiveStatus = 0;
                        }
                        this.DetailsDataService.changeDnuStatus(
                            'status',
                            newActiveStatus
                        );
                    }
                }
                this.message = truckNum;
                break;
            case 'OWNER':
                let name = '';

                if ( this.httpRequest.body?.has('name') ) {
                    name = this.httpRequest.body.getAll('name')[0]
                }

                if (!name) {
                    name = this.DetailsDataService.mainData?.name;
                }

                if (apiEndPoint.indexOf('verifyowner') > -1) {
                    this.actionType = 'ACCOUNT';
                    let thankYouEmail = localStorage.getItem('thankYouEmail')
                        ? JSON.parse(localStorage.getItem('thankYouEmail'))
                        : '';
                    if (thankYouEmail) {
                        name = thankYouEmail;
                    }

                    this.actionTitle =
                        this.toastrType == 'toast-error'
                            ? 'VERIFY'
                            : 'VERIFIED';
                }

                this.message = name;
                break;
            case 'CONTACT':
                let contactName = this.httpRequest.body?.name
                    ? this.httpRequest.body.name
                    : '';
                if (!contactName) {
                    contactName = this.DetailsDataService.mainData?.name;
                }

                if (apiEndPoint.indexOf('companycontactlabel') > -1) {
                    this.actionType = 'LABEL';
                }
                this.message = contactName;
                break;
            case 'REPAIR SHOP':
                let shopName = '';

                if ( this.httpRequest.body?.has('name') ) {
                    shopName = this.httpRequest.body.getAll('name')[0];
                }
                
                if (!shopName) {
                    shopName = this.DetailsDataService.mainData?.name;
                }
                this.message = shopName;
                break;
            case 'REPAIR BILL':
            case 'REGISTRATION':
            case 'TITLE':
                let messageText = '';
                if (
                    this.httpRequest.body.getAll('unitType')[0] == 'Truck' ||
                    this.httpRequest.body.getAll('truckId')[0]
                ) {
                    let repairTruckNum = this.DetailsDataService.mainData
                        ?.truckNumber
                        ? this.DetailsDataService.mainData?.truckNumber
                        : '';
                    messageText = 'Truck - ' + repairTruckNum;
                } else if (
                    this.httpRequest.body.getAll('unitType')[0] == 'Trailer' ||
                    this.httpRequest.body.getAll('trailerId')
                ) {
                    let repairTrailerNum = this.DetailsDataService.mainData
                        ?.trailerNumber
                        ? this.DetailsDataService.mainData?.trailerNumber
                        : '';
                    messageText = 'Trailer - ' + repairTrailerNum;
                }

                //this.wideMessage = true;
                this.message = messageText;
                break;
            case 'INSPECTION':
                let inspectionDate = this.httpRequest.body?.issueDate
                    ? moment(this.httpRequest.body?.issueDate).format(
                          'MM/DD/YY'
                      )
                    : '';

                if (inspectionDate) {
                    this.message = 'Issued: ' + inspectionDate;
                } else {
                    if (this.DetailsDataService.mainData?.truckNumber) {
                        let repairTruckNum =
                            this.DetailsDataService.mainData?.truckNumber;
                        this.message = 'Truck - ' + repairTruckNum;
                    } else if (
                        this.DetailsDataService.mainData?.trailerNumber
                    ) {
                        let repairTrailerNum =
                            this.DetailsDataService.mainData?.trailerNumber;
                        this.message = 'Trailer - ' + repairTrailerNum;
                    }
                }

                break;
            case 'TEST':
                let testName = this.DetailsDataService.mainData.fullName
                    ? this.DetailsDataService.mainData.fullName
                    : this.DetailsDataService.mainData.firstName +
                      ' ' +
                      this.DetailsDataService.mainData.lastName;
                this.message = testName;
                break;
            case 'TASK':
                let toDoName = '';
                
                if (!this.httpRequest.body.id) {
                    toDoName = this.httpRequest.body.getAll('title')[0];
                }

                if (!toDoName) {
                    toDoName = this.DetailsDataService.mainData?.title;
                }

                this.message = toDoName;
                break;
            case 'COMMENT':
                this.message = this.DetailsDataService.mainData?.title;
                break;
            case 'PASSWORD':
                this.message = this.errorData.error.error
                    ? this.errorData.error.error
                    : '';
                break;
            case 'NOTE':
                let noteName = '';
                if (this.httpRequest.body.entityTypeNote == 'Driver') {
                    noteName = this.DetailsDataService.mainData.fullName
                        ? this.DetailsDataService.mainData.fullName
                        : this.DetailsDataService.mainData.firstName +
                          ' ' +
                          this.DetailsDataService.mainData.lastName;
                } else if (this.httpRequest.body.entityTypeNote == 'Truck') {
                    let noteTruckNum =
                        this.DetailsDataService.mainData?.truckNumber;
                    noteName = 'Truck - ' + noteTruckNum;
                } else if (this.httpRequest.body.entityTypeNote == 'Trailer') {
                    let noteTrailerNum =
                        this.DetailsDataService.mainData?.trailerNumber;
                    noteName = 'Trailer - ' + noteTrailerNum;
                } else if (this.httpRequest.body.entityTypeNote == 'Test') {
                    let testId = this.httpRequest.body?.entityId;
                    let testDate;

                    this.DetailsDataService?.mainData?.tests.map((item) => {
                        if (item.id == testId) {
                            testDate = moment(item.testingDate).format(
                                'MM/DD/YY'
                            );
                        }
                    });
                    noteName = 'Test - ' + testDate;
                } else if (this.httpRequest.body.entityTypeNote == 'Cdl') {
                    let noteCdlId = this.httpRequest.body?.entityId;
                    let noteCdlNum;

                    this.DetailsDataService?.mainData?.cdls.map((item) => {
                        if (item.id == noteCdlId) {
                            noteCdlNum = item.cdlNumber;
                        }
                    });
                    noteName = 'Cdl - ' + noteCdlNum;
                } else if (this.httpRequest.body.entityTypeNote == 'Medical') {
                    let noteMedicalId = this.httpRequest.body?.entityId;
                    let noteMedicalDate;
                    this.DetailsDataService?.mainData?.medicals.map((item) => {
                        if (item.id == noteMedicalId) {
                            noteMedicalDate = moment(item.issueDate).format(
                                'MM/DD/YY'
                            );
                        }
                    });

                    noteName = 'Medical - ' + noteMedicalDate;
                } else if (this.httpRequest.body.entityTypeNote == 'Mvr') {
                    let noteMvrId = this.httpRequest.body?.entityId;
                    let noteMvrDate;

                    this.DetailsDataService?.mainData?.mvrs.map((item) => {
                        if (item.id == noteMvrId) {
                            noteMvrDate = moment(item.issueDate).format(
                                'MM/DD/YY'
                            );
                        }
                    });
                    noteName = 'Medical - ' + noteMvrDate;
                }

                this.message = noteName;
                break;
            case 'ROUTE':
                let routeName = this.httpRequest.body?.name
                    ? this.httpRequest.body?.name
                    : this.DetailsDataService.mainData.name;
                this.message = routeName;
                break;
            case 'MAP':
                let mapName = this.httpRequest.body.name;
                this.message = mapName;
                break;
            case 'STOP':
                let stopName = this.DetailsDataService.stopName
                    ? this.DetailsDataService.stopName
                    : '';
                this.message = stopName;
                break;
            case 'INSURANCE POLICY':
                let producerName = this.httpRequest.body?.producerName
                    ? this.httpRequest.body?.producerName
                    : this.DetailsDataService.cardMainTitle;
                this.message = producerName;
                break;
            case 'FACTORING COMPANY':
                let factoringCompanyName = this.httpRequest.body?.name
                    ? this.httpRequest.body?.name
                    : this.DetailsDataService.cardMainTitle;
                this.message = factoringCompanyName;
                break;
            case 'PARKING':
                let parkingName = this.httpRequest.body?.name
                    ? this.httpRequest.body?.name
                    : this.DetailsDataService.cardMainTitle;
                this.message = parkingName;
                break;
            case 'OFFICE':
                let officeName = this.httpRequest.body?.name
                    ? this.httpRequest.body?.name
                    : this.DetailsDataService.cardMainTitle;
                this.message = officeName;
                break;
            case 'TERMINAL':
                let terminalName = this.httpRequest.body?.name
                    ? this.httpRequest.body?.name
                    : this.DetailsDataService.cardMainTitle;
                this.message = terminalName;
                break;
            case 'LABEL':
                let labelName = this.httpRequest.body?.name
                    ? this.httpRequest.body?.name
                    : '';
                this.message = labelName;
                break;
            case 'DOCUMENT':
                let fileName = '';
                if (this.httpRequest.body.getAll('filesForDeleteIds')[0]) {
                    this.actionTitle =
                        this.toastrType == 'toast-error' ? 'DELETE' : 'DELETED';
                    fileName = this.DetailsDataService.documentName;
                }

                if (this.httpRequest.body.getAll('files')[0]) {
                    fileName = this.httpRequest.body.getAll('files')[0]['name'];
                }

                this.message = fileName;
                break;
        }

        if (this.actionType == 'DRIVER' && !this.message) {
            this.message = 'Failed to laod drivers';
        }

        if (this.actionType == 'TRAILER' && !this.message) {
            this.message = 'Failed to laod trailers';
        }
    }

    closeToast(): void {
        this.toastrService.clear(this.toastPackage.toastId);
    }

    clickOnRetry() {
        this.retryStarted = true;
        this.next.handle(this.httpRequest).subscribe(() => {
            this.notificationService.errorToastr(this.httpRequest, this.next);
        });
    }
}
