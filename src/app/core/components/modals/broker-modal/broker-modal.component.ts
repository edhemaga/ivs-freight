import { AddressEntity } from '../../../../../../appcoretruckassist';
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
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { BrokerModalResponse } from '../../../../../../appcoretruckassist';

import {
    CreateRatingCommand,
    CreateReviewCommand,
    SignInResponse,
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
import {
    ReviewCommentModal,
    TaUserReviewComponent,
} from '../../shared/ta-user-review/ta-user-review.component';
import {
    LikeDislikeModel,
    TaLikeDislikeService,
} from '../../shared/ta-like-dislike/ta-like-dislike.service';
import { BrokerTService } from '../../customer/state/broker-state/broker.service';
import { debounceTime, Subject, takeUntil, switchMap } from 'rxjs';
import { ReviewsRatingService } from '../../../services/reviews-rating/reviewsRating.service';
import {
    convertNumberInThousandSep,
    convertThousanSepInNumber,
} from '../../../utils/methods.calculations';
import { poBoxValidation } from '../../shared/ta-input/ta-input.regex-validations';
import { FormService } from '../../../services/form/form.service';
import { LoadModalComponent } from '../load-modal/components/load-modal/load-modal.component';
import { BrokerAvailableCreditResponse } from '../../../../../../appcoretruckassist/model/brokerAvailableCreditResponse';
import { BrokerResponse } from '../../../../../../appcoretruckassist/model/brokerResponse';
import {
    name2_24Validation,
    creditLimitValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { CommonModule } from '@angular/common';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaModalComponent } from '../../shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '../../shared/ta-input/ta-input.component';
import { InputAddressDropdownComponent } from '../../shared/input-address-dropdown/input-address-dropdown.component';
import { TaCheckboxComponent } from '../../shared/ta-checkbox/ta-checkbox.component';
import { TaCurrencyProgressBarComponent } from '../../shared/ta-currency-progress-bar/ta-currency-progress-bar.component';
import { TaUploadFilesComponent } from '../../shared/ta-upload-files/ta-upload-files.component';
import { TaInputDropdownComponent } from '../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { TaCustomCardComponent } from '../../shared/ta-custom-card/ta-custom-card.component';
import { TaInputNoteComponent } from '../../shared/ta-input-note/ta-input-note.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { TaSpinnerComponent } from '../../shared/ta-spinner/ta-spinner.component';

@Component({
    selector: 'app-broker-modal',
    templateUrl: './broker-modal.component.html',
    styleUrls: ['./broker-modal.component.scss'],
    animations: [tab_modal_animation('animationTabsModal')],
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
        AppTooltipComponent,
        TaModalComponent,
        TaTabSwitchComponent,
        TaInputComponent,
        InputAddressDropdownComponent,
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

    public brokerForm: UntypedFormGroup;

    public selectedTab: number = 1;
    public tabs: any[] = [
        {
            id: 1,
            name: 'Details',
            checked: true,
        },
        {
            id: 2,
            name: 'Contact',
        },
    ];

    public selectedPhysicalAddressTab: any = 3;
    public physicalAddressTabs: any[] = [
        {
            id: 3,
            name: 'Physical Address',
            checked: true,
        },
        {
            id: 4,
            name: 'PO Box',
            checked: false,
        },
    ];

    public selectedBillingAddressTab: number = 5;
    public billingAddressTabs: any[] = [
        {
            id: 5,
            name: 'Billing Address',
            checked: true,
        },
        {
            id: 6,
            name: 'PO Box',
            checked: false,
        },
    ];

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

    public isFormDirty: boolean = false;

    public disableOneMoreReview: boolean = false;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    public addNewAfterSave: boolean = false;

    public disableCardAnimation: boolean = false;

    public longitude: number;
    public latitude: number;

    public brokerName: string = '';

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private brokerModalService: BrokerTService,
        private reviewRatingService: ReviewsRatingService,
        private taLikeDislikeService: TaLikeDislikeService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getBrokerDropdown();
        this.isCredit({ id: 301, name: 'Custom', checked: true });
        this.followIsBillingAddressSame();

        this.companyUser = JSON.parse(localStorage.getItem('user'));
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
            creditType: ['Custom'], // Custom | Unlimited
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
                            }
                        },
                        error: () => {},
                    });
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
                this.addBroker();
                this.modalService.setModalSpinner({
                    action: 'save and add new',
                    status: true,
                    close: false,
                });
                this.addNewAfterSave = true;
            } else {
                // Save & Update
                if (data.action === 'save') {
                    if (this.brokerForm.invalid || !this.isFormDirty) {
                        this.inputService.markInvalid(this.brokerForm);
                        return;
                    }

                    if (this.editData?.type.includes('edit')) {
                        this.updateBroker(this.editData.id);
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: false,
                        });
                    } else {
                        this.addBroker();
                        this.modalService.setModalSpinner({
                            action: null,
                            status: true,
                            close: false,
                        });
                    }
                }
                // Delete
                if (data.action === 'delete' && this.editData) {
                    this.deleteBrokerById(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                        close: false,
                    });
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
        this.selectedContractDepartmentFormArray.splice(id, 1);

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

    // ------ Review ------

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
                    .pipe(
                        takeUntil(this.destroy$),
                        switchMap(() => {
                            return this.brokerModalService.getBrokerById(
                                this.editData.id
                            );
                        })
                    )
                    .subscribe({
                        next: (res: BrokerResponse) => {
                            if (res.reviews.length) {
                                this.reviews = res.reviews.map((item: any) => ({
                                    ...item,
                                    companyUser: {
                                        ...item.companyUser,
                                        avatar: item.companyUser.avatar,
                                    },
                                    commentContent: item.comment,
                                    rating: item.ratingFromTheReviewer,
                                }));

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
                },
                error: () => {},
            });
    }

    private deleteReview(reviews: ReviewCommentModal) {
        this.reviews = reviews.sortData;
        this.disableOneMoreReview = false;
        this.reviewRatingService
            .deleteReview(reviews.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
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
                next: () => {},
                error: () => {},
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

                    // From Another Modal Data
                    if (this.editData?.type === 'edit-contact') {
                        this.disableCardAnimation = true;
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
                            this.disableCardAnimation = true;
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
                            this.disableCardAnimation = true;
                        });
                    }
                },
                error: () => {},
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
            ...form
        } = this.brokerForm.value;

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
                this.selectedContractDepartmentFormArray[index].id;
        }

        newData = {
            ...newData,
            brokerContacts,
        };

        this.brokerModalService
            .addBroker(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
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
                        this.formService.resetForm(this.brokerForm);

                        this.selectedBillingAddress = null;
                        this.selectedBillingPoBox = null;
                        this.selectedContractDepartmentFormArray = [];
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

                        this.brokerForm.get('creditType').patchValue('Custom');
                        this.billingCredit = this.billingCredit.map(
                            (item, index) => {
                                return {
                                    ...item,
                                    checked: index === 0,
                                };
                            }
                        );

                        this.addNewAfterSave = false;

                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                            close: false,
                        });
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
            creditLimit,
            ...form
        } = this.brokerForm.value;

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
            files: documents ? documents : this.brokerForm.value.files,
            filesForDeleteIds: this.filesForDelete,
            longitude: this.longitude,
            latitude: this.latitude,
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
                    if (this.editData?.canOpenModal) {
                        switch (this.editData?.key) {
                            case 'load-modal': {
                                this.modalService.setModalSpinner({
                                    action: null,
                                    status: false,
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

    private deleteBrokerById(id: number): void {
        this.brokerModalService
            .deleteBrokerById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                        close: true,
                    });
                },
                error: () => {
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: false,
                        close: false,
                    });
                },
            });
    }

    private editBrokerById(id: number): void {
        this.brokerModalService
            .getBrokerById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (reasponse: any) => {
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
                                ? convertNumberInThousandSep(
                                      reasponse.creditLimit
                                  )
                                : null,
                        availableCredit: reasponse.availableCredit,
                        payTerm: reasponse.payTerm
                            ? reasponse.payTerm.name
                            : null,
                        note: reasponse.note,
                        ban: reasponse.ban,
                        dnu: reasponse.dnu,
                        brokerContacts: [],
                    });

                    this.brokerName = reasponse.businessName;

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
                    this.documents = reasponse.files;

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

                    // Contacts
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

                            this.selectedContractDepartmentFormArray.push(
                                contact.department
                            );
                        }
                    }
                    // Review
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
                        (item) =>
                            item.companyUser.id ===
                            this.companyUser.companyUserId
                    );

                    if (reviewIndex !== -1) {
                        this.disableOneMoreReview = true;
                    }

                    this.taLikeDislikeService.populateLikeDislikeEvent({
                        downRatingCount: reasponse.downCount,
                        upRatingCount: reasponse.upCount,
                        currentCompanyUserRating:
                            reasponse.currentCompanyUserRating,
                    });

                    this.isCredit(
                        this.billingCredit.find(
                            (item) => item.name === reasponse.creditType.name
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
                            reasponse.mainAddress.address ===
                                reasponse.billingAddress.address
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
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
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
            limit = convertThousanSepInNumber(limit);
            this.brokerModalService
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
                                convertNumberInThousandSep(res.creditLimit)
                            );

                        this.brokerForm
                            .get('availableCredit')
                            .patchValue(res.availableCredit);
                    },
                    error: () => {},
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
