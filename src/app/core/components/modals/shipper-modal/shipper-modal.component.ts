import {
  addressUnitValidation,
  addressValidation,
  businessNameValidation,
  departmentValidation,
  emailRegex,
  emailValidation,
  phoneExtension,
} from './../../shared/ta-input/ta-input.regex-validations';
import { ShipperModalResponse } from './../../../../../../appcoretruckassist/model/shipperModalResponse';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import {
  AddressEntity,
  CreateRatingCommand,
  CreateReviewCommand,
  CreateShipperCommand,
  ShipperResponse,
  SignInResponse,
  UpdateReviewCommand,
  UpdateShipperCommand,
} from 'appcoretruckassist';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { phoneRegex } from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { HttpResponseBase } from '@angular/common/http';
import { ReviewCommentModal } from '../../shared/ta-user-review/ta-user-review.component';
import {
  LikeDislikeModel,
  TaLikeDislikeService,
} from '../../shared/ta-like-dislike/ta-like-dislike.service';
import { ReviewsRatingService } from 'src/app/core/services/reviews-rating/reviewsRating.service';
import { ShipperTService } from '../../customer/state/shipper-state/shipper.service';
import { FormService } from 'src/app/core/services/form/form.service';

@UntilDestroy()
@Component({
  selector: 'app-shipper-modal',
  templateUrl: './shipper-modal.component.html',
  styleUrls: ['./shipper-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  encapsulation: ViewEncapsulation.None,
  providers: [ModalService, TaLikeDislikeService, FormService],
})
export class ShipperModalComponent implements OnInit, OnDestroy {
  @Input() editData: any = null;

  public shipperForm: FormGroup;

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

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public selectedAddress: AddressEntity = null;

  public isAppointmentReceiving: boolean = false;
  public isAppointmentShipping: boolean = false;

  public selectedContractDepartmentFormArray: any[] = [];

  public labelsDepartments: any[] = [];
  public isContactCardsScrolling: boolean = false;

  public reviews: any[] = [];

  public isPhoneExtExist: boolean = false;

  public shipperDnuStatus: boolean = true;
  public shipperBanStatus: boolean = true;

  public companyUser: SignInResponse = null;

  public isDirty: boolean;

  public disableOneMoreReview: boolean = false;

  public user: SignInResponse = JSON.parse(localStorage.getItem('user'));

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private shipperModalService: ShipperTService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private taLikeDislikeService: TaLikeDislikeService,
    private reviewRatingService: ReviewsRatingService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getShipperDropdowns();

    if (this.editData) {
      this.editShipperById(this.editData.id);
      this.tabs.push({
        id: 3,
        name: 'Review',
      });
      this.ratingChanges();
    }

    this.companyUser = JSON.parse(localStorage.getItem('user'));
  }

  private createForm() {
    this.shipperForm = this.formBuilder.group({
      businessName: [null, [Validators.required, ...businessNameValidation]],
      phone: [null, phoneRegex],
      phoneExt: [null, [...phoneExtension]],
      email: [null, [emailRegex, ...emailValidation]],
      address: [null, [Validators.required, ...addressValidation]],
      addressUnit: [null, [...addressUnitValidation]],
      receivingAppointment: [false],
      receivingOpenTwentyFourHours: [false],
      receivingFrom: [null],
      receivingTo: [null],
      shippingHoursSameReceiving: [true],
      shippingAppointment: [false],
      shippingOpenTwentyFourHours: [false],
      shippingFrom: [null],
      shippingTo: [null],
      note: [null],
      shipperContacts: this.formBuilder.array([]),
    });

    // this.formService.checkFormChange(this.shipperForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    if (data.action === 'bfb' || data.action === 'dnu') {
      // DNU
      if (data.action === 'dnu' && this.editData) {
        this.shipperModalService
          .changeDnuStatus(this.editData.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: HttpResponseBase) => {
              if (res.status === 200 || res.status === 204) {
                this.shipperDnuStatus = !this.shipperDnuStatus;
                this.modalService.changeModalStatus({
                  name: 'dnu',
                  status: this.shipperDnuStatus,
                });
                this.notificationService.success(
                  `Shipper ${
                    this.shipperDnuStatus
                      ? 'status changed to DNU'
                      : 'removed from DNU'
                  }.`,
                  'Success:'
                );
              }
            },
            error: () => {
              this.notificationService.error(
                "Shipper status can't be changed.",
                'Success:'
              );
            },
          });
      }
      // BFB
      if (data.action === 'bfb' && this.editData) {
        this.shipperForm.get('ban').patchValue(data.bool);
        this.shipperModalService
          .changeBanStatus(this.editData.id)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: HttpResponseBase) => {
              if (res.status === 200 || res.status === 204) {
                this.shipperBanStatus = !this.shipperBanStatus;
                this.modalService.changeModalStatus({
                  name: 'bfb',
                  status: this.shipperBanStatus,
                });
                this.notificationService.success(
                  `Shipper ${
                    this.shipperBanStatus
                      ? 'status changed to BAN'
                      : 'removed from BAN'
                  } .`,
                  'Success:'
                );
              }
            },
            error: () => {
              this.notificationService.error(
                "Shipper status can't be changed.",
                'Success:'
              );
            },
          });
      }
    } else {
      if (data.action === 'close') {
        this.shipperForm.reset();
      } else {
        // Save & Update
        if (data.action === 'save') {
          if (this.shipperForm.invalid) {
            this.inputService.markInvalid(this.shipperForm);
            return;
          }
          if (this.editData) {
            this.updateShipper(this.editData.id);
            this.modalService.setModalSpinner({
              action: null,
              status: true,
            });
          } else {
            this.addShipper();
            this.modalService.setModalSpinner({
              action: null,
              status: true,
            });
          }
        }
        // Delete
        if (data.action === 'delete' && this.editData) {
          this.deleteShipperById(this.editData.id);
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

  public get shipperContacts(): FormArray {
    return this.shipperForm.get('shipperContacts') as FormArray;
  }

  private createShipperContacts(data?: {
    fullName: any;
    departmentId: any;
    phone: any;
    phoneExt: any;
    email: any;
  }): FormGroup {
    return this.formBuilder.group({
      fullName: [data?.fullName ? data.fullName : null, Validators.required],
      departmentId: [
        data?.departmentId ? data.departmentId : null,
        [Validators.required, ...departmentValidation],
      ],
      phone: [
        data?.phone ? data.phone : null,
        [Validators.required, phoneRegex],
      ],
      phoneExt: [data?.phoneExt ? data.phoneExt : null],
      email: [
        data?.email ? data.email : null,
        [emailRegex, ...emailValidation],
      ],
    });
  }

  public addShipperContacts(event: { check: boolean; action: string }) {
    if (event.check) {
      this.shipperContacts.push(this.createShipperContacts());
    }
  }

  public removeShipperContacts(id: number) {
    this.shipperContacts.removeAt(id);
    this.selectedContractDepartmentFormArray.splice(id, 1);
  }

  public onScrollingShipperContacts(event: any) {
    if (event.target.scrollLeft > 1) {
      this.isContactCardsScrolling = true;
    } else {
      this.isContactCardsScrolling = false;
    }
  }

  public onHandleAddress(event: { address: AddressEntity; valid: boolean }) {
    if (event.valid) this.selectedAddress = event.address;
  }

  public onSelectContactDepartment(event: any, ind: number) {
    this.selectedContractDepartmentFormArray[ind] = event;
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

  public createReview(event: { check: boolean; action: string }) {
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
      .pipe(untilDestroyed(this))
      .subscribe((action: LikeDislikeModel) => {
        let rating: CreateRatingCommand = null;

        if (action.action === 'liked') {
          rating = {
            entityTypeRatingId: 3,
            entityTypeId: this.editData.id,
            thumb: action.likeDislike,
          };
        } else {
          rating = {
            entityTypeRatingId: 3,
            entityTypeId: this.editData.id,
            thumb: action.likeDislike,
          };
        }

        this.reviewRatingService
          .addRating(rating)
          .pipe(untilDestroyed(this))
          .subscribe({
            next: (res: any) => {
              this.editShipperById(this.editData.id);
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
      entityTypeReviewId: 3,
      entityTypeId: this.editData.id,
      comment: reviews.data.commentContent,
    };

    this.reviewRatingService
      .addReview(review)
      .pipe(untilDestroyed(this))
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
      .pipe(untilDestroyed(this))
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
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Review successfully updated.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Review can't be updated.", 'Error:');
        },
      });
  }

  public addNewReview(event: any) {
    this.reviews.unshift({
      id: Math.random() * 100,
      companyUser: {
        id: Math.random() * 100,
        fullName: 'Angela Martin',
        image: 'https://picsum.photos/id/237/200/300',
        reaction: '',
      },
      comment: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isNewReview: true,
    });
  }

  private addShipper() {
    const { address, addressUnit, shipperContacts, ...form } =
      this.shipperForm.value;
    let receivingShipping = this.receivingShippingObject();
    let newData: CreateShipperCommand = {
      ...form,
      address: {
        ...this.selectedAddress,
        addressUnit: this.shipperForm.get('addressUnit').value,
      },
      receivingFrom: receivingShipping.receiving.receivingFrom,
      receivingTo: receivingShipping.receiving.receivingTo,
      shippingAppointment: receivingShipping.shipping.shippingAppointment,
      shippingOpenTwentyFourHours:
        receivingShipping.shipping.shippingOpenTwentyFourHours,
      shippingFrom: receivingShipping.shipping.shippingFrom,
      shippingTo: receivingShipping.shipping.shippingTo,
    };

    for (let index = 0; index < shipperContacts.length; index++) {
      shipperContacts[index].departmentId =
        this.selectedContractDepartmentFormArray[index].id;
    }

    newData = {
      ...newData,
      shipperContacts,
    };

    let shipperBuisnisName = this.shipperForm.value.businessName;
    this.shipperModalService
      .addShipper(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            `Shipper "${shipperBuisnisName}" added`,
            'Success'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error(
            `Failed to add Shipper "${shipperBuisnisName}"`,
            'Error'
          );
        },
      });
  }

  private updateShipper(id: number) {
    const { address, addressUnit, shipperContacts, ...form } =
      this.shipperForm.value;

    let receivingShipping = this.receivingShippingObject();

    let newData: UpdateShipperCommand = {
      id: id,
      ...form,
      address: {
        ...this.selectedAddress,
        addressUnit: this.shipperForm.get('addressUnit').value,
      },
      receivingFrom: receivingShipping.receiving.receivingFrom,
      receivingTo: receivingShipping.receiving.receivingTo,
      shippingAppointment: receivingShipping.shipping.shippingAppointment,
      shippingOpenTwentyFourHours:
        receivingShipping.shipping.shippingOpenTwentyFourHours,
      shippingFrom: receivingShipping.shipping.shippingFrom,
      shippingTo: receivingShipping.shipping.shippingTo,
    };

    for (let index = 0; index < shipperContacts.length; index++) {
      shipperContacts[index].departmentId =
        this.selectedContractDepartmentFormArray[index].id;
    }

    newData = {
      ...newData,
      shipperContacts,
    };

    this.shipperModalService
      .updateShipper(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Shipper successfully updated.',
            'Error:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Shipper can't be updated.", 'Error:');
        },
      });
  }

  private deleteShipperById(id: number) {
    this.shipperModalService
      .deleteShipperById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Shipper successfully deleted.',
            'Error:'
          );
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
        },
        error: () => {
          this.notificationService.error("Shipper can't be deleted.", 'Error:');
        },
      });
  }

  private editShipperById(id: number) {
    this.shipperModalService
      .getShipperById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (reasponse: ShipperResponse) => {
          this.shipperForm.patchValue({
            businessName: reasponse.businessName,
            phone: reasponse.phone,
            phoneExt: reasponse.phoneExt,
            email: reasponse.email,
            address: reasponse.address.address,
            addressUnit: reasponse.address.addressUnit,
            receivingAppointment: reasponse.receivingAppointment,
            receivingOpenTwentyFourHours:
              reasponse.receivingOpenTwentyFourHours,
            receivingFrom: reasponse.receivingFrom,
            receivingTo: reasponse.receivingTo,
            shippingHoursSameReceiving: reasponse.shippingHoursSameReceiving,
            shippingAppointment: reasponse.shippingAppointment,
            shippingOpenTwentyFourHours: reasponse.shippingOpenTwentyFourHours,
            shippingFrom: reasponse.shippingFrom,
            shippingTo: reasponse.shippingTo,
            note: reasponse.note,
            shipperContacts: [],
          });

          this.selectedAddress = reasponse.address;
          this.isPhoneExtExist = reasponse.phoneExt ? true : false;

          if (reasponse.phoneExt) {
            this.isPhoneExtExist = true;
          }

          if (reasponse.shipperContacts.length) {
            for (const contact of reasponse.shipperContacts) {
              this.shipperContacts.push(
                this.createShipperContacts({
                  fullName: contact.fullName,
                  departmentId: contact.department
                    ? contact.department.name
                    : null,
                  phone: contact.phone,
                  phoneExt: contact.phoneExt,
                  email: contact.email,
                })
              );
              this.selectedContractDepartmentFormArray.push(contact.department);
            }
          }

          if (reasponse.receivingAppointment) {
            this.isAppointmentReceiving = true;
          }

          if (
            reasponse.shippingAppointment ||
            reasponse.shippingHoursSameReceiving
          ) {
            this.isAppointmentShipping = true;
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
            (item) => item.companyUser.id === this.user.companyUserId
          );

          if (reviewIndex !== -1) {
            this.disableOneMoreReview = true;
          }

          this.taLikeDislikeService.populateLikeDislikeEvent({
            downRatingCount: reasponse.downCount,
            upRatingCount: reasponse.upCount,
            currentCompanyUserRating: reasponse.currentCompanyUserRating,
          });
        },
        error: () => {
          this.notificationService.error("Shipper can't be loaded.", 'Error:');
        },
      });
  }

  private getShipperDropdowns() {
    this.shipperModalService
      .getShipperDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: ShipperModalResponse) => {
          this.labelsDepartments = res.departments;
        },
        error: () => {
          this.notificationService.error(
            "Shipper dropdowns can't be loaded.",
            'Error:'
          );
        },
      });
  }

  public onAppontmentShipping() {
    this.isAppointmentShipping = !this.isAppointmentShipping;
    this.shipperForm
      .get('shippingAppointment')
      .patchValue(this.isAppointmentShipping);
  }

  public onAppontmentReceiving() {
    this.isAppointmentReceiving = !this.isAppointmentReceiving;
    this.shipperForm
      .get('receivingAppointment')
      .patchValue(this.isAppointmentReceiving);
  }

  public receivingShippingObject(): {
    receiving;
    shipping;
  } {
    let receiving: any = null;
    let shipping: any = null;

    if (
      this.shipperForm.get('receivingAppointment').value &&
      this.shipperForm.get('receivingOpenTwentyFourHours').value
    ) {
      receiving = {
        receivingFrom: null,
        receivingTo: null,
      };
    } else {
      receiving = {
        receivingFrom: this.shipperForm.get('receivingFrom').value,
        receivingTo: this.shipperForm.get('receivingTo').value,
      };
    }

    if (this.shipperForm.get('shippingHoursSameReceiving').value) {
      shipping = {
        shippingAppointment: this.shipperForm.get('receivingAppointment').value,
        shippingOpenTwentyFourHours: this.shipperForm.get(
          'receivingOpenTwentyFourHours'
        ).value,
        shippingFrom: receiving.receivingFrom,
        shippingTo: receiving.receivingTo,
      };
    } else {
      if (
        this.shipperForm.get('shippingOpenTwentyFourHours').value &&
        this.shipperForm.get('shippingAppointment').value
      ) {
        shipping = {
          shippingAppointment: this.shipperForm.get('shippingAppointment')
            .value,
          shippingOpenTwentyFourHours: this.shipperForm.get(
            'shippingOpenTwentyFourHours'
          ).value,
          shippingFrom: null,
          shippingTo: null,
        };
      } else {
        shipping = {
          shippingAppointment: this.shipperForm.get('shippingAppointment')
            .value,
          shippingOpenTwentyFourHours: this.shipperForm.get(
            'shippingOpenTwentyFourHours'
          ).value,
          shippingFrom: this.shipperForm.get('shippingFrom').value,
          shippingTo: this.shipperForm.get('shippingTo').value,
        };
      }
    }
    return { receiving, shipping };
  }

  ngOnDestroy(): void {}
}
