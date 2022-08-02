import { SignInResponse } from 'appcoretruckassist';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormService } from 'src/app/core/services/form/form.service';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { phoneRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';

@Component({
  selector: 'app-load-modal',
  templateUrl: './load-modal.component.html',
  styleUrls: ['./load-modal.component.scss'],
  providers: [FormService, ModalService],
})
export class LoadModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public loadForm: FormGroup;

  public isDirty: boolean = true;

  public selectedTab: number = 1;
  public headerTabs = [
    {
      id: 1,
      label: 'headerTab',
      value: 'FTL',
      name: 'FTL',
      checked: true,
    },
    {
      id: 2,
      label: 'headerTab',
      value: 'LTL',
      name: 'LTL',
      checked: false,
    },
  ];

  public stopTabs = [
    {
      id: 3,
      label: 'stopTab',
      value: 'Pickup',
      name: 'Pickup',
      checked: true,
    },
    {
      id: 4,
      label: 'stopTab',
      value: 'Delivery',
      name: 'Delivery',
      checked: false,
    },
  ];

  public stopTimeTabs = [
    {
      id: 5,
      label: 'stopTimeTab',
      value: 'Open',
      name: 'Open',
      checked: true,
    },
    {
      id: 6,
      label: 'stopTimeTab',
      value: 'APPT',
      name: 'APPT',
      checked: false,
    },
  ];

  public labelsTemplate: any[] = [];
  public labelsDispatcher: any[] = [];
  public labelsGeneralCommodity: any[] = [];
  public labelsBroker: any[] = [];
  public labelsTruckReq: any[] = [];
  public labelsTrailerReq: any[] = [];
  public labelsDoorType: any[] = [];
  public labelsSuspension: any[] = [];
  public labelsLength: any[] = [];
  public labelsYear: any[] = [];

  public selectedTemplate: any = null;
  public selectedDispatcher: any = null;
  public selectedGeneralCommodity: any = null;
  public selectedBroker: any = null;
  public selectedTruckReq: any = null;
  public selectedTrailerReq: any = null;
  public selectedDoorType: any = null;
  public selectedSuspension: any = null;
  public selectedLength: any = null;
  public selectedYear: any = null;

  public selectedStopTab: number = 3;
  public selectedStopTime: number = 5;

  public isAvailableAdjustedRate: boolean = false;
  public isAvailableAdvanceRate: boolean = false;

  public documents: any[] = [];
  public comments: any[] = [];

  public companyUser: SignInResponse = null;

  public isDateRange: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService,
    private modalService: ModalService,
    private inputService: TaInputService
  ) {}

  ngOnInit() {
    this.createForm();

    this.companyUser = JSON.parse(localStorage.getItem('user'));
  }

  private createForm() {
    this.loadForm = this.formBuilder.group({
      selectTemplate: [null],
      dispatcher: [null],
      company: [null, Validators.required],
      refNumber: [null, Validators.required],
      generalCommodity: [null],
      weight: [null],
      broker: [null, Validators.required],
      brokerContact: [null],
      brokerPhone: [null, phoneRegex],
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

    // this.formService.checkFormChange(this.loadForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  public onModalHeaderTabChange(event: any): void {
    this.selectedTab = event.id;
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
        this.selectedLength = event;
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

  public onFilesEvent(event: any) {
    this.documents = event.files;
  }

  public createComment(event: any) {
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

  ngOnDestroy(): void {}
}
