import {
    AbstractControl,
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

// modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

// enums
import { ShipperModalString } from '@pages/customer/pages/shipper-modal/enums';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';
import { LoadModalStringEnum } from '@pages/load/pages/load-modal/enums';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import { eGeneralActions } from '@shared/enums/general-actions.enum';
import { eStringPlaceholder } from '@shared/enums/string-placeholder.enum';
import { eFileFormControls } from '@shared/enums/file/file-form-controls.enum';

// validators
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

// services
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import {
    LikeDislikeModel,
    TaLikeDislikeService,
} from '@shared/components/ta-like-dislike/services/ta-like-dislike.service';
import { ShipperService } from '@pages/customer/services';
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';
import { FormService } from '@shared/services/form.service';
import { AddressService } from '@shared/services/address.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';
import { LoadStoreService } from '@pages/load/pages/load-table/services/load-store.service';

// animations
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// components
import { TaUserReviewComponent } from '@shared/components/ta-user-review/ta-user-review.component';
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import {
    CaInputAddressDropdownComponent,
    CaInputComponent,
    CaInputDatetimePickerComponent,
    CaModalButtonComponent,
    CaModalComponent,
    CaTabSwitchComponent,
    eModalButtonClassType,
    eModalButtonSize,
} from 'ca-components';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// constants
import { ShipperModalConfiguration } from '@pages/customer/pages/shipper-modal/utils/constants';

// config
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { ShipperModalConfig } from '@pages/customer/pages/shipper-modal/utils/configs';

// svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// pipes
import { FormatDatePipe } from '@shared/pipes';

// models
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
    ShipperLoadModalResponse,
} from 'appcoretruckassist';
import { ReviewComment } from '@shared/models/review-comment.model';
import { Tabs } from '@shared/models/tabs.model';
import { ShipperContactExtended } from '@pages/customer/pages/shipper-modal/models';

// mixing
import { AddressMixin } from '@shared/mixins/address/address.mixin';

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
        CaModalComponent,
        CaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaCheckboxComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaUserReviewComponent,
        TaModalTableComponent,
        CaInputComponent,
        CaModalButtonComponent,
        CaInputDatetimePickerComponent,
        CaTabSwitchComponent,

        // Pipes
        FormatDatePipe,
    ],
})
export class ShipperModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnInit, OnDestroy
{
    @Input() editData;

    public destroy$ = new Subject<void>();

    public shipperForm: UntypedFormGroup;
    public shipperName: string;

    public companyUser: SignInResponse;

    public modalTableTypeEnum = ModalTableTypeEnum;
    public svgRoutes = SharedSvgRoutes;

    public selectedTab: number = 1;
    public tabs: Tabs[] = JSON.parse(
        JSON.stringify(ShipperModalConfiguration.TABS)
    );

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
    public isOneMoreReviewDisabled: boolean = false;

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
    public previousReviews: any[] = [];

    public taModalActionEnum = TaModalActionEnum;

    public activeAction: string;
    public eModalButtonClassType = eModalButtonClassType;
    public eModalButtonSize = eModalButtonSize;
    public shipperModalString = ShipperModalString;

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
        public addressService: AddressService,
        private confirmationService: ConfirmationService,
        private confirmationActivationService: ConfirmationActivationService,
        private ngbActiveModal: NgbActiveModal,
        private loadStoreService: LoadStoreService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();

        this.getShipperDropdowns();

        this.getCompanyUser();

        this.monitorLatAndLong();

        this.confirmationSubscribe();

        this.confirmationDeactivationSubscribe();
    }

    get isModalValidToSubmit(): boolean {
        return (
            this.shipperForm.valid &&
            this.isFormDirty &&
            this.isEachContactRowValid
        );
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

    private confirmationDeactivationSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.ngbActiveModal?.close();
            });
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    const { template, action } = res;

                    if (template === ShipperModalString.DELETE_REVIEW) {
                        const review = {
                            action: res.type,
                            data: res.data.id,
                            sortData: [],
                        };

                        this.deleteReview(false, review);
                    }

                    if (action === ShipperModalString.CLOSE)
                        this.reviews = this.previousReviews;
                },
            });
    }

    private monitorLatAndLong(): void {
        this.shipperForm
            .get(ShipperModalString.LONGITUDE)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => this.longLatChanged());

        this.shipperForm
            .get(ShipperModalString.LATITUDE)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe(() => this.longLatChanged());
    }

    private getCompanyUser(): void {
        this.companyUser = JSON.parse(localStorage.getItem('user'));
    }

    public onModalAction(action: string): void {
        if (this.isModalValidToSubmit) this.activeAction = action;

        if (action === TaModalActionEnum.CLOSE) {
            switch (this.editData?.key) {
                case LoadModalStringEnum.LOAD_MODAL:
                    this.ngbActiveModal.close();
                    this.loadStoreService.dispatchGetCreateLoadModalData();
                    break;
                default:
                    this.ngbActiveModal.close();
                    break;
            }
            return;
        }
        // Save And Add New
        else if (action === TaModalActionEnum.SAVE_AND_ADD_NEW) {
            if (this.shipperForm.invalid || !this.isFormDirty) {
                this.inputService.markInvalid(this.shipperForm);
                return;
            }
            this.addShipper(true);
            this.addNewAfterSave = true;
        } else if (action === TaModalActionEnum.CLOSE_BUSINESS) {
            const mappedEvent = {
                type: this.editData.data.status
                    ? TableStringEnum.CLOSE
                    : TableStringEnum.OPEN,
            };

            this.modalService.openModal(
                ConfirmationActivationModalComponent,
                { size: TableStringEnum.SMALL },
                {
                    ...mappedEvent,
                    data: {
                        id: this.editData.id,
                    },
                    id: this.editData.id,
                    template: TableStringEnum.INFO,
                    subType: TableStringEnum.SHIPPER_3,
                    subTypeStatus: TableStringEnum.BUSINESS,
                    tableType: ConfirmationActivationStringEnum.SHIPPER_TEXT,
                    modalTitle: this.editData.data.businessName,
                    modalSecondTitle: this.editData.data.address?.address,
                }
            );
        } else {
            // Save & Update
            if (action === TaModalActionEnum.SAVE) {
                if (this.shipperForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.shipperForm);
                    return;
                }
                if (
                    this.editData?.type.includes(eGeneralActions.EDIT_LOWERCASE)
                )
                    this.updateShipper(this.editData.id);
                else this.addShipper();
            }
            // Delete
            if (action === TaModalActionEnum.DELETE && this.editData)
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
        }
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;

        const dotAnimation = document.querySelector(
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

    public changeReviewsEvent(review: ReviewComment): void {
        switch (review.action) {
            case eGeneralActions.DELETE_LOWERCASE:
                this.deleteReview(true, review);
                break;
            case eGeneralActions.ADD:
                this.addReview(review);
                break;
            case eGeneralActions.UPDATE:
                this.updateReview(review);
                break;
            case eGeneralActions.CANCEL:
                this.reviews = [...this.reviews.filter((review) => review.id)];
                break;
            default:
                break;
        }
    }

    private ratingChanges(): void {
        this.taLikeDislikeService.userLikeDislike$
            .pipe(takeUntil(this.destroy$))
            .subscribe((action: LikeDislikeModel) => {
                let rating: CreateRatingCommand = null;

                if (action.action === 'liked')
                    rating = {
                        entityTypeRatingId: 3,
                        entityTypeId: this.editData.id,
                        thumb: action.likeDislike,
                    };
                else
                    rating = {
                        entityTypeRatingId: 3,
                        entityTypeId: this.editData.id,
                        thumb: action.likeDislike,
                    };

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

                                if (reviewIndex !== -1)
                                    this.isOneMoreReviewDisabled = true;
                            }

                            this.taLikeDislikeService.populateLikeDislikeEvent({
                                downRatingCount: res.downCount,
                                upRatingCount: res.upCount,
                                currentCompanyUserRating:
                                    res.currentCompanyUserRating,
                            });
                        },
                    });
            });
    }

    public createReview(): void {
        if (
            this.reviews.some((item) => item.isNewReview) ||
            this.isOneMoreReviewDisabled
        )
            return;

        this.reviews.unshift({
            companyUser: {
                fullName: this.companyUser.firstName.concat(
                    eStringPlaceholder.WHITESPACE,
                    this.companyUser.lastName
                ),
                /*                 avatar: this.companyUser.avatar, */
            },
            commentContent: eStringPlaceholder.EMPTY,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isNewReview: true,
        });
    }

    private addReview(review: ReviewComment): void {
        const reviewData: CreateReviewCommand = {
            entityTypeReviewId: 1,
            entityTypeId: this.editData.id,
            comment: review.data.commentContent,
        };

        this.reviewRatingService
            .addReview(reviewData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.reviews = review.sortData.map((item, index) => {
                        if (index === 0) {
                            return {
                                ...item,
                                id: res.id,
                            };
                        }
                        return item;
                    });

                    this.isOneMoreReviewDisabled = true;
                },
            });
    }

    private deleteReview(isOpenModal: boolean, review?: ReviewComment): void {
        if (isOpenModal) {
            const { id, companyUser, updatedAt } = this.reviews.find(
                (reviewItem) => reviewItem.id === review.data
            );

            const data = {
                id,
                reviewer: companyUser.fullName,
                updatedAt,
                businessName: this.shipperForm.get(
                    ShipperModalString.BUSINESS_NAME
                ).value,
            };

            this.previousReviews = [...this.reviews];

            this.modalService.openModal(
                ConfirmationModalComponent,
                {
                    size: ShipperModalString.SMALL,
                },
                {
                    type: ShipperModalString.DELETE,
                    subType: ShipperModalString.SHIPPER,
                    data,
                    template: ShipperModalString.DELETE_REVIEW,
                }
            );
        } else {
            this.reviews = review.sortData;
            this.isOneMoreReviewDisabled = false;

            this.reviewRatingService
                .deleteReview(review.data)
                .pipe(takeUntil(this.destroy$))
                .subscribe();
        }
    }

    private updateReview(review: ReviewComment): void {
        this.reviews = review.sortData;

        const reviewData: UpdateReviewCommand = {
            id: review.data.id,
            comment: review.data.commentContent,
        };

        this.reviewRatingService
            .updateReview(reviewData)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private getShipperDropdowns(): void {
        this.shipperService
            .getShipperDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: ShipperModalResponse) => {
                    this.departmentOptions = res.departments;

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

                            this.tabs.push({
                                id: 3,
                                name: 'Review',
                            });

                            this.ratingChanges();
                        } else this.startFormChanges();
                    }

                    if (this.editData)
                        this.tabs = this.tabs?.map((tab) => ({
                            ...tab,
                            checked: tab.name === this.editData?.openedTab,
                        }));

                    // Open Tab Position
                    if (this.editData?.openedTab) {
                        this.tabChange({
                            id:
                                this.editData?.openedTab === 'Additional'
                                    ? 2
                                    : this.editData?.openedTab === 'Review'
                                      ? 3
                                      : 1,
                        });

                        this.isCardAnimationDisabled = true;
                    }
                },
            });
    }

    private addShipper(isSaveAndAddNew?: boolean) {
        const { addressUnit, longitude, latitude, ...form } =
            this.shipperForm.value;

        const receivingShipping = this.receivingShippingObject();

        const documents = [];
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
                next: (response) => {
                    if (this.editData?.canOpenModal && !isSaveAndAddNew) {
                        switch (this.editData?.key) {
                            case LoadModalStringEnum.LOAD_MODAL:
                                const { id } = response;
                                const modalSingleShipperitem: ShipperLoadModalResponse =
                                    {
                                        id,
                                        ...newData,
                                    };

                                this.loadStoreService.dispatchAddnewShipperToStaticModalData(
                                    modalSingleShipperitem
                                );

                                this.loadStoreService.dispatchGetCreateLoadModalData();

                                break;
                            default:
                                break;
                        }
                    }
                    this.ngbActiveModal.close();

                    if (this.addNewAfterSave)
                        this.modalService.openModal(ShipperModalComponent, {});
                },
                error: () => {
                    this.activeAction = null;
                },
            });
    }

    private updateShipper(id: number) {
        const { addressUnit, ...form } = this.shipperForm.value;

        const receivingShipping = this.receivingShippingObject();

        const documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const shipperContacts = this.mapContacts(this.shipperContacts);

        const newData = {
            id,
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
                            case LoadModalStringEnum.LOAD_MODAL:
                                this.modalService.setModalSpinner({
                                    action: null,
                                    status: true,
                                    close: true,
                                });
                                this.modalService.setProjectionModal({
                                    action: eGeneralActions.CLOSE,
                                    payload: {
                                        key: this.editData?.key,
                                        value: null,
                                    },
                                    component: LoadModalComponent,
                                    size: 'small',
                                    closing: 'slowlest',
                                });

                                break;
                            default:
                                break;
                        }
                    } else this.ngbActiveModal.close();
                },
                error: () => (this.activeAction = null),
            });
    }

    private editShipperById(id: number): void {
        this.shipperService
            .getShipperById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.shipperForm.patchValue({
                        ...res,
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
                        addressUnit: res?.address?.addressUnit,
                    });

                    this.shipperName = res.businessName;

                    this.selectedAddress = res.address;
                    this.isPhoneExtExist = !!res.phoneExt;
                    this.documents = res.files;
                    this.longitude = res.longitude;
                    this.latitude = res.latitude;

                    if (res.phoneExt) this.isPhoneExtExist = true;

                    if (res.receivingAppointment)
                        this.isAppointmentReceiving = true;

                    if (
                        res.shippingAppointment ||
                        res.shippingHoursSameReceiving
                    )
                        this.isAppointmentShipping = true;

                    // Contacts
                    this.updatedShipperContacts = res.shipperContacts;

                    // Review
                    this.reviews = [
                        ...res.ratingReviews.map((item) => ({
                            ...item,
                            id: item.reviewId,
                            companyUser: {
                                ...item.companyUser,
                            },
                            commentContent: item.comment,
                            rating: item.thumb,
                        })),
                    ];

                    const reviewIndex = this.reviews?.findIndex(
                        (item) =>
                            item.companyUser.id ===
                            this.companyUser.companyUserId
                    );

                    if (reviewIndex !== -1) this.isOneMoreReviewDisabled = true;

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

                    this.cdRef.detectChanges();

                    setTimeout(() => {
                        this.isCardAnimationDisabled = false;
                    }, 1000);
                },
            });
    }

    public onAppontmentShipping() {
        this.isAppointmentShipping = !this.isAppointmentShipping;
        this.shipperForm
            .get(ShipperModalString.SHIPPING_APPOINTMENT)
            .patchValue(this.isAppointmentShipping);
    }

    public onAppontmentReceiving() {
        this.isAppointmentReceiving = !this.isAppointmentReceiving;
        this.shipperForm
            .get(ShipperModalString.RECEIVING_APPOINTMENT)
            .patchValue(this.isAppointmentReceiving);
    }

    public receivingShippingObject(): {
        receiving;
        shipping;
    } {
        let receiving = null;
        let shipping = null;

        if (
            (this.shipperForm.get(ShipperModalString.RECEIVING_APPOINTMENT)
                .value &&
                this.shipperForm.get(
                    ShipperModalString.RECEIVING_OPEN_TWENTY_FOUR_HOURS
                ).value) ||
            this.shipperForm.get(
                ShipperModalString.RECEIVING_OPEN_TWENTY_FOUR_HOURS
            ).value
        )
            receiving = {
                receivingFrom: null,
                receivingTo: null,
            };
        else
            receiving = {
                receivingFrom: this.shipperForm.get(
                    ShipperModalString.RECEIVING_FROM
                ).value,
                receivingTo: this.shipperForm.get(
                    ShipperModalString.RECEIVING_TO
                ).value,
            };

        if (
            this.shipperForm.get(
                ShipperModalString.SHIPPING_HOURS_SAME_RECEIVING
            ).value
        ) {
            shipping = {
                shippingAppointment: this.shipperForm.get(
                    ShipperModalString.RECEIVING_APPOINTMENT
                ).value,
                shippingOpenTwentyFourHours: this.shipperForm.get(
                    ShipperModalString.RECEIVING_OPEN_TWENTY_FOUR_HOURS
                ).value,
                shippingFrom: receiving.receivingFrom,
                shippingTo: receiving.receivingTo,
            };
        } else {
            if (
                (this.shipperForm.get(
                    ShipperModalString.SHIPPING_OPEN_TWENTY_FOUR_HOURS
                ).value &&
                    this.shipperForm.get(
                        ShipperModalString.SHIPPING_APPOINTMENT
                    ).value) ||
                this.shipperForm.get(
                    ShipperModalString.SHIPPING_OPEN_TWENTY_FOUR_HOURS
                ).value
            )
                shipping = {
                    shippingAppointment: this.shipperForm.get(
                        ShipperModalString.SHIPPING_APPOINTMENT
                    ).value,
                    shippingOpenTwentyFourHours: this.shipperForm.get(
                        ShipperModalString.SHIPPING_OPEN_TWENTY_FOUR_HOURS
                    ).value,
                    shippingFrom: null,
                    shippingTo: null,
                };
            else
                shipping = {
                    shippingAppointment: this.shipperForm.get(
                        ShipperModalString.SHIPPING_APPOINTMENT
                    ).value,
                    shippingOpenTwentyFourHours: this.shipperForm.get(
                        ShipperModalString.SHIPPING_OPEN_TWENTY_FOUR_HOURS
                    ).value,
                    shippingFrom:
                        this.shipperForm.get(ShipperModalString.SHIPPING_FROM)
                            .value ?? null,
                    shippingTo:
                        this.shipperForm.get(ShipperModalString.SHIPPING_TO)
                            .value ?? null,
                };
        }

        return { receiving, shipping };
    }

    public onFilesEvent(event: any): void {
        this.documents = event.files;
        switch (event.action) {
            case eGeneralActions.ADD:
                this.shipperForm
                    .get(eFileFormControls.FILES)
                    .patchValue(JSON.stringify(event.files));
                break;
            case eGeneralActions.DELETE_LOWERCASE:
                this.shipperForm
                    .get(eFileFormControls.FILES)
                    .patchValue(
                        event.files.length ? JSON.stringify(event.files) : null
                    );
                if (event.deleteId) this.filesForDelete.push(event.deleteId);
                this.fileModified = true;
                break;
            default:
                break;
        }
    }

    public tabPhysicalAddressChange(event: Tabs): void {
        this.selectedPhysicalAddressTab = event.id;

        this.setAddressValidations(event.name, true);
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
                .pipe(takeUntil(this.destroy$))
                .subscribe((res: AddressEntity) => {
                    const { addressUnit, ...addressData } = res;

                    this.shipperForm.patchValue({
                        ...addressData,
                        countryStateAddress:
                            addressData?.county +
                            eStringPlaceholder.COMMA_WHITESPACE +
                            addressData.stateShortName,
                    });

                    this.selectedAddress = addressData;
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
