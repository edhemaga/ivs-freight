import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil, switchMap } from 'rxjs';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Enums
import { ShipperModalString } from '@pages/customer/pages/shipper-modal/enums';

// Validators
import {
    addressUnitValidation,
    addressValidation,
    businessNameValidation,
    phoneExtension,
    phoneFaxRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';
import {
    latitudeValidator,
    longitudeValidator,
} from '@shared/validators/long-lat-validations';

// Services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import {
    LikeDislikeModel,
    TaLikeDislikeService,
} from '@shared/components/ta-like-dislike/services/ta-like-dislike.service';
import { ShipperService } from '@pages/customer/services/shipper.service';
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';
import { FormService } from '@shared/services/form.service';
import { AddressService } from '@shared/services/address.service';

// Animations
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// Components
import { TaUserReviewComponent } from '@shared/components/ta-user-review/ta-user-review.component';
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Constants
import { ShipperModalConfiguration } from '@pages/customer/pages/shipper-modal/utils/constants';

// Config
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { ShipperModalConfig } from '@pages/customer/pages/shipper-modal/utils/configs';

// Enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';

// svg routes
import { BrokerModalSvgRoutes } from '@pages/customer/pages/broker-modal/utils/svg-routes/broker-modal-svg-routes';

// Models
import {
    ShipperModalResponse,
    AddressEntity,
    CreateRatingCommand,
    CreateReviewCommand,
    SignInResponse,
    UpdateReviewCommand,
    ShipperResponse,
    ReviewResponse,
    DepartmentResponse,
} from 'appcoretruckassist';
import { ReviewComment } from '@shared/models/review-comment.model';
import { Tabs } from '@shared/models/tabs.model';
import { ShipperContactExtended } from '@pages/customer/pages/shipper-modal/models';

@Component({
    selector: 'app-shipper-modal',
    templateUrl: './shipper-modal.component.html',
    styleUrls: ['./shipper-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, TaLikeDislikeService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbModule,

        // Component
        TaAppTooltipV2Component,
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        TaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaCheckboxComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaUserReviewComponent,
        TaInputDropdownComponent,
        TaModalTableComponent,
    ],
})
export class ShipperModalComponent implements OnInit, OnDestroy {
    @Input() editData: any = null;

    private destroy$ = new Subject<void>();

    public shipperForm: UntypedFormGroup;
    public shipperName: string;

    public companyUser: SignInResponse;

    public modalTableTypeEnum = ModalTableTypeEnum;
    public brokerModalSvgRoutes = BrokerModalSvgRoutes;

    public selectedTab: number = 1;
    public tabs: Tabs[];

    public selectedPhysicalAddressTab: number = 1;
    public physicalAddressTabs: Tabs[] = [
        ...ShipperModalConfiguration.physicalAddressTabs,
    ];

    public selectedAddress: AddressEntity;

    public isAppointmentReceiving: boolean = false;
    public isAppointmentShipping: boolean = false;

    public isFormDirty: boolean;
    public isCardAnimationDisabled: boolean = false;
    public isPhoneExtExist: boolean = false;

    public addNewAfterSave: boolean = false;
    public disableOneMoreReview: boolean = false;

    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };

    public longitude: number;
    public latitude: number;

    // documents
    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    // contacts
    public shipperContacts: ShipperContactExtended[] = [];
    public updatedShipperContacts: ShipperContactExtended[] = [];

    public isNewContactAdded: boolean = false;
    public isEachContactRowValid: boolean = true;

    public departmentOptions: DepartmentResponse[] = [];

    // reviews
    public reviews: any[] = [];

    constructor(
        private formBuilder: UntypedFormBuilder,

        // change detection
        private cdRef: ChangeDetectorRef,

        //Services
        private inputService: TaInputService,
        private shipperService: ShipperService,
        private modalService: ModalService,
        private taLikeDislikeService: TaLikeDislikeService,
        private reviewRatingService: ReviewsRatingService,
        private formService: FormService,
        private addressService: AddressService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getShipperDropdowns();

        this.companyUser = JSON.parse(localStorage.getItem('user'));

        this.shipperForm
            .get(ShipperModalString.LONGITUDE)
            .valueChanges.subscribe(() => this.longLatChanged());
        this.shipperForm
            .get(ShipperModalString.LATITUDE)
            .valueChanges.subscribe(() => this.longLatChanged());
    }

    private createForm() {
        this.shipperForm = this.formBuilder.group({
            businessName: [
                null,
                [Validators.required, ...businessNameValidation],
            ],
            phone: [null, phoneFaxRegex],
            phoneExt: [null, [...phoneExtension]],
            email: [null],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            longitude: [null],
            latitude: [null],
            countryStateAddress: [null, [...addressValidation]],
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
            files: [null],
            contacts: [null],
        });

        this.inputService.customInputValidator(
            this.shipperForm.get('email'),
            'email',
            this.destroy$
        );
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        if (data.action === 'close') {
            switch (this.editData?.key) {
                case 'load-modal': {
                    this.modalService.setProjectionModal({
                        action: 'close',
                        payload: {
                            key: this.editData?.key,
                            value: null,
                        },
                        component: LoadModalComponent,
                        size: 'small',
                        closing: 'fastest',
                    });
                    break;
                }

                default: {
                    break;
                }
            }
            return;
        }
        // Save And Add New
        else if (data.action === 'save and add new') {
            if (this.shipperForm.invalid || !this.isFormDirty) {
                this.inputService.markInvalid(this.shipperForm);
                return;
            }

            this.addShipper(true);

            this.modalService.setModalSpinner({
                action: 'save and add new',
                status: true,
                close: false,
            });

            this.addNewAfterSave = true;
        } else {
            // Save & Update
            if (data.action === 'save') {
                if (this.shipperForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.shipperForm);
                    return;
                }
                if (this.editData?.type.includes('edit')) {
                    this.updateShipper(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addShipper();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
            }
            // Delete
            if (data.action === 'delete' && this.editData) {
                this.modalService.openModal(
                    ConfirmationModalComponent,
                    { size: TableStringEnum.DELETE },
                    {
                        id: this.editData.id,
                        data: this.editData.data,
                        template: TableStringEnum.SHIPPER,
                        type: TableStringEnum.DELETE,
                        svg: true,
                        modalHeaderTitle:
                            ConfirmationModalStringEnum.DELETE_SHIPPER,
                    }
                );

                this.modalService.setModalSpinner({
                    action: null,
                    status: true,
                    close: true,
                });
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

    public addContact(): void {
        if (!this.isEachContactRowValid) return;

        this.isNewContactAdded = true;

        setTimeout(() => {
            this.isNewContactAdded = false;
        }, 400);
    }

    public handleModalTableValueEmit(
        modalTableDataValue: ShipperContactExtended[]
    ): void {
        this.shipperContacts = modalTableDataValue;

        this.shipperForm
            .get(ShipperModalString.CONTACTS)
            .patchValue(this.shipperContacts);

        this.cdRef.detectChanges();
    }

    public handleModalTableValidStatusEmit(
        isEachContactRowValid: boolean
    ): void {
        this.isEachContactRowValid = isEachContactRowValid;
    }

    private mapContacts(
        contacts: ShipperContactExtended[],
        isFormPatch: boolean = false
    ): ShipperContactExtended[] {
        return contacts.map((contact, index) => {
            const { department, phone, email, fullName, phoneExt } = contact;

            return isFormPatch
                ? {
                      fullName,
                      department: (department as DepartmentResponse).name,
                      phone,
                      phoneExt: phoneExt ?? ShipperModalString.EMPTY_STRING,
                      email,
                  }
                : {
                      id: this.updatedShipperContacts[index]?.id,
                      fullName,
                      departmentId: this.departmentOptions.find(
                          (item) => item.name === department
                      )?.id,
                      phone,
                      phoneExt,
                      email,
                  };
        });
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
        longLat: any;
    }) {
        if (event.valid) {
            this.selectedAddress = event.address;
            this.longitude = event.longLat.longitude;
            this.latitude = event.longLat.latitude;
        }
    }

    public changeReviewsEvent(reviews: ReviewComment) {
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

    // ------- Review ------
    public createReview() {
        if (
            this.reviews.some((item) => item.isNewReview) ||
            this.disableOneMoreReview
        ) {
            return;
        }

        this.reviews.unshift({
            companyUser: {
                fullName: this.companyUser.firstName.concat(
                    ' ',
                    this.companyUser.lastName
                ),
                /* avatar: this.companyUser.avatar, */
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
                    .pipe(
                        takeUntil(this.destroy$),
                        switchMap(() => {
                            return this.shipperService.getShipperById(
                                this.editData.id
                            );
                        })
                    )
                    .subscribe({
                        next: (res: ShipperResponse) => {
                            if (res.ratingReviews.length) {
                                this.reviews = res.ratingReviews.map(
                                    (item: ReviewResponse) => ({
                                        ...item,
                                        companyUser: {
                                            ...item.companyUser,
                                            /*  avatar: item.companyUser.avatar, */
                                        },
                                        commentContent: item.comment,
                                        rating: item.ratingFromTheReviewer,
                                    })
                                );

                                const reviewIndex = this.reviews.findIndex(
                                    (item) =>
                                        item.companyUser.id ===
                                        this.companyUser.companyUserId
                                );

                                if (reviewIndex !== -1) {
                                    this.disableOneMoreReview = true;
                                }
                            }

                            this.taLikeDislikeService.populateLikeDislikeEvent({
                                downRatingCount: res.downCount,
                                upRatingCount: res.upCount,
                                currentCompanyUserRating:
                                    res.currentCompanyUserRating,
                            });
                        },
                        error: () => {},
                    });
            });
    }

    private addReview(reviews: ReviewComment) {
        const review: CreateReviewCommand = {
            entityTypeReviewId: 3,
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
                },
                error: () => {},
            });
    }

    private deleteReview(reviews: ReviewComment) {
        this.reviews = reviews.sortData;
        this.disableOneMoreReview = false;
        this.reviewRatingService
            .deleteReview(reviews.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private updateReview(reviews: ReviewComment) {
        this.reviews = reviews.sortData;
        const review: UpdateReviewCommand = {
            id: reviews.data.id,
            comment: reviews.data.commentContent,
        };

        this.reviewRatingService
            .updateReview(review)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private addShipper(isSaveAndAddNew?: boolean) {
        const { addressUnit, longitude, latitude, ...form } =
            this.shipperForm.value;

        let receivingShipping = this.receivingShippingObject();

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const shipperContacts = this.mapContacts(this.shipperContacts);

        const newData = {
            ...form,
            address: {
                ...this.selectedAddress,
                addressUnit,
            },
            receivingFrom: receivingShipping.receiving.receivingFrom,
            receivingTo: receivingShipping.receiving.receivingTo,
            shippingAppointment: receivingShipping.shipping.shippingAppointment,
            shippingOpenTwentyFourHours:
                receivingShipping.shipping.shippingOpenTwentyFourHours,
            shippingFrom: receivingShipping.shipping.shippingFrom,
            shippingTo: receivingShipping.shipping.shippingTo,
            files: documents,
            longitude:
                this.selectedPhysicalAddressTab === 1
                    ? this.longitude
                    : longitude,
            latitude:
                this.selectedPhysicalAddressTab === 1
                    ? this.latitude
                    : latitude,
            locationType: this.selectedPhysicalAddressTab,
            shipperContacts,
        };

        this.shipperService
            .addShipper(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal && !isSaveAndAddNew) {
                        switch (this.editData?.key) {
                            case 'load-modal': {
                                this.modalService.setProjectionModal({
                                    action: 'close',
                                    payload: {
                                        key: this.editData?.key,
                                        value: null,
                                    },
                                    component: LoadModalComponent,
                                    size: 'small',
                                    closing: 'slowlest',
                                });
                                break;
                            }

                            default: {
                                break;
                            }
                        }
                    }
                    if (this.addNewAfterSave) {
                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                            close: false,
                        });

                        this.formService.resetForm(this.shipperForm);

                        this.selectedAddress = null;

                        this.isPhoneExtExist = false;

                        this.shipperForm
                            .get('shippingHoursSameReceiving')
                            .patchValue(true);

                        this.selectedTab = 1;
                        this.tabs = this.tabs.map((item, index) => {
                            return {
                                ...item,
                                checked: index === 0,
                            };
                        });

                        this.isAppointmentShipping = false;
                        this.isAppointmentReceiving = false;

                        this.documents = [];
                        this.fileModified = false;
                        this.filesForDelete = [];

                        this.addNewAfterSave = false;
                    } else {
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: true,
                        });
                    }
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private updateShipper(id: number) {
        const { addressUnit, ...form } = this.shipperForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        let receivingShipping = this.receivingShippingObject();

        const shipperContacts = this.mapContacts(this.shipperContacts);

        const newData = {
            id: id,
            ...form,
            address: {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            },
            receivingFrom: receivingShipping.receiving.receivingFrom,
            receivingTo: receivingShipping.receiving.receivingTo,
            shippingAppointment: receivingShipping.shipping.shippingAppointment,
            shippingOpenTwentyFourHours:
                receivingShipping.shipping.shippingOpenTwentyFourHours,
            shippingFrom: receivingShipping.shipping.shippingFrom,
            shippingTo: receivingShipping.shipping.shippingTo,
            files: documents ?? this.shipperForm.value.files,
            filesForDeleteIds: this.filesForDelete,
            locationType: this.selectedPhysicalAddressTab,
            longitude:
                this.selectedPhysicalAddressTab === 1
                    ? this.longitude
                    : this.shipperForm.get(ShipperModalString.LONGITUDE).value,
            latitude:
                this.selectedPhysicalAddressTab === 1
                    ? this.latitude
                    : this.shipperForm.get(ShipperModalString.LATITUDE).value,
            shipperContacts,
        };

        this.shipperService
            .updateShipper(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal) {
                        switch (this.editData?.key) {
                            case 'load-modal': {
                                this.modalService.setModalSpinner({
                                    action: null,
                                    status: true,
                                    close: true,
                                });
                                this.modalService.setProjectionModal({
                                    action: 'close',
                                    payload: {
                                        key: this.editData?.key,
                                        value: null,
                                    },
                                    component: LoadModalComponent,
                                    size: 'small',
                                    closing: 'slowlest',
                                });

                                break;
                            }

                            default: {
                                break;
                            }
                        }
                    } else {
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: true,
                        });
                    }
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private editShipperById(id: number) {
        this.shipperService
            .getShipperById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.shipperForm.patchValue({
                        businessName: res.businessName,
                        phone: res.phone,
                        phoneExt: res.phoneExt,
                        email: res.email,
                        address: res.address.address,
                        addressUnit: res.address.addressUnit,
                        receivingAppointment: res.receivingAppointment,
                        receivingOpenTwentyFourHours:
                            res.receivingOpenTwentyFourHours,
                        receivingFrom:
                            res.receivingAppointment &&
                            res.receivingOpenTwentyFourHours
                                ? null
                                : res.receivingFrom,
                        receivingTo:
                            res.receivingAppointment &&
                            res.receivingOpenTwentyFourHours
                                ? null
                                : res.receivingTo,
                        shippingHoursSameReceiving:
                            res.shippingHoursSameReceiving,
                        shippingAppointment: res.shippingAppointment,
                        shippingOpenTwentyFourHours:
                            res.shippingOpenTwentyFourHours,
                        shippingFrom:
                            res.shippingHoursSameReceiving &&
                            res.shippingAppointment
                                ? null
                                : res.shippingFrom
                                ? MethodsCalculationsHelper.convertTimeFromBackend(
                                      res.shippingFrom
                                  )
                                : null,
                        shippingTo:
                            res.shippingHoursSameReceiving &&
                            res.shippingAppointment
                                ? null
                                : res.shippingTo
                                ? MethodsCalculationsHelper.convertTimeFromBackend(
                                      res.shippingTo
                                  )
                                : null,
                        note: res.note,
                        contacts: this.mapContacts(res.shipperContacts, true),
                    });

                    // Contacts
                    this.updatedShipperContacts = res.shipperContacts;

                    this.shipperName = res.businessName;

                    this.selectedAddress = res.address;
                    this.isPhoneExtExist = !!res.phoneExt;
                    this.documents = res.files;
                    this.longitude = res.longitude;
                    this.latitude = res.latitude;

                    if (res.phoneExt) {
                        this.isPhoneExtExist = true;
                    }

                    if (res.receivingAppointment) {
                        this.isAppointmentReceiving = true;
                    }

                    if (
                        res.shippingAppointment ||
                        res.shippingHoursSameReceiving
                    ) {
                        this.isAppointmentShipping = true;
                    }

                    this.reviews = res?.reviews?.map((item: any) => ({
                        ...item,
                        companyUser: {
                            ...item.companyUser,
                            avatar: item.companyUser.avatar,
                        },
                        commentContent: item.comment,
                        rating: item.ratingFromTheReviewer,
                    }));

                    const reviewIndex = this.reviews?.findIndex(
                        (item) =>
                            item.companyUser.id ===
                            this.companyUser.companyUserId
                    );

                    if (reviewIndex !== -1) {
                        this.disableOneMoreReview = true;
                    }

                    this.taLikeDislikeService.populateLikeDislikeEvent({
                        downRatingCount: res.downCount,
                        upRatingCount: res.upCount,
                        currentCompanyUserRating: res.currentCompanyUserRating,
                    });

                    this.physicalAddressTabs = this.physicalAddressTabs.map(
                        (item) => {
                            return {
                                ...item,
                                checked: item.id == res.locationType.id,
                            };
                        }
                    );

                    this.selectedPhysicalAddressTab = res.locationType.id;

                    this.setAddressValidations(res.locationType.name);

                    if (this.selectedPhysicalAddressTab === 2)
                        this.shipperForm.patchValue({
                            longitude: res.longitude,
                            latitude: res.latitude,
                        });

                    this.startFormChanges();

                    setTimeout(() => {
                        this.isCardAnimationDisabled = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private getShipperDropdowns() {
        this.shipperService
            .getShipperDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: ShipperModalResponse) => {
                    this.departmentOptions = res.departments;
                    this.tabs = ShipperModalConfiguration.shipperTabs();

                    // From Another Modal Data
                    if (this.editData?.type === 'edit-contact') {
                        this.isCardAnimationDisabled = true;

                        this.editShipperById(this.editData.id);

                        setTimeout(() => {
                            this.tabs = this.tabs.map((item, index) => {
                                return {
                                    ...item,
                                    disabled: index !== 1,
                                    checked: index === 1,
                                };
                            });

                            this.selectedTab = 2;
                        }, 50);
                    }
                    // Normal Get By Id
                    else {
                        if (this.editData?.id) {
                            this.isCardAnimationDisabled = true;

                            this.editShipperById(this.editData.id);

                            // this.tabs.push({
                            //     id: 3,
                            //     name: 'Review',
                            // }); this is not going into first spring
                            this.ratingChanges();
                        } else {
                            this.startFormChanges();
                        }
                    }

                    if (this.editData) {
                        this.tabs = this.tabs.map((tab) => ({
                            ...tab,
                            checked: tab.name === this.editData?.openedTab,
                        }));
                    }

                    // Open Tab Position
                    if (this.editData?.openedTab) {
                        setTimeout(() => {
                            this.tabChange({
                                id:
                                    this.editData?.openedTab === 'Additional'
                                        ? 2
                                        : this.editData?.openedTab === 'Review'
                                        ? 3
                                        : 1,
                            });

                            this.isCardAnimationDisabled = true;
                        });
                    }
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
                shippingAppointment: this.shipperForm.get(
                    'receivingAppointment'
                ).value,
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
                    shippingAppointment: this.shipperForm.get(
                        'shippingAppointment'
                    ).value,
                    shippingOpenTwentyFourHours: this.shipperForm.get(
                        'shippingOpenTwentyFourHours'
                    ).value,
                    shippingFrom: null,
                    shippingTo: null,
                };
            } else {
                shipping = {
                    shippingAppointment: this.shipperForm.get(
                        'shippingAppointment'
                    ).value,
                    shippingOpenTwentyFourHours: this.shipperForm.get(
                        'shippingOpenTwentyFourHours'
                    ).value,
                    shippingFrom:
                        this.shipperForm.get('shippingFrom').value ?? null,
                    shippingTo:
                        this.shipperForm.get('shippingTo').value ?? null,
                };
            }
        }
        return { receiving, shipping };
    }

    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case 'add': {
                this.shipperForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.shipperForm
                    .get('files')
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) {
                    this.filesForDelete.push(event.deleteId);
                }

                this.fileModified = true;
                break;
            }
            default: {
                break;
            }
        }
    }

    public tabPhysicalAddressChange(event: Tabs): void {
        this.selectedPhysicalAddressTab = event.id;

        this.setAddressValidations(event.name, true);

        this.physicalAddressTabs = this.physicalAddressTabs.map((item) => {
            return {
                ...item,
                checked: item.id === this.selectedPhysicalAddressTab,
            };
        });
    }

    private setAddressValidations(type: string, tabChanged?: boolean): void {
        const longitudeControl = this.shipperForm.get(
            ShipperModalString.LONGITUDE
        );
        const latitudeControl = this.shipperForm.get(
            ShipperModalString.LATITUDE
        );
        const addressControl = this.shipperForm.get(
            ShipperModalString.ADDRESS_1
        );
        const countryStateAddress = this.shipperForm.get(
            ShipperModalString.COUNTRY_ADDRESS
        );

        if (tabChanged) this.selectedAddress = null;

        if (type === ShipperModalString.COORDINATES) {
            longitudeControl.setValidators([
                Validators.required,
                longitudeValidator(),
            ]);
            latitudeControl.setValidators([
                Validators.required,
                latitudeValidator(),
            ]);

            addressControl.clearValidators();
            addressControl.setErrors(null);
            addressControl.setValue(null);
        } else {
            longitudeControl.clearValidators();
            latitudeControl.clearValidators();

            longitudeControl.setValue(null);
            latitudeControl.setValue(null);
            countryStateAddress.setValue(null);
            if (tabChanged) addressControl.setValue(null);
            addressControl.setValidators([
                Validators.required,
                ...addressValidation,
            ]);
        }

        longitudeControl.updateValueAndValidity();
        latitudeControl.updateValueAndValidity();
        addressControl.updateValueAndValidity();
        countryStateAddress.updateValueAndValidity();
    }

    private longLatChanged(): void {
        const longitudeControl = this.shipperForm.get(
            ShipperModalString.LONGITUDE
        );
        const latitudeControl = this.shipperForm.get(
            ShipperModalString.LATITUDE
        );

        if (
            longitudeControl.valid &&
            longitudeControl.value &&
            latitudeControl.valid &&
            latitudeControl.value
        ) {
            this.addressService
                .getAddressByLongLat(
                    [ShipperModalString.ADDRESS],
                    this.shipperForm.get(ShipperModalString.LONGITUDE).value,
                    this.shipperForm.get(ShipperModalString.LATITUDE).value
                )
                .pipe()
                .subscribe((res) => {
                    this.shipperForm.patchValue({
                        countryStateAddress:
                            res?.county + ', ' + res.stateShortName,
                        address: res.address,
                    });

                    this.selectedAddress = res;
                });
        } else
            this.shipperForm.patchValue({
                countryStateAddress: null,
            });
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.shipperForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    get getAddressInputConfig(): ITaInput {
        return ShipperModalConfig.getAddressInputConfig();
    }

    get getAddressUnitInputConfig(): ITaInput {
        return ShipperModalConfig.getAddressUnitInputConfig();
    }

    get getLongitudeInputConfig(): ITaInput {
        return ShipperModalConfig.getLongitudeInputConfig();
    }

    get getLatitudeInputConfig(): ITaInput {
        return ShipperModalConfig.getLatitudeInputConfig();
    }

    get getCountryStateInputConfig(): ITaInput {
        return ShipperModalConfig.getCountryStateInputConfig();
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
