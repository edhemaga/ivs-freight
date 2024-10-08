import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpResponseBase } from '@angular/common/http';

import { debounceTime, Subject, takeUntil, switchMap } from 'rxjs';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Animations
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// Helpers
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Services
import { FormService } from '@shared/services/form.service';
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';
import {
    LikeDislikeModel,
    TaLikeDislikeService,
} from '@shared/components/ta-like-dislike/services/ta-like-dislike.service';
import { BrokerService } from '@pages/customer/services/broker.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ConfirmationMoveService } from '@shared/components/ta-shared-modals/confirmation-move-modal/services/confirmation-move.service';

// Validators
import {
    name2_24Validation,
    creditLimitValidation,
    poBoxValidation,
    addressUnitValidation,
    addressValidation,
    businessNameValidation,
    departmentValidation,
    einNumberRegex,
    mcFFValidation,
    phoneExtension,
    phoneFaxRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// Components
import { TaSpinnerComponent } from '@shared/components/ta-spinner/ta-spinner.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaCurrencyProgressBarComponent } from '@shared/components/ta-currency-progress-bar/ta-currency-progress-bar.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';
import { TaUserReviewComponent } from '@shared/components/ta-user-review/ta-user-review.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationMoveModalComponent } from '@shared/components/ta-shared-modals/confirmation-move-modal/confirmation-move-modal.component';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { BrokerModalStringEnum } from '@pages/customer/pages/shipper-modal/enums/broker-modal-string.enum';
import { Tabs } from '@shared/models/tabs.model';

// constants
import { BrokerModalConstants } from '@pages/customer/pages/broker-modal/utils/constants/broker-modal.constants';

// models
import { ReviewComment } from '@shared/models/review-comment.model';
import {
    BrokerAvailableCreditResponse,
    BrokerResponse,
    AddressEntity,
    BrokerModalResponse,
    CreateRatingCommand,
    CreateReviewCommand,
    SignInResponse,
    UpdateReviewCommand,
    EnumValue,
    DepartmentResponse,
} from 'appcoretruckassist';
import { AnimationOptions } from '@shared/models/animation-options.model';

@Component({
    selector: 'app-broker-modal',
    templateUrl: './broker-modal.component.html',
    styleUrls: ['./broker-modal.component.scss'],
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
        TaCheckboxComponent,
        TaCurrencyProgressBarComponent,
        TaUploadFilesComponent,
        TaInputDropdownComponent,
        TaCustomCardComponent,
        TaUserReviewComponent,
        TaInputNoteComponent,
        TaSpinnerComponent,
    ],
})
export class BrokerModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    private destroy$ = new Subject<void>();

    public brokerForm: UntypedFormGroup;

    public companyUser: SignInResponse;

    public brokerName: string;

    public tabs: Tabs[] = [];
    public physicalAddressTabs: Tabs[] = [];
    public billingAddressTabs: Tabs[] = [];

    public selectedTab: number = 1;
    public selectedPhysicalAddressTab: number = 3;
    public selectedBillingAddressTab: number = 5;

    public animationObject: AnimationOptions;

    public billingCredit: Tabs[] = [];

    public reviews: any[] = [];
    public previousReviews: any[] = [];

    public selectedPhysicalAddress: AddressEntity;
    public selectedPhysicalPoBox: AddressEntity;
    public selectedBillingAddress: AddressEntity;
    public selectedBillingPoBox: AddressEntity;
    public selectedPayTerm: EnumValue;

    public selectedContactDepartmentFormArray: DepartmentResponse[] = [];

    public selectedDnuOrBfb: string;

    public labelsPayTerms: EnumValue[] = [];
    public labelsDepartments: DepartmentResponse[] = [];

    public brokerBanStatus: boolean = true;
    public brokerDnuStatus: boolean = true;

    public isFormDirty: boolean = false;
    public isResetDnuBtn: boolean = false;
    public isResetBfbBtn: boolean = false;

    public isAddNewAfterSave: boolean = false;
    public isUploadInProgress: boolean;
    public isContactCardsScrolling: boolean = false;
    public isOneMoreReviewDisabled: boolean = false;
    public isCardAnimationDisabled: boolean = false;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public longitude: number;
    public latitude: number;

    constructor(
        // modal

        private ngbActiveModal: NgbActiveModal,

        // form
        private formBuilder: UntypedFormBuilder,

        // services
        private inputService: TaInputService,
        private modalService: ModalService,
        private brokerService: BrokerService,
        private reviewRatingService: ReviewsRatingService,
        private taLikeDislikeService: TaLikeDislikeService,
        private formService: FormService,
        private confirmationService: ConfirmationService,
        private confirmationMoveService: ConfirmationMoveService
    ) {}

    ngOnInit() {
        this.createForm();

        this.getConstantData();

        this.isCredit(
            JSON.parse(
                JSON.stringify(BrokerModalConstants.BILLING_CREDIT_TABS[0])
            )
        );

        this.getBrokerDropdown();

        this.followIsBillingAddressSame();

        this.confirmationSubscribe();
        this.confirmationMoveSubscribe();

        this.handleEditSelectedTab();

        this.getCompanyUser();
    }

    private createForm() {
        this.brokerForm = this.formBuilder.group({
            businessName: [
                null,
                [Validators.required, ...businessNameValidation],
            ],
            dbaName: [null, name2_24Validation],
            mcNumber: [null, [...mcFFValidation]],
            ein: [null, [einNumberRegex]],
            email: [null],
            phone: [null, [Validators.required, phoneFaxRegex]],
            // Physical Address
            physicalAddress: [
                null,
                [Validators.required, ...addressValidation],
            ],
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
            creditType: ['Unlimited'], // Custom | Unlimited
            creditLimit: [null, creditLimitValidation],
            availableCredit: [null],
            payTerm: [null],
            note: [null],
            ban: [null],
            dnu: [null],
            brokerContacts: this.formBuilder.array([]),
            files: [null],
        });

        this.inputService.customInputValidator(
            this.brokerForm.get('email'),
            'email',
            this.destroy$
        );
    }

    private getConstantData(): void {
        this.tabs = JSON.parse(JSON.stringify(BrokerModalConstants.TABS));
        this.physicalAddressTabs = JSON.parse(
            JSON.stringify(BrokerModalConstants.ADDRESS_TABS)
        );
        this.billingAddressTabs = JSON.parse(
            JSON.stringify(BrokerModalConstants.BILLING_TABS)
        );

        this.animationObject = JSON.parse(
            JSON.stringify(BrokerModalConstants.ANIMATION_OBJECT)
        );

        this.billingCredit = JSON.parse(
            JSON.stringify(BrokerModalConstants.BILLING_CREDIT_TABS)
        );
    }

    private getCompanyUser(): void {
        this.companyUser = JSON.parse(localStorage.getItem('user'));
    }

    private confirmationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    const { template, action } = res;

                    if (template === BrokerModalStringEnum.DELETE_REVIEW) {
                        const review = {
                            action: res.type,
                            data: res.data.id,
                            sortData: [],
                        };

                        this.deleteReview(false, review);
                    }

                    if (action === BrokerModalStringEnum.CLOSE)
                        this.reviews = this.previousReviews;
                },
            });
    }

    private confirmationMoveSubscribe(): void {
        this.confirmationMoveService.getConfirmationMoveData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res) {
                    const { action } = res;

                    if (action === BrokerModalStringEnum.CLOSE) {
                        if (
                            this.selectedDnuOrBfb === BrokerModalStringEnum.DNU
                        ) {
                            this.isResetDnuBtn = true;
                        } else {
                            this.isResetBfbBtn = true;
                        }

                        setTimeout(() => {
                            this.isResetDnuBtn = false;
                            this.isResetBfbBtn = false;
                        }, 300);
                    } else {
                        const { subType } = res;

                        if (subType) {
                            this.ngbActiveModal.close();

                            if (subType === BrokerModalStringEnum.DNU) {
                                this.brokerService
                                    .changeDnuStatus(this.editData.id)
                                    .pipe(takeUntil(this.destroy$))
                                    .subscribe({
                                        next: (res: HttpResponseBase) => {
                                            if (
                                                res.status === 200 ||
                                                res.status === 204
                                            ) {
                                                this.brokerDnuStatus =
                                                    !this.brokerDnuStatus;

                                                this.modalService.changeModalStatus(
                                                    {
                                                        name: BrokerModalStringEnum.DNU,
                                                        status: this
                                                            .brokerDnuStatus,
                                                    }
                                                );
                                            }
                                        },
                                    });
                            } else {
                                this.brokerService
                                    .changeBanStatus(this.editData.id)
                                    .pipe(takeUntil(this.destroy$))
                                    .subscribe({
                                        next: (res: HttpResponseBase) => {
                                            if (
                                                res.status === 200 ||
                                                res.status === 204
                                            ) {
                                                this.brokerBanStatus =
                                                    !this.brokerBanStatus;

                                                this.modalService.changeModalStatus(
                                                    {
                                                        name: BrokerModalStringEnum.BFB,
                                                        status: this
                                                            .brokerBanStatus,
                                                    }
                                                );
                                            }
                                        },
                                    });
                            }
                        }
                    }
                }
            });
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

    private handleEditSelectedTab(): void {
        if (this.editData?.tab) this.selectedTab = this.editData.tab;
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        if (this.isUploadInProgress) return;

        if (
            data.action === BrokerModalStringEnum.BFB ||
            data.action === BrokerModalStringEnum.DNU
        ) {
            this.selectedDnuOrBfb = data.action;

            // DNU
            if (data.action === BrokerModalStringEnum.DNU && this.editData) {
                const mappedEvent = {
                    id: this.editData?.id,
                    data: this?.editData?.data,
                    type: !this.editData?.data?.dnu
                        ? TableStringEnum.MOVE
                        : TableStringEnum.REMOVE,
                };

                this.modalService.openModal(
                    ConfirmationMoveModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: TableStringEnum.BROKER,
                        subType: TableStringEnum.DNU,
                        modalTitle:
                            mappedEvent.data.businessName.name ??
                            mappedEvent?.data.businessName,
                        modalSecondTitle:
                            mappedEvent?.data.billingAddress?.address ??
                            TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                    }
                );
            }
            // BFB
            if (data.action === BrokerModalStringEnum.BFB && this.editData) {
                const mappedEvent = {
                    id: this.editData?.id,
                    data: this?.editData?.data,
                    type: !this.editData?.data.ban
                        ? TableStringEnum.MOVE
                        : TableStringEnum.REMOVE,
                };

                this.modalService.openModal(
                    ConfirmationMoveModalComponent,
                    { size: TableStringEnum.SMALL },
                    {
                        ...mappedEvent,
                        template: TableStringEnum.BROKER,
                        subType: TableStringEnum.BAN,
                        modalTitle:
                            mappedEvent.data.businessName.name ??
                            mappedEvent?.data.businessName,
                        modalSecondTitle:
                            mappedEvent?.data.billingAddress?.address ??
                            TableStringEnum.EMPTY_STRING_PLACEHOLDER,
                    }
                );
            }
        } else {
            if (data.action === 'close') {
                if (this.editData?.canOpenModal) {
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
                }
                return;
            }
            // Save And Add New
            else if (data.action === 'save and add new') {
                if (this.brokerForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.brokerForm);
                    return;
                }
                this.isUploadInProgress = true;
                this.addBroker(true);
                this.setModalSpinner('save and add new', true, false);
                this.isAddNewAfterSave = true;
            } else {
                // Save & Update
                if (data.action === 'save') {
                    if (this.brokerForm.invalid || !this.isFormDirty) {
                        this.inputService.markInvalid(this.brokerForm);
                        return;
                    }

                    this.isUploadInProgress = true;
                    if (this.editData?.type.includes('edit')) {
                        this.updateBroker(this.editData.id);
                        this.setModalSpinner(null, true, false);
                    } else {
                        this.addBroker();
                        this.setModalSpinner(null, true, false);
                    }
                }
                // Delete
                if (data.action === 'delete' && this.editData) {
                    this.modalService.setModalSpinner({
                        action: null,
                        status: false,
                        close: true,
                    });

                    this.modalService.openModal(
                        ConfirmationModalComponent,
                        { size: TableStringEnum.DELETE },
                        {
                            id: this.editData.id,
                            data: this.editData.data,
                            template: TableStringEnum.BROKER,
                            type: TableStringEnum.DELETE,
                            svg: true,
                            modalHeaderTitle:
                                ConfirmationModalStringEnum.DELETE_BROKER,
                        }
                    );
                }
            }
        }
    }

    public get brokerContacts(): UntypedFormArray {
        return this.brokerForm.get('brokerContacts') as UntypedFormArray;
    }

    private createBrokerContacts(data?: {
        contactName: string;
        departmentId: string;
        phone: string;
        extensionPhone: string;
        email: string;
    }): UntypedFormGroup {
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
        if (!this.brokerContacts.valid) return;

        if (event.check) {
            this.brokerContacts.push(form);
        }
        this.inputService.customInputValidator(
            form.get('email'),
            'email',
            this.destroy$
        );

        setTimeout(() => {
            this.trackBrokerContactEmail();
        }, 50);
    }

    public removeBrokerContacts(id: number) {
        this.brokerContacts.removeAt(id);
        this.selectedContactDepartmentFormArray.splice(id, 1);

        if (this.brokerContacts.length === 0) {
            this.brokerForm.markAsUntouched();
        }
    }

    public trackBrokerContactEmail() {
        const helper = new Array(this.brokerContacts.length).fill(false);

        this.brokerContacts.valueChanges
            .pipe(debounceTime(300), takeUntil(this.destroy$))
            .subscribe((items) => {
                items.forEach((item, index) => {
                    if (item.email && helper[index] === false) {
                        helper[index] = true;

                        this.inputService.changeValidators(
                            this.brokerContacts.at(index).get('phone'),
                            false,
                            [],
                            false
                        );
                    }

                    if (!item.email && helper[index] === true) {
                        this.brokerContacts
                            .at(index)
                            .get('email')
                            .patchValue(null);
                        this.inputService.changeValidators(
                            this.brokerContacts.at(index).get('phone'),
                            true,
                            [phoneFaxRegex]
                        );
                        helper[index] = false;
                    }
                });
            });
    }

    public onScrollingBrokerContacts(event: any) {
        this.isContactCardsScrolling = event.target.scrollLeft > 1;
    }

    public tabPhysicalAddressChange(event: any): void {
        this.selectedPhysicalAddressTab = event.id;

        if (this.selectedPhysicalAddressTab === 3) {
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
            this.inputService.changeValidators(
                this.brokerForm.get('physicalPoBox')
            );
            this.inputService.changeValidators(
                this.brokerForm.get('physicalPoBoxCity')
            );
        }

        this.physicalAddressTabs = this.physicalAddressTabs.map((item) => {
            return {
                ...item,
                checked: item.id === this.selectedPhysicalAddressTab,
            };
        });
    }

    public tabBillingAddressChange(event: any): void {
        this.selectedBillingAddressTab = event.id;

        if (this.selectedBillingAddressTab === 5) {
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
            this.brokerForm.get('billingAddressUnit').reset();
            this.inputService.changeValidators(
                this.brokerForm.get('billingPoBox')
            );
            this.inputService.changeValidators(
                this.brokerForm.get('billingPoBoxCity')
            );
        }

        this.billingAddressTabs = this.billingAddressTabs.map((item) => {
            return {
                ...item,
                checked: item.id === this.selectedBillingAddressTab,
            };
        });
    }

    //taLikeDislikeService
    public onHandleAddress(
        event: {
            address: AddressEntity;
            valid: boolean;
            longLat: any;
        },
        action: string
    ) {
        switch (action) {
            case 'physical-address': {
                if (event.valid) {
                    this.selectedPhysicalAddress = event.address;
                    this.longitude = event.longLat.longitude;
                    this.latitude = event.longLat.latitude;
                }
                break;
            }
            case 'physical-pobox': {
                if (event.valid) {
                    this.selectedPhysicalPoBox = event.address;
                    this.longitude = event.longLat.longitude;
                    this.latitude = event.longLat.latitude;
                }
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
            this.inputService.changeValidators(
                this.brokerForm.get('creditLimit')
            );
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

    public changeReviewsEvent(review: ReviewComment) {
        switch (review.action) {
            case 'delete':
                this.deleteReview(true, review);

                break;
            case 'add':
                this.addReview(review);

                break;
            case 'update':
                this.updateReview(review);

                break;
            case 'cancel':
                this.reviews = this.reviews.filter((review) => review.id);

                break;
            default:
                break;
        }
    }

    // ------ Review ------

    public createReview() {
        if (
            this.reviews.some((item) => item.isNewReview) ||
            this.isOneMoreReviewDisabled
        ) {
            return;
        }

        this.reviews.unshift({
            companyUser: {
                fullName: this.companyUser.firstName.concat(
                    ' ',
                    this.companyUser.lastName
                ),
                /*                 avatar: this.companyUser.avatar, */
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
                    .pipe(
                        takeUntil(this.destroy$),
                        switchMap(() => {
                            return this.brokerService.getBrokerById(
                                this.editData.id
                            );
                        })
                    )
                    .subscribe({
                        next: (res: BrokerResponse) => {
                            if (res.ratingReviews.length) {
                                this.reviews = res.ratingReviews.map(
                                    (item: any) => ({
                                        ...item,
                                        companyUser: {
                                            ...item.companyUser,
                                            avatar: item.companyUser.avatar,
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
                                    this.isOneMoreReviewDisabled = true;
                                }
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

    private addReview(review: ReviewComment) {
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

    private deleteReview(isOpenModal: boolean, review?: ReviewComment) {
        if (isOpenModal) {
            const { id, companyUser, updatedAt } = this.reviews.find(
                (reviewItem) => reviewItem.id === review.data
            );

            const data = {
                id,
                reviewer: companyUser.fullName,
                updatedAt,
                businessName: this.brokerForm.get(
                    BrokerModalStringEnum.BUSINESS_NAME
                ).value,
            };

            this.previousReviews = [...this.reviews];

            this.modalService.openModal(
                ConfirmationModalComponent,
                {
                    size: BrokerModalStringEnum.SMALL,
                },
                {
                    type: BrokerModalStringEnum.DELETE,
                    subType: BrokerModalStringEnum.BROKER,
                    data,
                    template: BrokerModalStringEnum.DELETE_REVIEW,
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

    private updateReview(review: ReviewComment) {
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

    public onSelectDropDown(event: any, action: string, index?: number) {
        switch (action) {
            case 'paytype':
                this.selectedPayTerm = event;

                break;
            case 'contact-department':
                this.selectedContactDepartmentFormArray[index] = event;

                break;
            default:
                break;
        }
    }

    private getBrokerDropdown() {
        this.brokerService
            .getBrokerDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: BrokerModalResponse) => {
                    this.labelsDepartments = res.departments;
                    this.labelsPayTerms = res.payTerms;

                    // From Another Modal Data
                    if (this.editData?.type === 'edit-contact') {
                        this.isCardAnimationDisabled = true;
                        this.editBrokerById(this.editData.id);
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
                    // normal get by id broker
                    else {
                        if (this.editData?.id) {
                            this.isCardAnimationDisabled = true;
                            this.editBrokerById(this.editData.id);
                            this.tabs.push({
                                id: 3,
                                name: 'Review',
                            });
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
                                    this.editData?.openedTab === 'Contact'
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

    private addBroker(isSaveAndAddNew?: boolean): void {
        const { creditLimit, brokerContacts, mcNumber, ...form } =
            this.brokerForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        let brAddresses = this.selectedBrokerAddress();

        let newData: any = {
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
            files: documents,
            longitude: this.longitude,
            latitude: this.latitude,
        };

        for (let index = 0; index < brokerContacts.length; index++) {
            brokerContacts[index].departmentId =
                this.selectedContactDepartmentFormArray[index].id;
        }

        newData = {
            ...newData,
            brokerContacts,
        };

        this.brokerService
            .addBroker(newData)
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
                    if (this.isAddNewAfterSave) {
                        this.formService.resetForm(this.brokerForm);

                        this.selectedBillingAddress = null;
                        this.selectedBillingPoBox = null;
                        this.selectedContactDepartmentFormArray = [];
                        this.selectedPayTerm = null;
                        this.selectedPhysicalAddress = null;
                        this.selectedPhysicalPoBox = null;

                        this.brokerContacts.controls = [];

                        this.brokerForm
                            .get('isCheckedBillingAddress')
                            .patchValue(true);

                        this.documents = [];
                        this.fileModified = false;
                        this.filesForDelete = [];

                        this.selectedTab = 1;
                        this.tabs = this.tabs.map((item, index) => {
                            return {
                                ...item,
                                checked: index === 0,
                            };
                        });

                        this.selectedBillingAddressTab = 5;
                        this.billingAddressTabs = this.billingAddressTabs.map(
                            (item, index) => {
                                return {
                                    ...item,
                                    checked: index === 0,
                                };
                            }
                        );

                        this.selectedPhysicalAddressTab = 3;
                        this.physicalAddressTabs = this.physicalAddressTabs.map(
                            (item, index) => {
                                return {
                                    ...item,
                                    checked: index === 0,
                                };
                            }
                        );

                        this.brokerForm
                            .get('creditType')
                            .patchValue('Unlimited');
                        this.billingCredit = this.billingCredit.map(
                            (item, index) => {
                                return {
                                    ...item,
                                    checked: index === 0,
                                };
                            }
                        );

                        this.isAddNewAfterSave = false;
                        this.setModalSpinner('save and add new', false, false);
                        this.isUploadInProgress = false;
                    } else this.setModalSpinner(null, true, true);
                },
                error: () => this.setModalSpinner(null, false, false),
            });
    }

    private updateBroker(id: number): void {
        const { brokerContacts, mcNumber, creditLimit, ...form } =
            this.brokerForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        let brAddresses = this.selectedBrokerAddress();

        let newData: any = {
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
            files: documents ?? this.brokerForm.value.files,
            filesForDeleteIds: this.filesForDelete,
            longitude: this.longitude,
            latitude: this.latitude,
        };

        for (let index = 0; index < brokerContacts.length; index++) {
            brokerContacts[index].departmentId =
                this.selectedContactDepartmentFormArray[index].id;
        }

        newData = {
            ...newData,
            brokerContacts,
        };

        this.brokerService
            .updateBroker(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal) {
                        switch (this.editData?.key) {
                            case 'load-modal': {
                                this.setModalSpinner(null, false, true);

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
                    } else this.setModalSpinner(null, true, true);
                },
                error: () => this.setModalSpinner(null, false, false),
            });
    }

    private editBrokerById(id: number): void {
        this.brokerService
            .getBrokerById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
                    this.brokerForm.patchValue({
                        businessName: res.businessName,
                        dbaName: res.dbaName,
                        mcNumber: res.mcNumber,
                        ein: res.ein,
                        email: res.email,
                        phone: res.phone,
                        // Physical Address
                        physicalAddress: res.mainAddress
                            ? res.mainAddress.address
                            : null,
                        physicalAddressUnit: res.mainAddress
                            ? res.mainAddress.addressUnit
                            : null,
                        physicalPoBox: res.mainPoBox
                            ? res.mainPoBox.poBox
                            : null,
                        physicalPoBoxCity: res.mainPoBox
                            ? res.mainPoBox.city
                            : null,
                        // Billing Address
                        isCheckedBillingAddress:
                            res.mainAddress.address ===
                            res.billingAddress.address,
                        billingAddress: res.billingAddress
                            ? res.billingAddress.address
                            : null,
                        billingAddressUnit: res.billingAddress
                            ? res.billingAddress.addressUnit
                            : null,
                        billingPoBox: res.billingPoBox
                            ? res.billingPoBox.poBox
                            : null,
                        billingPoBoxCity: res.billingPoBox
                            ? res.billingPoBox.city
                            : null,
                        creditType: res.creditType,
                        creditLimit:
                            res.creditType.name === 'Custom'
                                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                      res.creditLimit
                                  )
                                : null,
                        availableCredit: res.availableCredit,
                        payTerm: res.payTerm ? res.payTerm.name : null,
                        note: res.note,
                        ban: res.ban,
                        dnu: res.dnu,
                        brokerContacts: [],
                    });

                    this.brokerName = res.businessName;

                    this.modalService.changeModalStatus({
                        name: BrokerModalStringEnum.DNU,
                        status: res.dnu,
                    });
                    this.brokerDnuStatus = res.dnu;

                    this.modalService.changeModalStatus({
                        name: BrokerModalStringEnum.BFB,
                        status: res.ban,
                    });

                    this.brokerBanStatus = res.ban;
                    this.documents = res.files;

                    this.selectedPhysicalAddress = res.mainAddress
                        ? res.mainAddress
                        : null;
                    this.selectedPhysicalPoBox = res.mainPoBox
                        ? res.mainPoBox
                        : null;
                    this.selectedBillingAddress = res.billingAddress
                        ? res.billingAddress
                        : null;
                    this.selectedBillingPoBox = res.billingPoBox
                        ? res.billingPoBox
                        : null;

                    this.selectedPayTerm = res.payTerm;

                    // Contacts
                    if (res.brokerContacts) {
                        for (const contact of res.brokerContacts) {
                            this.brokerContacts.push(
                                this.createBrokerContacts({
                                    contactName: contact.contactName,
                                    departmentId: contact.department.name,
                                    phone: contact.phone,
                                    extensionPhone: contact.extensionPhone,
                                    email: contact.email,
                                })
                            );

                            this.selectedContactDepartmentFormArray.push(
                                contact.department
                            );
                        }
                    }

                    // Review
                    this.reviews = res.ratingReviews.map((item) => ({
                        ...item,
                        id: item.reviewId,
                        companyUser: {
                            ...item.companyUser,
                            avatar: item.companyUser.avatar,
                        },
                        commentContent: item.comment,
                        rating: item.thumb,
                    }));

                    const reviewIndex = this.reviews.findIndex(
                        (item) =>
                            item.companyUser.id ===
                            this.companyUser.companyUserId
                    );

                    if (reviewIndex !== -1) {
                        this.isOneMoreReviewDisabled = true;
                    }

                    this.taLikeDislikeService.populateLikeDislikeEvent({
                        downRatingCount: res.downCount,
                        upRatingCount: res.upCount,
                        currentCompanyUserRating: res.currentCompanyUserRating,
                    });

                    this.isCredit(
                        this.billingCredit.find(
                            (item) => item.name === res.creditType.name
                        )
                    );

                    this.tabPhysicalAddressChange(
                        this.selectedPhysicalAddress.address
                            ? {
                                  id: 3,
                                  name: 'Physical Address',
                                  inputName: 'a',
                                  checked: true,
                              }
                            : {
                                  id: 4,
                                  name: 'PO Box Physical',
                                  inputName: 'a',
                                  checked: false,
                              }
                    );

                    this.tabBillingAddressChange(
                        this.selectedBillingAddressTab === 5 ||
                            res.mainAddress.address ===
                                res.billingAddress.address
                            ? {
                                  id: 5,
                                  name: 'Billing Address',
                                  inputName: 'n',
                                  checked: true,
                              }
                            : {
                                  id: 6,
                                  name: 'PO Box Billing',
                                  inputName: 'n',
                                  checked: false,
                              }
                    );

                    this.startFormChanges();
                    setTimeout(() => {
                        this.isCardAnimationDisabled = false;
                    }, 1000);
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
                    if (this.selectedBillingAddressTab === 5) {
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
            if (this.selectedPhysicalAddressTab === 3) {
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
                    addressUnit: this.brokerForm.get('physicalAddressUnit')
                        .value,
                };
                mainPoBox = null;
                billingAddress = {
                    address: this.brokerForm.get('isCheckedBillingAddress')
                        .value
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
                    country: this.brokerForm.get('isCheckedBillingAddress')
                        .value
                        ? this.selectedPhysicalAddress
                            ? this.selectedPhysicalAddress.country
                            : null
                        : this.selectedBillingAddress
                        ? this.selectedBillingAddress.country
                        : null,
                    zipCode: this.brokerForm.get('isCheckedBillingAddress')
                        .value
                        ? this.selectedPhysicalAddress
                            ? this.selectedPhysicalAddress.zipCode
                            : null
                        : this.selectedBillingAddress
                        ? this.selectedBillingAddress.zipCode
                        : null,
                    stateShortName: this.brokerForm.get(
                        'isCheckedBillingAddress'
                    ).value
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
                    streetNumber: this.brokerForm.get('isCheckedBillingAddress')
                        .value
                        ? this.selectedPhysicalAddress
                            ? this.selectedPhysicalAddress.streetNumber
                            : null
                        : this.selectedBillingAddress
                        ? this.selectedBillingAddress.streetNumber
                        : null,
                    addressUnit: this.brokerForm.get('isCheckedBillingAddress')
                        .value
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
                    zipCode: this.brokerForm.get('isCheckedBillingAddress')
                        .value
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
            if (this.selectedPhysicalAddressTab === 3) {
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
                    addressUnit: this.brokerForm.get('physicalAddressUnit')
                        .value,
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

            if (this.selectedBillingAddressTab === 5) {
                billingAddress = {
                    address: this.brokerForm.get('isCheckedBillingAddress')
                        .value
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
                    country: this.brokerForm.get('isCheckedBillingAddress')
                        .value
                        ? this.selectedPhysicalAddress
                            ? this.selectedPhysicalAddress.country
                            : null
                        : this.selectedBillingAddress
                        ? this.selectedBillingAddress.country
                        : null,
                    zipCode: this.brokerForm.get('isCheckedBillingAddress')
                        .value
                        ? this.selectedPhysicalAddress
                            ? this.selectedPhysicalAddress.zipCode
                            : null
                        : this.selectedBillingAddress
                        ? this.selectedBillingAddress.zipCode
                        : null,
                    stateShortName: this.brokerForm.get(
                        'isCheckedBillingAddress'
                    ).value
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
                    streetNumber: this.brokerForm.get('isCheckedBillingAddress')
                        .value
                        ? this.selectedPhysicalAddress
                            ? this.selectedPhysicalAddress.streetNumber
                            : null
                        : this.selectedBillingAddress
                        ? this.selectedBillingAddress.streetNumber
                        : null,
                    addressUnit: this.brokerForm.get('isCheckedBillingAddress')
                        .value
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
                    zipCode: this.brokerForm.get('isCheckedBillingAddress')
                        .value
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

    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case 'add': {
                this.brokerForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.brokerForm
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

    public onBlurCreditLimit() {
        let limit = this.brokerForm.get('creditLimit').value;

        if (limit) {
            limit = MethodsCalculationsHelper.convertThousanSepInNumber(limit);
            this.brokerService
                .availableCreditBroker({
                    id: this.editData?.id ? this.editData.id : null,
                    creditLimit: limit,
                })
                .pipe(takeUntil(this.destroy$))
                .subscribe({
                    next: (res: BrokerAvailableCreditResponse) => {
                        this.brokerForm
                            .get('creditLimit')
                            .patchValue(
                                MethodsCalculationsHelper.convertNumberInThousandSep(
                                    res.creditLimit
                                )
                            );

                        this.brokerForm
                            .get('availableCredit')
                            .patchValue(res.availableCredit);
                    },
                });
        }
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.brokerForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    private setModalSpinner(action: string, status: boolean, close: boolean) {
        this.modalService.setModalSpinner({
            action: action,
            status: status,
            close: close,
        });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
