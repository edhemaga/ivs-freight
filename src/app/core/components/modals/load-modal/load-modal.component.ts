import {
  CreateCommentCommand,
  SignInResponse,
  UpdateCommentCommand,
} from 'appcoretruckassist';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../services/form/form.service';
import { LoadTService } from '../../load/state/load.service';
import { LoadModalResponse } from '../../../../../../appcoretruckassist';
import { NotificationService } from '../../../services/notification/notification.service';
import { CommentsService } from '../../../services/comments/comments.service';
import { ReviewCommentModal } from '../../shared/ta-user-review/ta-user-review.component';
import { ITaInput } from '../../shared/ta-input/ta-input.config';

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
  public loadModalBill: { rate: number; adjusted: number; due: number } = null;

  public labelsTemplate: any[] = [];
  public labelsDispatcher: any[] = [];
  public labelsCompanies: any[] = [];
  public labelsDispatches: any[] = [];
  public labelsGeneralCommodity: any[] = [];
  public labelsBroker: any[] = [];
  public labelsBrokerContacts: any[] = [];
  public labelsTruckReq: any[] = [];
  public labelsTrailerReq: any[] = [];
  public labelsDoorType: any[] = [];
  public labelsSuspension: any[] = [];
  public labelsTrailerLength: any[] = [];
  public labelsYear: any[] = [];
  public labelsShippers: any[] = [];

  public selectedTemplate: any = null;
  public selectedDispatcher: any = null;
  public selectedCompany: any = null;
  public selectedDispatches: any = null;
  public selectedGeneralCommodity: any = null;
  public selectedBroker: any = null;
  public selectedBrokerContact: any = null;
  public selectedTruckReq: any = null;
  public selectedTrailerReq: any = null;
  public selectedDoorType: any = null;
  public selectedSuspension: any = null;
  public selectedTrailerLength: any = null;
  public selectedYear: any = null;
  public selectedShipper: any = null;

  public loadBrokerContactsInputConfig: ITaInput = {
    name: 'Input Dropdown',
    type: 'text',
    multipleLabel: {
      labels: ['Contact', 'Phone', 'Ext'],
      customClass: 'load-broker-contact',
    },
    isDropdown: true,
    dropdownWidthClass: 'w-col-391',
  };

  public loadDispatchesTTDInputConfig: ITaInput = {
    name: 'Input Dropdown',
    type: 'text',
    multipleLabel: {
      labels: ['Truck #', 'Trailer #', 'Driver'],
      customClass: 'load-dispatches-ttd',
    },
    isDropdown: true,
    dropdownWidthClass: 'w-col-397',
  };

  public loadShipperInputConfig: ITaInput = {
    name: 'Input Dropdown',
    type: 'text',
    multipleLabel: {
      labels: ['Shipper', 'Location'],
      customClass: 'load-shipper',
    },
    isDropdown: true,
    isRequired: true,
    dropdownWidthClass: 'w-col-696',
  };

  public isAvailableAdjustedRate: boolean = false;
  public isAvailableAdvanceRate: boolean = false;

  public documents: any[] = [];
  public comments: any[] = [];

  public companyUser: SignInResponse = null;

  public isDateRange: boolean = false;

  public isHazardousPicked: boolean = false;
  public isHazardousVisible: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private inputService: TaInputService,
    private formService: FormService,
    private loadService: LoadTService,
    private notificationService: NotificationService,
    private commentsService: CommentsService
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
      dispatchesId: [null],
      refNumber: [null, Validators.required],
      generalCommodity: [null],
      weight: [null],
      broker: [null, Validators.required],
      brokerContact: [null],
      truckReq: [null],
      trailerReq: [null],
      doorType: [null],
      suspension: [null],
      length: [null],
      year: [null],
      lifgate: [null],
      stopMode: ['Pickup'],
      shipper: [null, Validators.required],
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
        if (this.selectedDispatcher) {
          this.labelsDispatcher = this.labelsDispatcher.filter((item) => item); // valid dispatcherId
        }
        break;
      }
      case 'company': {
        this.selectedCompany = event;
        break;
      }
      case 'general-commodity': {
        this.selectedGeneralCommodity = event;
        this.isHazardousPicked = event?.name?.toLowerCase() === 'hazardous';
        break;
      }
      case 'broker': {
        this.selectedBroker = event;
        if (this.selectedBroker) {
          this.labelsBrokerContacts = this.labelsBrokerContacts.filter(
            (item) => item.brokerId === this.selectedBroker.id
          );
        }

        break;
      }
      case 'broker-contact': {
        this.selectedBrokerContact = {
          ...event,
          name: event?.name
            ?.concat(' ', event?.phone)
            .concat(' ', event?.extensionPhone),
        };
        if (event) {
          this.loadBrokerContactsInputConfig = {
            ...this.loadBrokerContactsInputConfig,
            multipleInputValues: {
              options: [
                {
                  value: event.name,
                  logoName: null,
                },
                {
                  value: event.phone,
                  logoName: null,
                },
                {
                  value: event.extensionPhone,
                  logoName: null,
                },
              ],
              customClass: 'load-broker-contact',
            },
          };
        } else {
          this.loadBrokerContactsInputConfig.multipleInputValues = null;
        }

        break;
      }
      case 'dispatches': {
        this.selectedDispatches = {
          ...event,
          name: event?.truck?.name
            ?.concat(' ', event?.trailer?.name)
            .concat(' ', event?.driver?.name),
        };
        if (event) {
          this.loadDispatchesTTDInputConfig = {
            ...this.loadDispatchesTTDInputConfig,
            multipleInputValues: {
              options: [
                {
                  value: event?.truck?.name,
                  logoName: null,
                },
                {
                  value: event?.trailer?.name,
                  logoName: null,
                },
                {
                  value: event?.driver?.name,
                  logoName: event?.driver?.logoName
                    ? event?.driver?.logoName
                    : 'no-url',
                },
              ],
              customClass: 'load-dispatches-ttd',
            },
          };
        } else {
          this.loadDispatchesTTDInputConfig.multipleInputValues = null;
        }
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
      case 'shipper': {
        this.selectedShipper = event?.name?.concat(' ', event?.address);

        if (event) {
          this.loadShipperInputConfig = {
            ...this.loadShipperInputConfig,
            multipleInputValues: {
              options: [
                {
                  value: event?.name,
                  logoName: null,
                },
                {
                  value: event?.address,
                  logoName: null,
                },
              ],
              customClass: 'load-shipper',
            },
          };
        } else {
          this.loadShipperInputConfig.multipleInputValues = null;
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public commandEvent(event: boolean) {
    this.isHazardousVisible = !this.isHazardousVisible;
  }

  public onFilesEvent(event: any) {
    this.documents = event.files;
  }

  public changeCommentsEvent(comments: ReviewCommentModal) {
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

  public addComment(comments: ReviewCommentModal) {
    const comment: CreateCommentCommand = {
      entityTypeCommentId: 2,
      entityTypeId: this.editData.id,
      commentContent: comments.data.commentContent,
    };

    this.commentsService
      .createComment(comment)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.comments = comments.sortData.map((item, index) => {
            if (index === 0) {
              return {
                ...item,
                id: res.id,
              };
            }
            return item;
          });
          this.notificationService.success(
            'Comment successfully created.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Comment can't be created.", 'Error:');
        },
      });
  }

  public deleteComment(comments: ReviewCommentModal) {
    this.comments = comments.sortData;
    this.commentsService
      .deleteCommentById(comments.data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Comment successfully deleted.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            "Comment cant't be deleted.",
            'Error:'
          );
        },
      });
  }

  public updateComment(comments: ReviewCommentModal) {
    this.comments = comments.sortData;

    const comment: UpdateCommentCommand = {
      id: comments.data.id,
      commentContent: comments.data.commentContent,
    };

    this.commentsService
      .updateComment(comment)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Comment successfully updated.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error(
            "Comment cant't be updated.",
            'Error:'
          );
        },
      });
  }

  private getLoadDropdowns(id?: number) {
    this.loadService
      .getLoadDropdowns(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: LoadModalResponse) => {
          console.log(res);
          // Brokers
          this.labelsBroker = res.brokers.map((item) => {
            return {
              id: item.id,
              name: item.businessName,
              ban: item.ban,
              dnu: item.dnu,
              status: 'High',
            };
          });
          this.labelsBrokerContacts = res.brokerContacts.map((item) => {
            return {
              ...item,
              name: item.contactName,
              extensionPhone: '312',
            };
          });
          // -----------------------
          // Dispatcher
          this.labelsDispatcher = res.dispatchers.map((item) => {
            return {
              id: item.id,
              name: item.fullName,
              logoName: item.avatar,
            };
          });
          const initialDispatcher = this.labelsDispatcher.find(
            (item) =>
              item.name ===
              this.companyUser.firstName.concat(' ', this.companyUser.lastName)
          );
          this.loadForm.get('dispatcher').patchValue(initialDispatcher.name);
          this.selectedDispatcher = initialDispatcher;
          // -----------------------
          // Division Companies
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
          // Dispatches
          this.labelsDispatches = res.dispatches.map((item) => {
            return {
              dispatchBoardId: item.dispatchBoardId,
              id: item.id,
              driver: {
                id: item.driver.id,
                name: item.driver.firstName.concat(' ', item.driver.lastName),
                logoName: item.driver.avatar,
              },
              coDriver: {
                id: item?.coDriver?.id,
                name: item?.coDriver?.firstName?.concat(
                  ' ',
                  item?.coDriver?.lastName
                ),
                logoName: item?.coDriver?.avatar,
              },
              truck: {
                id: item.truck.id,
                name: `# ${item.truck.truckNumber}`,
              },
              trailer: {
                id: item.trailer.id,
                name: `# ${item.trailer.trailerNumber}`,
              },
            };
          });
          // -----------------------
          this.labelsDoorType = res.doorTypes;
          this.labelsGeneralCommodity = res.generalCommodities.map((item) => {
            if (item.name.toLowerCase() === 'hazardous') {
              return {
                ...item,
                logoName: 'ic_hazardous.svg',
                folder: 'common',
                subFolder: 'load',
              };
            }
            return { ...item };
          });

          this.labelsSuspension = res.suspensions;
          this.labelsTemplate = res.templates;

          this.labelsTrailerLength = res.trailerLengths;
          this.labelsTrailerReq = res.trailerTypes.map((item) => {
            return {
              ...item,
              folder: 'common',
              subFolder: 'trailers',
            };
          });
          this.labelsTruckReq = res.truckTypes.map((item) => {
            return {
              ...item,
              folder: 'common',
              subFolder: 'trucks',
            };
          });
          this.labelsYear = [];
          // Shipper
          this.labelsShippers = res.shippers.map((item) => {
            return {
              id: item.id,
              name: item.businessName,
              address: item.address.address,
            };
          });
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
