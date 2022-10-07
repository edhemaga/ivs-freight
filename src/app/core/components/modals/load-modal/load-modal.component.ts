import { SignInResponse } from 'appcoretruckassist';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { phoneFaxRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../services/form/form.service';
import { LoadTService } from '../../load/state/load.service';
import { LoadModalResponse } from '../../../../../../appcoretruckassist/model/loadModalResponse';
import { NotificationService } from '../../../services/notification/notification.service';
import moment from 'moment';

@Component({
  selector: 'app-load-modal',
  templateUrl: './load-modal.component.html',
  styleUrls: ['./load-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class LoadModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public loadForm: FormGroup;

  public isFormDirty: boolean;

  public selectedTab: number = 1;
  public headerTabs = [
    {
      id: 1,
      name: 'FTL',
      checked: true,
    },
    {
      id: 2,
      name: 'LTL',
      checked: false,
    },
  ];

  public selectedStopTab: number = 3;
  public stopTabs = [
    {
      id: 3,
      name: 'Pickup',
      checked: true,
    },
    {
      id: 4,
      name: 'Delivery',
      checked: false,
    },
  ];

  public selectedStopTime: number = 5;
  public stopTimeTabs = [
    {
      id: 5,
      name: 'Open',
      checked: true,
    },
    {
      id: 6,
      name: 'APPT',
      checked: false,
    },
  ];

  public loadModalTitle: string = '1546';
  public loadModalBill: any = null;

  public labelsTemplate: any[] = [];
  public labelsDispatcher: any[] = [];
  public labelsCompanies: any[] = [];
  public labelsTruckTrailerDriver: any[] = [];
  public labelsGeneralCommodity: any[] = [];
  public labelsBroker: any[] = [];
  public labelsTruckReq: any[] = [];
  public labelsTrailerReq: any[] = [];
  public labelsDoorType: any[] = [];
  public labelsSuspension: any[] = [];
  public labelsTrailerLength: any[] = [];
  public labelsYear: any[] = [];

  public selectedTemplate: any = null;
  public selectedDispatcher: any = null;
  public selectedCompany: any = null;
  public selectedTruckTrailerDriver: any = null;
  public selectedGeneralCommodity: any = null;
  public selectedBroker: any = null;
  public selectedTruckReq: any = null;
  public selectedTrailerReq: any = null;
  public selectedDoorType: any = null;
  public selectedSuspension: any = null;
  public selectedTrailerLength: any = null;
  public selectedYear: any = null;

  public isAvailableAdjustedRate: boolean = false;
  public isAvailableAdvanceRate: boolean = false;

  public documents: any[] = [];
  public comments: any[] = [];

  public companyUser: SignInResponse = null;

  public isDateRange: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private inputService: TaInputService,
    private formService: FormService,
    private loadService: LoadTService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.companyUser = JSON.parse(localStorage.getItem('user'));
    this.createForm();
    this.getLoadDropdowns();
    this.loadModalBill = {
      rate: 0,
      adjusted: 0,
      due: 0,
    };
  }

  private createForm() {
    this.loadForm = this.formBuilder.group({
      selectTemplate: [null],
      dispatcher: [null],
      company: [this.companyUser.companyName, Validators.required],
      refNumber: [null, Validators.required],
      generalCommodity: [null],
      weight: [null],
      broker: [null, Validators.required],
      brokerContact: [null],
      brokerPhone: [null, phoneFaxRegex],
      brokerPhoneExt: [null, Validators.maxLength(3)],
      truckReq: [null],
      trailerReq: [null],
      doorType: [null],
      suspension: [null],
      length: [null],
      year: [null],
      lifgate: [null],
      stopMode: ['Pickup'],
      shipper: [null, Validators.required],
      location: [null],
      date: [null, Validators.required],
      dateRange: [null],
      timeMode: ['Open'],
      fromTime: [null, Validators.required],
      toTime: [null, Validators.required],
      billingPaymentBaseRate: [null, Validators.required],
      billingPaymentAdjustedRate: [null],
      lingPaymentAdvanceRate: [null],
      note: [null],
    });

    this.formService.checkFormChange(this.loadForm);

    this.formService.formValueChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormChange: boolean) => {
        this.isFormDirty = isFormChange;
      });
  }

  public onModalHeaderTabChange(event: any): void {
    this.selectedTab = event.id;
  }

  public onTabChange(event: any, action: string) {
    switch (action) {
      case 'stop-tab': {
        this.selectedStopTab = event.id;
        break;
      }
      case 'stop-time': {
        this.selectedStopTime = event.id;
        if (this.selectedStopTime === 6) {
          this.inputService.changeValidators(
            this.loadForm.get('toTime'),
            false
          );
        } else {
          this.inputService.changeValidators(this.loadForm.get('toTime'));
        }
        break;
      }
    }
  }

  public onModalAction(data: { action: string; bool: boolean }): void {}

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'template': {
        this.selectedTemplate = event;
        break;
      }
      case 'dispatcher': {
        this.selectedDispatcher = event;
        break;
      }
      case 'company': {
        this.selectedCompany = event;
        break;
      }
      case 'general-commodity': {
        this.selectedGeneralCommodity = event;
        break;
      }
      case 'selectedBroker': {
        this.selectedBroker = event;
        break;
      }
      case 'truck-req': {
        this.selectedTruckReq = event;
        break;
      }
      case 'trailer-req': {
        this.selectedTrailerReq = event;
        break;
      }
      case 'door-type': {
        this.selectedDoorType = event;
        break;
      }
      case 'suspension': {
        this.selectedSuspension = event;
        break;
      }
      case 'length': {
        this.selectedTrailerLength = event;
        break;
      }
      case 'year': {
        this.selectedYear = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onFilesEvent(event: any) {
    this.documents = event.files;
  }

  public createComment() {
    if (this.comments.some((item) => item.isNewReview)) {
      return;
    }
    // ------------------------ PRODUCTION MODE -----------------------------
    // this.reviews.unshift({
    //   companyUser: {
    //     fullName: this.companyUser.firstName.concat(' ', this.companyUser.lastName),
    //     avatar: this.companyUser.avatar,
    //   },
    //   commentContent: '',
    //   createdAt: new Date().toISOString(),
    //   updatedAt: new Date().toISOString(),
    //   isNewReview: true,
    // });
    // -------------------------- DEVELOP MODE --------------------------------
    this.comments.unshift({
      companyUser: {
        fullName: this.companyUser.firstName.concat(
          ' ',
          this.companyUser.lastName
        ),
        avatar: this.companyUser.avatar,
      },
      commentContent: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNewReview: true,
    });
  }

  public changeCommentsEvent(comments: any) {
    switch (comments.action) {
      case 'delete': {
        this.deleteComment(comments);
        break;
      }
      case 'add': {
        this.addComment(comments);
        break;
      }
      case 'update': {
        this.updateComment(comments);
        break;
      }
      default: {
        break;
      }
    }
  }

  public deleteComment(comments: any) {}
  public addComment(comments: any) {}
  public updateComment(comments: any) {}

  private getLoadDropdowns(id?: number) {
    this.loadService
      .getLoadDropdowns(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: LoadModalResponse) => {
          console.log(res);
          this.labelsBroker = res.brokers;
          this.labelsDispatcher = res.dispatchers.map((item) => {
            return {
              id: item.id,
              name: item.fullName,
            };
          });
          // Initial Dispatcher Name
          const initialDispatcher = this.labelsDispatcher.find(
            (item) =>
              item.name ===
              this.companyUser.firstName.concat(' ', this.companyUser.lastName)
          );
          this.loadForm.get('dispatcher').patchValue(initialDispatcher.name);
          this.selectedDispatcher = initialDispatcher;
          // -----------------------
          // Multiple Companies
          this.labelsCompanies = res.companies.map((item) => {
            return {
              id: item.id,
              name: item.companyName,
              isDivision: item.isDivision,
              isActive: item.isActive,
              logo: item.logo,
            };
          });

          if (this.labelsCompanies.length > 1) {
            this.selectedCompany = this.labelsCompanies.find(
              (item) => item.name === this.companyUser.companyName
            );
          }
          // -----------------------
          this.labelsDoorType = res.doorTypes;
          this.labelsGeneralCommodity = res.generalCommodities;
          this.labelsSuspension = res.suspensions;
          this.labelsTemplate = res.templates;

          this.labelsTrailerLength = res.trailerLengths;
          this.labelsTrailerReq = res.trailerTypes;
          this.labelsTruckReq = res.truckTypes;
          this.labelsYear = null;
        },
        error: (error: any) => {
          this.notificationService.error(error, 'Error');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
