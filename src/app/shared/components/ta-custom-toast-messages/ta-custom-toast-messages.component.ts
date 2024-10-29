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
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// time
import moment from 'moment';

// services
import { NotificationService } from '@shared/services/notification.service';
import { DetailsDataService } from '@shared/services/details-data.service';

// components
import { TaSpinnerComponent } from '@shared/components/ta-spinner/ta-spinner.component';

// icon
import { AngularSvgIconModule } from 'angular-svg-icon';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';

@Component({
    selector: 'app-ta-custom-toast-messages',
    templateUrl: './ta-custom-toast-messages.component.html',
    styleUrls: ['./ta-custom-toast-messages.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TaSpinnerComponent,
        AngularSvgIconModule,
        ReactiveFormsModule,
    ],
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
export class TaCustomToastMessagesComponent extends Toast implements OnInit {
    toastrType: string = '';
    retryBtnHovered: boolean = false;
    retryStarted: boolean = false;

    httpRequest: HttpRequest<any>;
    next: HttpHandler;
    errorData: any;

    mainTitle: any = '';
    method: string = '';
    actionTitle: any = '';
    actionType: string = '';
    wideMessage: any = false;
    storesArray: any = JSON.parse(localStorage.getItem('AkitaStores'));

    manuallyStarted: any = false;

    responseMessage: string = '';

    apiConfObj: any[] = [
        {
            api: 'driver/status/list',
            value: 'DRIVERS',
        },
        {
            api: 'driver',
            value: 'DRIVER',
        },
        {
            api: 'shipper/contact',
            value: 'SHIPPER CONTACT',
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
            api: 'broker/availablecredit',
            value: 'CREDIT',
        },
        {
            api: 'broker/contact',
            value: 'BROKER CONTACT',
        },
        {
            api: 'broker',
            value: 'BROKER',
        },
        {
            api: 'assign',
            value: 'ASSIGN',
        },
        {
            api: 'pm',
            value: 'PM',
        },
        {
            api: 'trailer',
            value: 'TRAILER',
        },
        {
            api: 'insurancepolicy',
            value: 'INSURANCE POLICY',
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
            api: 'ratingreview/review',
            value: 'REVIEW',
        },
        {
            api: 'ratingreview/rating',
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
        {
            api: 'company',
            value: 'COMPANY',
        },
        {
            api: 'tag',
            value: 'TAG',
        },
        {
            api: 'bank',
            value: 'BANK',
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
        this.responseMessage = this.toastPackage.config.payload?.responseMessage
            ? this.toastPackage.config.payload.responseMessage
            : '';
    }

    ngOnInit(): void {
        if (this.httpRequest) {
            this.createTitleBasedOnHttpRequest();
            this.manuallyStarted = false;
        } else {
            this.triggerManuallyToast();
            this.manuallyStarted = true;
        }
    }

    createTitleBasedOnHttpRequest() {
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

        if (this.responseMessage) {
            this.message = this.responseMessage;
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
            case 'ASSIGN':
                this.actionType = 'DEVICE';
                this.actionTitle =
                    this.toastrType == 'toast-error' ? 'ASSIGN' : 'ASSIGNED';

                let deviceMessage = '';
                if (this.httpRequest.body?.truckId) {
                    deviceMessage =
                        'Truck - ' + this.DetailsDataService.unitValue;
                } else if (this.httpRequest.body?.trailerId) {
                    deviceMessage =
                        'Trailer - ' + this.DetailsDataService.unitValue;
                }

                this.message = deviceMessage;
                break;
            case 'LOAD':
                let loadNum = '';
                if (this.httpRequest.body?.referenceNumber)
                    loadNum = this.httpRequest.body.referenceNumber;

                this.message = loadNum;
                break;
            case 'USER':
                let userName = '';

                if (this.httpRequest.body?.has?.('firstName'))
                    userName = this.httpRequest.body.getAll('firstName')[0];

                let userLastName = '';

                if (this.httpRequest.body?.has?.('lastName'))
                    userLastName = this.httpRequest.body.getAll('lastName')[0];

                let userNameFull = '';

                if (userName && userLastName)
                    userNameFull = userName + ' ' + userLastName;

                let isUserActive = this.DetailsDataService.mainData?.status
                    ? 1
                    : 0;

                if (!userNameFull)
                    userNameFull = this.DetailsDataService.mainData?.fullName
                        ? this.DetailsDataService.mainData?.fullName
                        : this.DetailsDataService.mainData?.firstName +
                          ' ' +
                          this.DetailsDataService.mainData?.lastName;

                if (this.httpRequest.method === 'PUT') {
                    if (apiEndPoint.indexOf('status') > -1) {
                        if (isUserActive === 1)
                            this.actionTitle =
                                this.toastrType === 'toast-error'
                                    ? 'DEACTIVE'
                                    : 'DEACTIVATED';
                        else
                            this.actionTitle =
                                this.toastrType === 'toast-error'
                                    ? 'ACTIVE'
                                    : 'ACTIVATED';
                    }
                }
                this.message = userNameFull;
                break;
            case 'DRIVERS':
                if (this.httpRequest.body?.ids)
                    this.message =
                        '(' + this.httpRequest.body?.ids.length + ') Drivers';

                break;
            case 'DRIVER':
                let bodyName = '';

                if (this.httpRequest.body?.has?.('firstName')) {
                    bodyName = this.httpRequest.body.getAll('firstName')[0];
                }

                let bodyLastName = '';

                if (this.httpRequest.body?.has?.('lastName')) {
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
                if (this.DetailsDataService.mainData.rating == 0) {
                    this.actionTitle =
                        this.toastrType == 'toast-error'
                            ? 'REMOVE RATE'
                            : 'REMOVED RATE';
                } else {
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
                this.actionTitle =
                    this.toastrType == 'toast-error' ? 'REVIEW' : 'REVIEWED';

                if (this.httpRequest.body?.id) {
                    this.actionTitle =
                        this.toastrType == 'toast-error' ? 'UPDATE' : 'UPDATED';
                    this.message = this.httpRequest.body
                        ? this.httpRequest.body?.comment
                        : '';
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
                let cdlNum = '';

                if (this.httpRequest.body?.has('cdlNumber')) {
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

                if (this.httpRequest.body?.has('issueDate')) {
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
                } else {
                    this.message = driverName;
                }
                break;
            case 'SHIPPER':
            case 'BROKER':
                let messageValue = '';
                if (this.httpRequest.body && !this.httpRequest.body?.id) {
                    messageValue = this.httpRequest?.body?.getAll?.(
                        'dbaName'
                    )?.[0]
                        ? this.httpRequest?.body?.getAll?.('dbaName')?.[0]
                        : this.httpRequest?.body?.getAll?.('businessName')?.[0];
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

                if (this.httpRequest.body?.has('trailerNumber')) {
                    trailerNum =
                        this.httpRequest.body.getAll('trailerNumber')[0];
                }

                const activeTrailer =
                    this.DetailsDataService.isActivationInProgress;
                if (!trailerNum) {
                    trailerNum =
                        this.DetailsDataService.mainData?.trailerNumber;
                }

                if (
                    apiEndPoint.indexOf('status') > -1 &&
                    this.DetailsDataService.mainData
                ) {
                    if (activeTrailer) {
                        this.actionTitle =
                            this.toastrType == 'toast-error'
                                ? 'ACTIVE'
                                : 'ACTIVATED';
                    } else {
                        this.actionTitle =
                            this.toastrType == 'toast-error'
                                ? 'DEACTIVE'
                                : 'DEACTIVATED';
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

                if (this.httpRequest.body?.has('truckNumber')) {
                    truckNum = this.httpRequest.body.getAll('truckNumber')[0];
                }

                const activeTruck =
                    this.DetailsDataService.isActivationInProgress;
                if (!truckNum) {
                    truckNum = this.DetailsDataService.mainData?.truckNumber;
                }
                if (apiEndPoint.indexOf('status') > -1) {
                    if (activeTruck) {
                        this.actionTitle =
                            this.toastrType == 'toast-error'
                                ? 'ACTIVE'
                                : 'ACTIVATED';
                    } else {
                        this.actionTitle =
                            this.toastrType == 'toast-error'
                                ? 'DEACTIVE'
                                : 'DEACTIVATED';
                    }

                    if (
                        this.toastrType != 'toast-error' &&
                        this.DetailsDataService.mainData
                    ) {
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

                if (this.httpRequest.body?.has('name')) {
                    name = this.httpRequest.body.getAll('name')[0];
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
            case 'BROKER CONTACT':
            case 'SHIPPER CONTACT':
                let customerContactName = this.DetailsDataService.contactName;

                this.message = customerContactName;
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

                if (this.httpRequest.body?.has('name')) {
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

                if (!this.httpRequest.body) break;

                if (this.httpRequest.body.registrationIdToBeVoided) {
                    this.actionTitle = TableStringEnum.REGISTRATION;
                    this.actionType = TableStringEnum.VOIDED;
                    messageText = `${TableStringEnum.REGISTRATION} - ${this.httpRequest.body.registrationIdToBeVoided}`;
                } else if (
                    this.httpRequest.body.getAll('unitType')[0] == 'Truck' ||
                    this.httpRequest.body.getAll('truckId')[0]
                ) {
                    let repairTruckNum = this.DetailsDataService.mainData
                        ?.truckNumber
                        ? this.DetailsDataService.mainData?.truckNumber
                        : '';

                    if (!repairTruckNum) {
                        repairTruckNum = this.DetailsDataService?.unitValue
                            ? this.DetailsDataService?.unitValue
                            : '';
                    }

                    messageText = 'Truck - ' + repairTruckNum;
                } else if (
                    this.httpRequest.body.getAll('unitType')[0] == 'Trailer' ||
                    this.httpRequest.body.getAll('trailerId')
                ) {
                    let repairTrailerNum = this.DetailsDataService.mainData
                        ?.trailerNumber
                        ? this.DetailsDataService.mainData?.trailerNumber
                        : '';

                    if (!repairTrailerNum) {
                        repairTrailerNum = this.DetailsDataService?.unitValue
                            ? this.DetailsDataService?.unitValue
                            : '';
                    }
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
            case 'TAG':
                if (!this.httpRequest?.body?.tags[0]?.tagId) {
                    this.actionTitle =
                        this.toastrType == 'toast-error' ? 'REMOVE' : 'REMOVED';
                }
                this.message = this.DetailsDataService.documentName
                    ? this.DetailsDataService.documentName
                    : '';
                break;
            case 'CREDIT':
                this.message = this.httpRequest?.body?.creditLimit
                    ? this.httpRequest?.body?.creditLimit
                    : '';
                break;
            case 'BANK':
                this.message = this.httpRequest?.body?.name
                    ? this.httpRequest?.body?.name
                    : '';
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

    triggerManuallyToast() {
        this.message = this.toastPackage.message;
        this.mainTitle = this.toastPackage.title;
    }
}
