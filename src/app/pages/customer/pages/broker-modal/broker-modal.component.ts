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
import { HttpResponseBase } from '@angular/common/http';

import { Subject, takeUntil, switchMap } from 'rxjs';

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
import { BrokerService } from '@pages/customer/services';
import { TaInputService } from '@shared/services/ta-input.service';
import { ModalService } from '@shared/services/modal.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ConfirmationMoveService } from '@shared/components/ta-shared-modals/confirmation-move-modal/services/confirmation-move.service';
import { AddressService } from '@shared/services/address.service';

// Validators
import {
    name2_24Validation,
    creditLimitValidation,
    poBoxValidation,
    addressUnitValidation,
    addressValidation,
    businessNameValidation,
    einNumberRegex,
    mcFFValidation,
    phoneFaxRegex,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// Components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaCurrencyProgressBarComponent } from '@shared/components/ta-currency-progress-bar/ta-currency-progress-bar.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { LoadModalComponent } from '@pages/load/pages/load-modal/load-modal.component';
import { TaUserReviewComponent } from '@shared/components/ta-user-review/ta-user-review.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';
import { ConfirmationMoveModalComponent } from '@shared/components/ta-shared-modals/confirmation-move-modal/confirmation-move-modal.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import {
    CaInputComponent,
    CaInputDropdownComponent,
    CaModalButtonComponent,
    CaModalComponent,
    CaInputAddressDropdownComponent,
} from 'ca-components';

// enums
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationModalStringEnum } from '@shared/components/ta-shared-modals/confirmation-modal/enums/confirmation-modal-string.enum';
import { BrokerModalStringEnum } from '@pages/customer/pages/broker-modal/enums/';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';
import {
    EFileFormControls,
    eGeneralActions,
    ModalButtonSize,
    ModalButtonType,
} from '@shared/enums';
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';

// constants
import { BrokerModalConstants } from '@pages/customer/pages/broker-modal/utils/constants/';

// svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Pipes
import { FormatDatePipe } from '@shared/pipes';

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
    AddressListResponse,
    AddressResponse,
} from 'appcoretruckassist';
import { AnimationOptions } from '@shared/models/animation-options.model';
import { Tabs } from '@shared/models/tabs.model';
import { BrokerContactExtended } from '@pages/customer/pages/broker-modal/models';
import { AddressProperties } from '@shared/components/ta-input-address-dropdown/models/address-properties';

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
        CaModalComponent,
        TaTabSwitchComponent,
        TaInputAddressDropdownComponent,
        TaCheckboxComponent,
        TaCurrencyProgressBarComponent,
        TaUploadFilesComponent,
        TaCustomCardComponent,
        TaUserReviewComponent,
        TaInputNoteComponent,
        TaModalTableComponent,
        CaInputComponent,
        CaInputDropdownComponent,
        CaModalButtonComponent,
        CaInputAddressDropdownComponent,

        // Pipes
        FormatDatePipe,
    ],
})
export class BrokerModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    private destroy$ = new Subject<void>();

    public brokerForm: UntypedFormGroup;

    public companyUser: SignInResponse;

    public brokerName: string;

    public modalTableTypeEnum = ModalTableTypeEnum;

    public tabs: Tabs[] = [];
    public physicalAddressTabs: Tabs[] = [];
    public billingAddressTabs: Tabs[] = [];

    public billingCredit: Tabs[] = [];

    public selectedTab: number = 1;
    public selectedPhysicalAddressTab: number = 3;
    public selectedBillingAddressTab: number = 6;

    public animationObject: AnimationOptions;

    public selectedPhysicalAddress: AddressEntity;
    public selectedPhysicalPoBox: AddressEntity;
    public selectedBillingAddress: AddressEntity;
    public selectedBillingPoBox: AddressEntity;
    public selectedPayTerm: EnumValue;

    public selectedDnuOrBfb: string;

    public payTermOptions: EnumValue[] = [];
    public departmentOptions: DepartmentResponse[] = [];

    public brokerBanStatus: boolean = true;
    public brokerDnuStatus: boolean = true;

    public isFormDirty: boolean = false;
    public isResetDnuBtn: boolean = false;
    public isResetBfbBtn: boolean = false;

    public isAddNewAfterSave: boolean = false;
    public isUploadInProgress: boolean;
    public isOneMoreReviewDisabled: boolean = false;
    public isCardAnimationDisabled: boolean = false;

    public longitude: number;
    public latitude: number;

    // documents
    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    // reviews
    public reviews: any[] = [];
    public previousReviews: any[] = [];

    // contacts
    public brokerContacts: BrokerContactExtended[] = [];
    public updatedBrokerContacts: BrokerContactExtended[] = [];

    public isNewContactAdded: boolean = false;
    public isEachContactRowValid: boolean = true;

    public taModalActionEnum = TaModalActionEnum;

    public svgRoutes = SharedSvgRoutes;
    public activeAction: string;

    public modalButtonType = ModalButtonType;
    public modalButtonSize = ModalButtonSize;

    public addressList: AddressListResponse;
    public addressListBilling: AddressListResponse;
    public addressListPoBox: AddressListResponse;
    public addressListBillingPoBox: AddressListResponse;
    public addressData: AddressResponse;
    public addressDataBilling: AddressResponse;
    public addressDataPoBox: AddressResponse;
    public addressDataBillingPoBox: AddressResponse;

    constructor(
        // modal
        private ngbActiveModal: NgbActiveModal,

        // form
        private formBuilder: UntypedFormBuilder,

        // change detection
        private cdRef: ChangeDetectorRef,

        // services
        private inputService: TaInputService,
        private modalService: ModalService,
        private brokerService: BrokerService,
        private reviewRatingService: ReviewsRatingService,
        private taLikeDislikeService: TaLikeDislikeService,
        private formService: FormService,
        private confirmationService: ConfirmationService,
        private confirmationMoveService: ConfirmationMoveService,
        private addressService: AddressService
    ) {}

    ngOnInit() {
        this.createForm();

        this.getConstantData();

        this.getBrokerDropdown();

        this.getCompanyUser();

        this.followIsBillingAddressSame();

        this.confirmationSubscribe();
        this.confirmationMoveSubscribe();
    }

    get isModalValidToSubmit(): boolean {
        return (
            this.brokerForm.valid &&
            this.isFormDirty &&
            this.isEachContactRowValid
        );
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
            contacts: [null],
            files: [null],
        });

        this.inputService.customInputValidator(
            this.brokerForm.get('email'),
            'email',
            this.destroy$
        );
    }

    private startFormChanges(): void {
        this.formService.checkFormChange(this.brokerForm);

        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
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

                    if (action === BrokerModalStringEnum.DELETE)
                        this.ngbActiveModal.close();
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

    public tabChange(event: Tabs): void {
        this.selectedTab = event.id;

        let dotAnimation = document.querySelector(
            this.editData ? '.animation-three-tabs' : '.animation-two-tabs'
        );

        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };
    }

    public tabPhysicalAddressChange(event: Tabs): void {
        this.selectedPhysicalAddressTab = event.id;

        if (this.selectedPhysicalAddressTab === 3) {
            this.inputService.changeValidators(
                this.brokerForm.get(BrokerModalStringEnum.PHYSICAL_ADDRESS)
            );

            this.brokerForm
                .get(BrokerModalStringEnum.PHYSICAL_ADDRESS)
                .patchValue(this.selectedPhysicalAddress?.address);

            this.inputService.changeValidators(
                this.brokerForm.get(BrokerModalStringEnum.PHYSICAL_PO_BOX),
                false,
                [],
                false
            );

            this.inputService.changeValidators(
                this.brokerForm.get(BrokerModalStringEnum.PHYSICAL_PO_BOX_CITY),
                false,
                [],
                false
            );
        } else {
            this.inputService.changeValidators(
                this.brokerForm.get(BrokerModalStringEnum.PHYSICAL_ADDRESS),
                false,
                [],
                true
            );

            this.inputService.changeValidators(
                this.brokerForm.get(BrokerModalStringEnum.PHYSICAL_PO_BOX)
            );

            this.inputService.changeValidators(
                this.brokerForm.get(BrokerModalStringEnum.PHYSICAL_PO_BOX_CITY)
            );
        }

        this.physicalAddressTabs = this.physicalAddressTabs.map((item) => {
            return {
                ...item,
                checked: item.id === this.selectedPhysicalAddressTab,
            };
        });
    }

    public tabBillingAddressChange(event: Tabs): void {
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

    public tabCreditChange(event: Tabs): void {
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

    public onModalAction(action: string): void {
        if (this.isUploadInProgress) return;

        this.activeAction = action;

        if (
            action === TaModalActionEnum.MOVE_TO_BFB ||
            action === TaModalActionEnum.MOVE_TO_DNU
        ) {
            this.selectedDnuOrBfb = action;

            // DNU
            if (action === TaModalActionEnum.MOVE_TO_DNU && this.editData) {
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
            if (action === TaModalActionEnum.MOVE_TO_BFB && this.editData) {
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
            if (action === TaModalActionEnum.CLOSE) {
                if (this.editData?.canOpenModal) {
                    if (this.editData?.key === 'load-modal')
                        this.modalService.setProjectionModal({
                            action: eGeneralActions.CLOSE,
                            payload: {
                                key: this.editData?.key,
                                value: null,
                            },
                            component: LoadModalComponent,
                            size: 'small',
                            closing: 'fastest',
                        });
                } else {
                    this.ngbActiveModal.close();
                }

                return;
            }
            // Save And Add New
            else if (action === TaModalActionEnum.SAVE_AND_ADD_NEW) {
                if (this.brokerForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.brokerForm);

                    return;
                }
                this.isUploadInProgress = true;

                this.addBroker(true);

                this.isAddNewAfterSave = true;
            } else {
                // Save & Update
                if (action === TaModalActionEnum.SAVE) {
                    if (this.brokerForm.invalid || !this.isFormDirty) {
                        this.inputService.markInvalid(this.brokerForm);

                        return;
                    }

                    this.isUploadInProgress = true;

                    if (this.editData?.type.includes(eGeneralActions.EDIT)) {
                        this.updateBroker(this.editData.id);
                    } else {
                        this.addBroker();
                    }
                }
                // Delete
                if (action === TaModalActionEnum.DELETE && this.editData) {
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

    public onHandleAddress(
        event: {
            address: AddressEntity;
            valid: boolean;
            longLat: any;
        },
        action: string
    ): void {
        switch (action) {
            case 'physical-address':
                if (event.valid) {
                    this.selectedPhysicalAddress = event.address;
                    this.longitude = event.longLat.longitude;
                    this.latitude = event.longLat.latitude;
                }

                break;

            case 'physical-pobox':
                if (event.valid) {
                    this.selectedPhysicalPoBox = event.address;
                    this.longitude = event.longLat.longitude;
                    this.latitude = event.longLat.latitude;
                }

                break;

            case 'billing-address':
                if (event.valid) this.selectedBillingAddress = event.address;

                break;

            case 'billing-pobox':
                if (event.valid) this.selectedBillingPoBox = event.address;

                break;

            default:
                break;
        }
    }

    public onSelectDropDown(event: EnumValue): void {
        this.selectedPayTerm = event;
    }

    public onFilesEvent(event: any): void {
        this.documents = event.files;

        switch (event.action) {
            case eGeneralActions.ADD:
                this.brokerForm
                    .get(EFileFormControls.FILES)
                    .patchValue(JSON.stringify(event.files));

                break;
            case eGeneralActions.DELETE:
                this.brokerForm
                    .get(EFileFormControls.FILES)
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

    public onBlurCreditLimit(): void {
        let limit = this.brokerForm.get('creditLimit').value;

        if (limit) {
            limit = MethodsCalculationsHelper.convertThousandSepInNumber(limit);

            const data = {
                id: this.editData?.id ?? null,
                creditLimit: limit,
            };

            this.brokerService
                .availableCreditBroker(data)
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

    private followIsBillingAddressSame(): void {
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
        mainAddress: AddressEntity;
        billingAddress: AddressEntity;
        mainPoBox: AddressEntity;
        billingPoBox: AddressEntity;
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
                        ? this.brokerForm.get(
                              BrokerModalStringEnum.PHYSICAL_PO_BOX
                          ).value
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
                            ? this.brokerForm.get(
                                  BrokerModalStringEnum.PHYSICAL_PO_BOX
                              ).value
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
                        ? this.brokerForm.get(
                              BrokerModalStringEnum.PHYSICAL_PO_BOX
                          ).value
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
                            ? this.brokerForm.get(
                                  BrokerModalStringEnum.PHYSICAL_PO_BOX
                              ).value
                            : null
                        : this.brokerForm.get('billingPoBox').value,
                };

                billingAddress = null;
            }
        }
        return { mainAddress, billingAddress, mainPoBox, billingPoBox };
    }

    public addContact(): void {
        if (!this.isEachContactRowValid) return;

        this.isNewContactAdded = true;

        setTimeout(() => {
            this.isNewContactAdded = false;
        }, 400);
    }

    public handleModalTableValueEmit(
        modalTableDataValue: BrokerContactExtended[]
    ): void {
        this.brokerContacts = modalTableDataValue;

        this.brokerForm
            .get(BrokerModalStringEnum.CONTACTS)
            .patchValue(this.brokerContacts);

        this.cdRef.detectChanges();
    }

    public handleModalTableValidStatusEmit(
        isEachContactRowValid: boolean
    ): void {
        this.isEachContactRowValid = isEachContactRowValid;
    }

    private mapContacts(
        contacts: BrokerContactExtended[],
        isFormPatch: boolean = false
    ): BrokerContactExtended[] {
        return contacts.map((contact, index) => {
            const {
                contactName,
                department,
                phone,
                extensionPhone,
                email,
                fullName,
                phoneExt,
            } = contact;

            return isFormPatch
                ? {
                      fullName: contactName,
                      department: (department as DepartmentResponse).name,
                      phone,
                      phoneExt:
                          extensionPhone ?? BrokerModalStringEnum.EMPTY_STRING,
                      email,
                  }
                : {
                      id: this.updatedBrokerContacts[index]?.id,
                      contactName: fullName,
                      departmentId: this.departmentOptions.find(
                          (item) => item.name === department
                      )?.id,
                      phone,
                      extensionPhone: phoneExt,
                      email,
                  };
        });
    }

    private mapDocuments<T>(): T[] {
        return this.documents
            .filter((item) => item.realFile)
            .map((item) => item.realFile);
    }

    public changeReviewsEvent(review: ReviewComment): void {
        switch (review.action) {
            case eGeneralActions.DELETE:
                this.deleteReview(true, review);
                break;
            case eGeneralActions.ADD:
                this.addReview(review);
                break;
            case eGeneralActions.UPDATE:
                this.updateReview(review);
                break;
            case eGeneralActions.CANCEL:
                this.reviews = this.reviews.filter((review) => review.id);
                break;
            default:
                break;
        }
    }

    private ratingChanges(): void {
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

    public createReview(): void {
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

    private getBrokerDropdown(): void {
        this.brokerService
            .getBrokerDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: BrokerModalResponse) => {
                    const { departments, payTerms, selectedPayTerm } = res;

                    this.departmentOptions = departments;
                    this.payTermOptions = payTerms;

                    this.selectedPayTerm = this.payTermOptions?.find(
                        (payTerm) => payTerm.id === selectedPayTerm
                    );

                    this.brokerForm
                        .get(BrokerModalStringEnum.PAY_TERM)
                        .patchValue(this.selectedPayTerm?.name ?? null);

                    // From Another Modal Data
                    if (
                        this.editData?.type ===
                        BrokerModalStringEnum.EDIT_CONTACT
                    ) {
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

    private addBroker(isSaveAndAddNew?: boolean): void {
        const { creditLimit, mcNumber, ...form } = this.brokerForm.value;

        const addresses = this.selectedBrokerAddress();

        const files = this.mapDocuments();

        const brokerContacts = this.mapContacts(this.brokerContacts);

        const newData = {
            ...form,
            mainAddress: addresses.mainAddress,
            mainPoBox: addresses.mainPoBox,
            billingAddress: addresses.billingAddress,
            billingPoBox: addresses.billingPoBox,
            mcNumber,
            creditLimit: creditLimit
                ? parseFloat(creditLimit.toString().replace(/,/g, ''))
                : null,
            payTerm: this.selectedPayTerm?.id ?? null,
            longitude: this.longitude,
            latitude: this.latitude,
            brokerContacts,
            files,
        };

        this.brokerService
            .addBroker(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal && !isSaveAndAddNew) {
                        if (this.editData?.key === 'load-modal')
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
                    }

                    this.ngbActiveModal.close();
                    if (this.isAddNewAfterSave) {
                        this.modalService.openModal(BrokerModalComponent, {});
                    }
                },
                error: () => (this.activeAction = null),
            });
    }

    private updateBroker(id: number): void {
        const { mcNumber, creditLimit, ...form } = this.brokerForm.value;

        const addresses = this.selectedBrokerAddress();

        const files = this.mapDocuments();

        const brokerContacts = this.mapContacts(this.brokerContacts);

        const newData = {
            id,
            ...form,
            mainAddress: addresses.mainAddress,
            mainPoBox: addresses.mainPoBox,
            billingAddress: addresses.billingAddress,
            billingPoBox: addresses.billingPoBox,
            mcNumber,
            creditLimit: creditLimit
                ? parseFloat(creditLimit.toString().replace(/,/g, ''))
                : null,
            payTerm: this.selectedPayTerm?.id ?? null,
            longitude: this.longitude,
            latitude: this.latitude,
            brokerContacts,
            files,
            filesForDeleteIds: this.filesForDelete,
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
                            }

                            default: {
                                break;
                            }
                        }
                    } else this.ngbActiveModal.close();
                },
                error: () => (this.activeAction = null),
            });
    }

    private editBrokerById(id: number): void {
        this.brokerService
            .getBrokerById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res) => {
                    this.brokerForm.patchValue({
                        businessName: res.businessName,
                        dbaName: res.dbaName,
                        mcNumber: res.mcNumber,
                        ein: res.ein,
                        email: res.email,
                        phone: res.phone,
                        // Physical Address
                        physicalAddress: res.mainAddress?.address ?? null,
                        physicalAddressUnit:
                            res.mainAddress?.addressUnit ?? null,
                        physicalPoBox: res.mainPoBox?.poBox ?? null,
                        physicalPoBoxCity: [
                            res.mainPoBox.city,
                            res.mainPoBox.state,
                        ].join(', '),
                        // Billing Address
                        isCheckedBillingAddress:
                            res.mainAddress.address ===
                            res.billingAddress.address,
                        billingAddress: res.billingAddress?.address ?? null,
                        billingAddressUnit:
                            res.billingAddress?.addressUnit ?? null,
                        billingPoBox: res.billingPoBox?.poBox ?? null,
                        billingPoBoxCity: res.billingPoBox?.city ?? null,
                        creditType: res.creditType,
                        creditLimit:
                            res.creditType.name === BrokerModalStringEnum.CUSTOM
                                ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                      res.creditLimit
                                  )
                                : null,
                        availableCredit: res.availableCredit,
                        payTerm: res.payTerm?.name ?? null,
                        note: res.note,
                        ban: res.ban,
                        dnu: res.dnu,
                        contacts: this.mapContacts(res.brokerContacts, true),
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

                    this.selectedPhysicalAddress = res.mainAddress ?? null;
                    this.selectedPhysicalPoBox = res.mainPoBox ?? null;
                    this.selectedBillingAddress = res.billingAddress ?? null;
                    this.selectedBillingPoBox = res.billingPoBox ?? null;

                    this.selectedPayTerm = res.payTerm;

                    // Contacts
                    this.updatedBrokerContacts = res.brokerContacts;

                    // Review
                    this.reviews = res.ratingReviews.map((item) => ({
                        ...item,
                        id: item.reviewId,
                        companyUser: {
                            ...item.companyUser,
                            /*   avatar: item.companyUser.avatar, */
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

                    this.tabCreditChange(
                        this.billingCredit.find(
                            (item) => item.name === res.creditType.name
                        )
                    );

                    this.tabPhysicalAddressChange(
                        this.selectedPhysicalAddress.address
                            ? {
                                  id: 3,
                                  name: 'Physical Address',
                                  checked: true,
                              }
                            : {
                                  id: 4,
                                  name: 'PO Box Physical',
                                  checked: false,
                              }
                    );

                    this.tabBillingAddressChange(
                        this.selectedBillingAddressTab === 5 ||
                            (this.selectedPhysicalAddress.address &&
                                res.mainAddress.address ===
                                    res.billingAddress.address)
                            ? {
                                  id: 5,
                                  name: 'Billing Address',
                                  checked: true,
                              }
                            : {
                                  id: 6,
                                  name: 'PO Box Billing',
                                  checked: false,
                              }
                    );

                    setTimeout(() => {
                        if (res.mainPoBox?.city) {
                            this.brokerForm
                                .get(BrokerModalStringEnum.PHYSICAL_PO_BOX_CITY)
                                .patchValue(
                                    [
                                        res.mainPoBox.city,
                                        res.mainPoBox.state,
                                    ].join(', ')
                                );
                        }

                        this.startFormChanges();
                    }, 200);

                    this.cdRef.detectChanges();

                    setTimeout(() => {
                        this.isCardAnimationDisabled = false;
                    }, 1000);
                },
            });
    }

    private setModalSpinner(
        action: string,
        status: boolean,
        close: boolean
    ): void {
        this.modalService.setModalSpinner({
            action: action,
            status: status,
            close: close,
        });
    }

    public onAddressChange(
        { query, searchLayers, closedBorder }: AddressProperties,
        addressListType: string
    ): void {
        this.addressService
            .getAddresses(query, searchLayers, closedBorder)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => this.updateAddressList(res, addressListType));
    }

    public getAddressData(address: string, addressDataType: string): void {
        this.addressService
            .getAddressInfo(address)
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => this.updateAddressData(res, addressDataType));
    }

    private updateAddressList(data: AddressListResponse, action: string) {
        switch (action) {
            case BrokerModalStringEnum.PHYSICAL_ADDRESS_2:
                this.addressList = data;
                break;

            case BrokerModalStringEnum.PHYSICAL_PO_BOX_2:
                this.addressListPoBox = data;
                break;

            case BrokerModalStringEnum.BILLING_ADDRESS:
                this.addressListBilling = data;
                break;

            case BrokerModalStringEnum.BILLING_PO_BOX:
                this.addressListBillingPoBox = data;
                break;

            default:
                break;
        }
    }

    private updateAddressData(data: AddressResponse, action: string) {
        switch (action) {
            case BrokerModalStringEnum.PHYSICAL_ADDRESS_2:
                this.addressData = data;
                break;

            case BrokerModalStringEnum.PHYSICAL_PO_BOX_2:
                this.addressDataPoBox = data;
                break;

            case BrokerModalStringEnum.BILLING_ADDRESS:
                this.addressDataBilling = data;
                break;

            case BrokerModalStringEnum.BILLING_PO_BOX:
                this.addressDataBillingPoBox = data;
                break;

            default:
                break;
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
