import { AddressEntity } from '../../../../../../appcoretruckassist';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { BrokerModalResponse } from '../../../../../../appcoretruckassist';
import {
  BrokerResponse,
  CreateBrokerCommand,
  CreateRatingCommand,
  CreateReviewCommand,
  SignInResponse,
  UpdateBrokerCommand,
  UpdateReviewCommand,
} from 'appcoretruckassist';
import {
  addressUnitValidation,
  addressValidation,
  businessNameValidation,
  departmentValidation,
  einNumberRegex,
  mcFFValidation,
  phoneExtension,
  phoneFaxRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { HttpResponseBase } from '@angular/common/http';
import { ReviewCommentModal } from '../../shared/ta-user-review/ta-user-review.component';
import {
  LikeDislikeModel,
  TaLikeDislikeService,
} from '../../shared/ta-like-dislike/ta-like-dislike.service';
import { BrokerTService } from '../../customer/state/broker-state/broker.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../services/notification/notification.service';
import { ReviewsRatingService } from '../../../services/reviews-rating/reviewsRating.service';
import { convertNumberInThousandSep } from '../../../utils/methods.calculations';
import { poBoxValidation } from '../../shared/ta-input/ta-input.regex-validations';
import {
  name2_24Validation,
  creditLimitValidation,
} from '../../shared/ta-input/ta-input.regex-validations';

@Component({
  selector: 'app-broker-modal',
  templateUrl: './broker-modal.component.html',
  styleUrls: ['./broker-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
  providers: [ModalService, TaLikeDislikeService],
})
export class BrokerModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public brokerForm: FormGroup;

  public selectedTab: number = 1;
  public tabs: any[] = [
    {
      id: 1,
      name: 'Details',
    },
    {
      id: 2,
      name: 'Contact',
    },
  ];

  public physicalAddressTabs: any[] = [
    {
      id: 'physicaladdress',
      name: 'Physical Address',
      checked: true,
    },
    {
      id: 'poboxphysical',
      name: 'PO Box Physical',
      checked: false,
    },
  ];

  public billingAddressTabs: any[] = [
    {
      id: 'billingaddress',
      name: 'Billing Address',
      checked: true,
    },
    {
      id: 'poboxbilling',
      name: 'PO Box Billing',
      checked: false,
    },
  ];

  public selectedPhysicalAddressTab: any = {
    id: 'physicaladdress',
    name: 'Physical Address',
    checked: true,
  };

  public selectedBillingAddressTab: any = {
    id: 'billingaddress',
    name: 'Billing Address',
    checked: true,
  };

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public billingCredit = [
    {
      id: 301,
      name: 'Custom',
      checked: true,
    },
    {
      id: 300,
      name: 'Unlimited',
      checked: false,
    },
  ];

  public reviews: any[] = [];

  public selectedPhysicalAddress: AddressEntity = null;
  public selectedPhysicalPoBox: AddressEntity = null;
  public selectedBillingAddress: AddressEntity = null;
  public selectedBillingPoBox: AddressEntity = null;

  public labelsPayTerms: any[] = [];
  public labelsDepartments: any[] = [];

  public selectedContractDepartmentFormArray: any[] = [];

  public selectedPayTerm: any = null;

  public isContactCardsScrolling: boolean = false;

  public brokerBanStatus: boolean = true;
  public brokerDnuStatus: boolean = true;

  public companyUser: SignInResponse = null;

  public isDirty: boolean = false;

  public disableOneMoreReview: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private brokerModalService: BrokerTService,
    private notificationService: NotificationService,
    private reviewRatingService: ReviewsRatingService,
    private taLikeDislikeService: TaLikeDislikeService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getBrokerDropdown();
    this.isCredit({ id: 301, name: 'Custom', checked: true });
    this.followIsBillingAddressSame();

    if (this.editData) {
      const timeout = setTimeout(() => {
        this.editBrokerById(this.editData.id);
        this.tabs.push({
          id: 3,
          name: 'Review',
        });
        this.ratingChanges();
        clearTimeout(timeout);
      }, 50);
    }

    this.companyUser = JSON.parse(localStorage.getItem('user'));
  }

  private createForm() {
    this.brokerForm = this.formBuilder.group({
      businessName: [null, [Validators.required, ...businessNameValidation]],
      dbaName: [null, name2_24Validation],
      mcNumber: [null, [...mcFFValidation]],
      ein: [null, [einNumberRegex]],
      email: [null],
      phone: [null, [Validators.required, phoneFaxRegex]],
      // Physical Address
      physicalAddress: [null, [Validators.required, ...addressValidation]],
      physicalAddressUnit: [null, [...addressUnitValidation]],
      physicalPoBox: [null, poBoxValidation],
      physicalPoBoxCity: [null, [...addressValidation]],
      // Billing Address
      isCheckedBillingAddress: [true],
      billingAddress: [null, [...addressValidation]],
      billingAddressUnit: [null, [...addressUnitValidation]],
      billingPoBox: [null, poBoxValidation],
      billingPoBoxCity: [null, [...addressValidation]],
      isCredit: [true],
      creditType: ['Custom'], // Custom | Unlimited
      creditLimit: [null, creditLimitValidation],
      availableCredit: [null],
      payTerm: [null],
      note: [null],
      ban: [null],
      dnu: [null],
      brokerContacts: this.formBuilder.array([]),
    });

    this.inputService.customInputValidator(
      this.brokerForm.get('email'),
      'email',
      this.destroy$
    );
  }

  public get brokerContacts(): FormArray {
    return this.brokerForm.get('brokerContacts') as FormArray;
  }

  private createBrokerContacts(data?: {
    contactName: string;
    departmentId: string;
    phone: string;
    extensionPhone: string;
    email: string;
  }): FormGroup {
    return this.formBuilder.group({
      contactName: [
        data?.contactName ? data.contactName : null,
        Validators.required,
      ],
      departmentId: [
        data?.departmentId ? data.departmentId : null,
        [Validators.required, ...departmentValidation],
      ],
      phone: [
        data?.phone ? data.phone : null,
        [Validators.required, phoneFaxRegex],
      ],
      extensionPhone: [
        data?.extensionPhone ? data.extensionPhone : null,
        [...phoneExtension],
      ],
      email: [data?.email ? data.email : null],
    });
  }

  public addBrokerContacts(event: { check: boolean; action: string }) {
    const form = this.createBrokerContacts();

    if (event.check) {
      this.brokerContacts.push(form);
    }

    this.inputService.customInputValidator(
      form.get('email'),
      'email',
      this.destroy$
    );
  }

  public removeBrokerContacts(id: number) {
    this.brokerContacts.removeAt(id);
    this.selectedContractDepartmentFormArray.splice(id, 1);
  }

  public onScrollingBrokerContacts(event: any) {
    this.isContactCardsScrolling = event.target.scrollLeft > 1;
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    if (data.action === 'bfb' || data.action === 'dnu') {
      // DNU
      if (data.action === 'dnu' && this.editData) {
        this.brokerForm.get('dnu').patchValue(data.bool);

        this.brokerModalService
          .changeDnuStatus(this.editData.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: HttpResponseBase) => {
              if (res.status === 200 || res.status === 204) {
                this.brokerDnuStatus = !this.brokerDnuStatus;

                this.modalService.changeModalStatus({
                  name: 'dnu',
                  status: this.brokerDnuStatus,
                });
              }
            },
          });
      }
      // BFB
      if (data.action === 'bfb' && this.editData) {
        this.brokerForm.get('ban').patchValue(data.bool);
        this.brokerModalService
          .changeBanStatus(this.editData.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (res: HttpResponseBase) => {
              if (res.status === 200 || res.status === 204) {
                this.brokerBanStatus = !this.brokerBanStatus;
                this.modalService.changeModalStatus({
                  name: 'bfb',
                  status: this.brokerBanStatus,
                });
                this.notificationService.success(
                  `Broker ${
                    this.brokerBanStatus
                      ? 'status changed to BAN'
                      : 'removed from BAN'
                  } .`,
                  'Success:'
                );
              }
            },
            error: () => {
              this.notificationService.error(
                "Broker status can't be changed.",
                'Success:'
              );
            },
          });
      }
    } else {
      if (data.action === 'close') {
        return;
      } else {
        // Save & Update
        if (data.action === 'save') {
          if (this.brokerForm.invalid) {
            this.inputService.markInvalid(this.brokerForm);
            return;
          }
          if (this.editData) {
            this.updateBroker(this.editData.id);
            this.modalService.setModalSpinner({
              action: null,
              status: true,
            });
          } else {
            this.addBroker();
            this.modalService.setModalSpinner({
              action: null,
              status: true,
            });
          }
        }
        // Delete
        if (data.action === 'delete' && this.editData) {
          this.deleteBrokerById(this.editData.id);
          this.modalService.setModalSpinner({
            action: 'delete',
            status: true,
          });
        }
      }
    }
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    let dotAnimation = document.querySelector(
      this.editData ? '.animation-three-tabs' : '.animation-two-tabs'
    );
    this.animationObject = {
      value: this.selectedTab,
      params: { height: `${dotAnimation.getClientRects()[0].height}px` },
    };
  }

  public tabPhysicalAddressChange(event: any): void {
    this.selectedPhysicalAddressTab = event;

    if (
      this.selectedPhysicalAddressTab?.id.toLowerCase() === 'physicaladdress'
    ) {
      this.inputService.changeValidators(
        this.brokerForm.get('physicalAddress')
      );
      this.inputService.changeValidators(
        this.brokerForm.get('physicalPoBox'),
        false
      );
      this.inputService.changeValidators(
        this.brokerForm.get('physicalPoBoxCity'),
        false
      );
    } else {
      this.inputService.changeValidators(
        this.brokerForm.get('physicalAddress'),
        false
      );
      this.brokerForm.get('physicalAddressUnit').reset();
      this.inputService.changeValidators(this.brokerForm.get('physicalPoBox'));
      this.inputService.changeValidators(
        this.brokerForm.get('physicalPoBoxCity')
      );
    }

    this.physicalAddressTabs = this.physicalAddressTabs.map((item) => {
      return {
        ...item,
        checked: item.id === this.selectedPhysicalAddressTab?.id.toLowerCase(),
      };
    });
  }

  public tabBillingAddressChange(event: any): void {
    this.selectedBillingAddressTab = event;

    if (this.selectedBillingAddressTab?.id === 'billingaddress') {
      this.inputService.changeValidators(this.brokerForm.get('billingAddress'));
      this.inputService.changeValidators(
        this.brokerForm.get('billingPoBox'),
        false
      );
      this.inputService.changeValidators(
        this.brokerForm.get('billingPoBoxCity'),
        false
      );
    } else {
      this.inputService.changeValidators(
        this.brokerForm.get('billingAddress'),
        false
      );
      this.brokerForm.get('billingAddressUnit').reset();
      this.inputService.changeValidators(this.brokerForm.get('billingPoBox'));
      this.inputService.changeValidators(
        this.brokerForm.get('billingPoBoxCity')
      );
    }

    this.billingAddressTabs = this.billingAddressTabs.map((item) => {
      return {
        ...item,
        checked: item.id === this.selectedBillingAddressTab?.id.toLowerCase(),
      };
    });
  }

  //taLikeDislikeService
  public onHandleAddress(
    event: {
      address: AddressEntity;
      valid: boolean;
    },
    action: string
  ) {
    switch (action) {
      case 'physical-address': {
        if (event.valid) this.selectedPhysicalAddress = event.address;
        break;
      }
      case 'physical-pobox': {
        if (event.valid) this.selectedPhysicalPoBox = event.address;
        break;
      }
      case 'billing-address': {
        if (event.valid) this.selectedBillingAddress = event.address;
        break;
      }
      case 'billing-pobox': {
        if (event.valid) this.selectedBillingPoBox = event.address;
        break;
      }
      default: {
        break;
      }
    }
  }

  public isCredit(event: any) {
    this.billingCredit.forEach((item) => {
      if (item.name === event.name) {
        this.brokerForm.get('creditType').patchValue(item.name);
      }
    });

    if (this.brokerForm.get('creditType').value === 'Custom') {
      this.inputService.changeValidators(this.brokerForm.get('creditLimit'));
    } else {
      this.inputService.changeValidators(
        this.brokerForm.get('creditLimit'),
        false
      );
    }

    this.billingCredit = this.billingCredit.map((item) => {
      return { ...item, checked: item.id === event.id };
    });
  }

  public changeReviewsEvent(reviews: ReviewCommentModal) {
    switch (reviews.action) {
      case 'delete': {
        this.deleteReview(reviews);
        break;
      }
      case 'add': {
        this.addReview(reviews);
        break;
      }
      case 'update': {
        this.updateReview(reviews);
        break;
      }
      default: {
        break;
      }
    }
  }

  public createReview() {
    if (
      this.reviews.some((item) => item.isNewReview) ||
      this.disableOneMoreReview
    ) {
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
    this.reviews.unshift({
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

  private ratingChanges() {
    this.taLikeDislikeService.userLikeDislike$
      .pipe(takeUntil(this.destroy$))
      .subscribe((action: LikeDislikeModel) => {
        let rating: CreateRatingCommand;

        if (action.action === 'liked') {
          rating = {
            entityTypeRatingId: 1,
            entityTypeId: this.editData.id,
            thumb: action.likeDislike,
          };
        } else {
          rating = {
            entityTypeRatingId: 1,
            entityTypeId: this.editData.id,
            thumb: action.likeDislike,
          };
        }

        this.reviewRatingService
          .addRating(rating)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: () => {
              this.editBrokerById(this.editData.id);
              this.notificationService.success(
                'Rating successfully updated.',
                'Success:'
              );
            },
            error: () => {
              this.notificationService.error(
                "Rating can't be updated.",
                'Error:'
              );
            },
          });
      });
  }

  private addReview(reviews: ReviewCommentModal) {
    const review: CreateReviewCommand = {
      entityTypeReviewId: 1,
      entityTypeId: this.editData.id,
      comment: reviews.data.commentContent,
    };

    this.reviewRatingService
      .addReview(review)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: any) => {
          this.reviews = reviews.sortData.map((item, index) => {
            if (index === 0) {
              return {
                ...item,
                id: res.id,
              };
            }
            return item;
          });

          this.disableOneMoreReview = true;
          this.notificationService.success(
            'Review successfully created.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Review can't be created.", 'Error:');
        },
      });
  }

  private deleteReview(reviews: ReviewCommentModal) {
    this.reviews = reviews.sortData;
    this.disableOneMoreReview = false;
    this.reviewRatingService
      .deleteReview(reviews.data)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Review successfully deleted.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Review can't be deleted.", 'Error:');
        },
      });
  }

  private updateReview(reviews: ReviewCommentModal) {
    this.reviews = reviews.sortData;
    const review: UpdateReviewCommand = {
      id: reviews.data.id,
      comment: reviews.data.commentContent,
    };

    this.reviewRatingService
      .updateReview(review)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Review successfully updated.',
            'Success'
          );
        },
        error: () => {
          this.notificationService.error("Review can't be updated.", 'Error');
        },
      });
  }

  public onSelectDropDown(event: any, action: string, index?: number) {
    switch (action) {
      case 'paytype': {
        this.selectedPayTerm = event;
        break;
      }
      case 'contact-department': {
        this.selectedContractDepartmentFormArray[index] = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  private getBrokerDropdown() {
    this.brokerModalService
      .getBrokerDropdowns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reasponse: BrokerModalResponse) => {
          this.labelsDepartments = reasponse.departments;
          this.labelsPayTerms = reasponse.payTerms;
        },
        error: () => {
          this.notificationService.error(
            "Broker's dropdowns can't be loaded.",
            'Error'
          );
        },
      });
  }

  private addBroker(): void {
    const {
      // Physical address
      physicalAddress,
      physicalAddressUnit,
      physicalPoBox,
      physicalPoBoxCity,
      // Billing address
      billingAddress,
      billingAddressUnit,
      billingPoBox,
      billingPoBoxCity,
      creditLimit,
      payTerm,
      brokerContacts,
      mcNumber,
      availableCredit,
      ...form
    } = this.brokerForm.value;

    let brAddresses = this.selectedBrokerAddress();

    let newData: CreateBrokerCommand = {
      ...form,
      mainAddress: brAddresses.mainAddress,
      mainPoBox: brAddresses.mainPoBox,
      billingAddress: brAddresses.billingAddress,
      billingPoBox: brAddresses.billingPoBox,
      mcNumber: mcNumber,
      creditLimit: creditLimit
        ? parseFloat(creditLimit.toString().replace(/,/g, ''))
        : null,
      payTerm: this.selectedPayTerm ? this.selectedPayTerm.id : null,
    };

    for (let index = 0; index < brokerContacts.length; index++) {
      brokerContacts[index].departmentId =
        this.selectedContractDepartmentFormArray[index].id;
    }

    newData = {
      ...newData,
      brokerContacts,
    };

    let businessName = this.brokerForm.value.businessName;
    this.brokerModalService
      .addBroker(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Broker "${businessName}" added`,
            'Success'
          );
        },
        error: () => {
          this.notificationService.error(
            `Failed to add Broker "${businessName}"`,
            'Error'
          );
        },
      });
  }

  private updateBroker(id: number): void {
    const {
      physicalAddress,
      physicalAddressUnit,
      physicalPoBox,
      physicalPoBoxCity,
      billingAddress,
      billingAddressUnit,
      billingPoBox,
      billingPoBoxCity,
      isCredit,
      brokerContacts,
      mcNumber,
      availableCredit,
      creditLimit,
      ...form
    } = this.brokerForm.value;

    let brAddresses = this.selectedBrokerAddress();

    let newData: UpdateBrokerCommand = {
      id: id,
      ...form,
      mainAddress: brAddresses.mainAddress,
      mainPoBox: brAddresses.mainPoBox,
      billingAddress: brAddresses.billingAddress,
      billingPoBox: brAddresses.billingPoBox,

      mcNumber: mcNumber,
      creditLimit: creditLimit
        ? parseFloat(creditLimit.toString().replace(/,/g, ''))
        : null,
      payTerm: this.selectedPayTerm ? this.selectedPayTerm.id : null,
    };

    for (let index = 0; index < brokerContacts.length; index++) {
      brokerContacts[index].departmentId =
        this.selectedContractDepartmentFormArray[index].id;
    }

    newData = {
      ...newData,
      brokerContacts,
    };

    this.brokerModalService
      .updateBroker(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Broker successfully updated.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Broker can't be updated.", 'Error:');
        },
      });
  }

  private deleteBrokerById(id: number): void {
    this.brokerModalService
      .deleteBrokerById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Broker successfully deleted.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Broker can't be deleted.", 'Error:');
        },
      });
  }

  private editBrokerById(id: number): void {
    this.brokerModalService
      .getBrokerById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (reasponse: BrokerResponse) => {
          this.brokerForm.patchValue({
            businessName: reasponse.businessName,
            dbaName: reasponse.dbaName,
            mcNumber: reasponse.mcNumber,
            ein: reasponse.ein,
            email: reasponse.email,
            phone: reasponse.phone,
            // Physical Address
            physicalAddress: reasponse.mainAddress
              ? reasponse.mainAddress.address
              : null,
            physicalAddressUnit: reasponse.mainAddress
              ? reasponse.mainAddress.addressUnit
              : null,
            physicalPoBox: reasponse.mainPoBox
              ? reasponse.mainPoBox.poBox
              : null,
            physicalPoBoxCity: reasponse.mainPoBox
              ? reasponse.mainPoBox.city
              : null,
            // Billing Address
            isCheckedBillingAddress:
              reasponse.mainAddress.address ===
              reasponse.billingAddress.address,
            billingAddress: reasponse.billingAddress
              ? reasponse.billingAddress.address
              : null,
            billingAddressUnit: reasponse.billingAddress
              ? reasponse.billingAddress.addressUnit
              : null,
            billingPoBox: reasponse.billingPoBox
              ? reasponse.billingPoBox.poBox
              : null,
            billingPoBoxCity: reasponse.billingPoBox
              ? reasponse.billingPoBox.city
              : null,
            creditType: reasponse.creditType,
            creditLimit:
              reasponse.creditType.name === 'Custom'
                ? convertNumberInThousandSep(reasponse.creditLimit)
                : null,
            availableCredit: reasponse.availableCredit,
            payTerm: reasponse.payTerm.name ? reasponse.payTerm.name : null,
            note: reasponse.note,
            ban: reasponse.ban,
            dnu: reasponse.dnu,
            brokerContacts: [],
          });

          this.modalService.changeModalStatus({
            name: 'dnu',
            status: reasponse.dnu,
          });
          this.brokerDnuStatus = reasponse.dnu;

          this.modalService.changeModalStatus({
            name: 'bfb',
            status: reasponse.ban,
          });

          this.brokerBanStatus = reasponse.ban;

          this.selectedPhysicalAddress = reasponse.mainAddress
            ? reasponse.mainAddress
            : null;
          this.selectedPhysicalPoBox = reasponse.mainPoBox
            ? reasponse.mainPoBox
            : null;
          this.selectedBillingAddress = reasponse.billingAddress
            ? reasponse.billingAddress
            : null;
          this.selectedBillingPoBox = reasponse.billingPoBox
            ? reasponse.billingPoBox
            : null;

          this.selectedPayTerm = reasponse.payTerm;

          if (reasponse.brokerContacts) {
            for (const contact of reasponse.brokerContacts) {
              this.brokerContacts.push(
                this.createBrokerContacts({
                  contactName: contact.contactName,
                  departmentId: contact.department.name,
                  phone: contact.phone,
                  extensionPhone: contact.extensionPhone,
                  email: contact.email,
                })
              );
              // this.brokerContacts.push(
              //   this.formBuilder.group({
              //     contactName: contact.contactName,
              //     departmentId: contact.department.name,
              //     phone: contact.phone,
              //     extensionPhone: contact.extensionPhone,
              //     email: contact.email,
              //   })
              // );
              this.selectedContractDepartmentFormArray.push(contact.department);
            }
          }

          this.reviews = reasponse.reviews.map((item: any) => ({
            ...item,
            companyUser: {
              ...item.companyUser,
              avatar: item.companyUser.avatar,
            },
            commentContent: item.comment,
            rating: item.ratingFromTheReviewer,
          }));

          const reviewIndex = this.reviews.findIndex(
            (item) => item.companyUser.id === this.companyUser.companyUserId
          );

          if (reviewIndex !== -1) {
            this.disableOneMoreReview = true;
          }

          this.taLikeDislikeService.populateLikeDislikeEvent({
            downRatingCount: reasponse.downCount,
            upRatingCount: reasponse.upCount,
            currentCompanyUserRating: reasponse.currentCompanyUserRating,
          });

          this.isCredit(
            this.billingCredit.find(
              (item) => item.name === reasponse.creditType.name
            )
          );

          this.tabPhysicalAddressChange(
            this.selectedPhysicalAddress.address
              ? {
                  id: 'physicaladdress',
                  name: 'Physical Address',
                  inputName: 'a',
                  checked: true,
                }
              : {
                  id: 'poboxphysical',
                  name: 'PO Box Physical',
                  inputName: 'a',
                  checked: false,
                }
          );

          this.tabBillingAddressChange(
            this.selectedBillingAddressTab.address ||
              reasponse.mainAddress.address === reasponse.billingAddress.address
              ? {
                  id: 'billingaddress',
                  name: 'Billing Address',
                  inputName: 'n',
                  checked: true,
                }
              : {
                  id: 'poboxbilling',
                  name: 'PO Box Billing',
                  inputName: 'n',
                  checked: false,
                }
          );
        },
        error: () => {
          this.notificationService.error("Broker can't be loaded.", 'Error:');
        },
      });
  }

  private followIsBillingAddressSame() {
    this.brokerForm
      .get('isCheckedBillingAddress')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(
            this.brokerForm.get('billingAddress'),
            false
          );
          this.inputService.changeValidators(
            this.brokerForm.get('billingPoBox'),
            false
          );
          this.inputService.changeValidators(
            this.brokerForm.get('billingPoBoxCity'),
            false
          );
        } else {
          if (this.selectedBillingAddressTab?.id === 'billingaddress') {
            this.inputService.changeValidators(
              this.brokerForm.get('billingAddress')
            );
            this.inputService.changeValidators(
              this.brokerForm.get('billingPoBox'),
              false
            );
            this.inputService.changeValidators(
              this.brokerForm.get('billingPoBoxCity'),
              false
            );
          } else {
            this.inputService.changeValidators(
              this.brokerForm.get('billingAddress'),
              false
            );
            this.inputService.changeValidators(
              this.brokerForm.get('billingPoBox')
            );
            this.inputService.changeValidators(
              this.brokerForm.get('billingPoBoxCity')
            );
          }
        }
      });
  }

  public selectedBrokerAddress(): {
    mainAddress;
    billingAddress;
    mainPoBox;
    billingPoBox;
  } {
    let mainAddress = null;
    let billingAddress = null;
    let mainPoBox = null;
    let billingPoBox = null;

    // If same billing address
    if (this.brokerForm.get('isCheckedBillingAddress').value) {
      if (this.selectedPhysicalAddressTab.id === 'physicaladdress') {
        mainAddress = {
          address: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.address
            : null,
          city: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.city
            : null,
          state: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.state
            : null,
          country: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.country
            : null,
          zipCode: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.zipCode
            : null,
          stateShortName: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.stateShortName
            : null,
          street: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.street
            : null,
          streetNumber: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.streetNumber
            : null,
          addressUnit: this.brokerForm.get('physicalAddressUnit').value,
        };
        mainPoBox = null;
        billingAddress = {
          address: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.address
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.address
            : null,
          city: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.city
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.city
            : null,
          state: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.state
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.state
            : null,
          country: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.country
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.country
            : null,
          zipCode: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.zipCode
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.zipCode
            : null,
          stateShortName: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.stateShortName
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.stateShortName
            : null,
          street: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.street
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.street
            : null,
          streetNumber: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.streetNumber
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.streetNumber
            : null,
          addressUnit: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.brokerForm.get('physicalAddressUnit').value
            : this.brokerForm.get('billingAddressUnit').value,
        };
        billingPoBox = null;
      } else {
        mainAddress = null;
        mainPoBox = {
          city: this.selectedPhysicalPoBox
            ? this.selectedPhysicalPoBox.city
            : null,
          state: this.selectedPhysicalPoBox
            ? this.selectedPhysicalPoBox.state
            : null,
          zipCode: this.selectedPhysicalPoBox
            ? this.selectedPhysicalPoBox.zipCode
            : null,
          poBox: this.selectedPhysicalPoBox
            ? this.brokerForm.get('physicalPoBox').value
            : null,
        };
        billingPoBox = {
          city: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalPoBox
              ? this.selectedPhysicalPoBox.city
              : null
            : this.selectedBillingPoBox
            ? this.selectedBillingPoBox.city
            : null,
          state: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalPoBox
              ? this.selectedPhysicalPoBox.state
              : null
            : this.selectedBillingPoBox
            ? this.selectedBillingPoBox.state
            : null,
          zipCode: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalPoBox
              ? this.selectedPhysicalPoBox.zipCode
              : null
            : this.selectedBillingPoBox
            ? this.selectedBillingPoBox.zipCode
            : null,
          poBox: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalPoBox
              ? this.brokerForm.get('physicalPoBox').value
              : null
            : this.brokerForm.get('billingPoBox').value,
        };
        billingAddress = null;
      }
    }
    // if not same
    else {
      if (this.selectedPhysicalAddressTab.id === 'physicaladdress') {
        mainAddress = {
          address: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.address
            : null,
          city: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.city
            : null,
          state: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.state
            : null,
          country: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.country
            : null,
          zipCode: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.zipCode
            : null,
          stateShortName: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.stateShortName
            : null,
          street: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.street
            : null,
          streetNumber: this.selectedPhysicalAddress
            ? this.selectedPhysicalAddress.streetNumber
            : null,
          addressUnit: this.brokerForm.get('physicalAddressUnit').value,
        };
        mainPoBox = null;
      } else {
        mainAddress = null;
        mainPoBox = {
          city: this.selectedPhysicalPoBox
            ? this.selectedPhysicalPoBox.city
            : null,
          state: this.selectedPhysicalPoBox
            ? this.selectedPhysicalPoBox.state
            : null,
          zipCode: this.selectedPhysicalPoBox
            ? this.selectedPhysicalPoBox.zipCode
            : null,
          poBox: this.selectedPhysicalPoBox
            ? this.brokerForm.get('physicalPoBox').value
            : null,
        };
      }

      if (this.selectedBillingAddressTab.id === 'billingaddress') {
        billingAddress = {
          address: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.address
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.address
            : null,
          city: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.city
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.city
            : null,
          state: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.state
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.state
            : null,
          country: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.country
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.country
            : null,
          zipCode: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.zipCode
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.zipCode
            : null,
          stateShortName: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.stateShortName
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.stateShortName
            : null,
          street: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.street
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.street
            : null,
          streetNumber: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalAddress
              ? this.selectedPhysicalAddress.streetNumber
              : null
            : this.selectedBillingAddress
            ? this.selectedBillingAddress.streetNumber
            : null,
          addressUnit: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.brokerForm.get('physicalAddressUnit').value
            : this.brokerForm.get('billingAddressUnit').value,
        };
        billingPoBox = null;
      } else {
        billingPoBox = {
          city: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalPoBox
              ? this.selectedPhysicalPoBox.city
              : null
            : this.selectedBillingPoBox
            ? this.selectedBillingPoBox.city
            : null,
          state: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalPoBox
              ? this.selectedPhysicalPoBox.state
              : null
            : this.selectedBillingPoBox
            ? this.selectedBillingPoBox.state
            : null,
          zipCode: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalPoBox
              ? this.selectedPhysicalPoBox.zipCode
              : null
            : this.selectedBillingPoBox
            ? this.selectedBillingPoBox.zipCode
            : null,
          poBox: this.brokerForm.get('isCheckedBillingAddress').value
            ? this.selectedPhysicalPoBox
              ? this.brokerForm.get('physicalPoBox').value
              : null
            : this.brokerForm.get('billingPoBox').value,
        };
        billingAddress = null;
      }
    }
    return { mainAddress, billingAddress, mainPoBox, billingPoBox };
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
