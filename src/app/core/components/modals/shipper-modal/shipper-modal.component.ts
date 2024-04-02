import {
    addressUnitValidation,
    addressValidation,
    businessNameValidation,
    departmentValidation,
    phoneExtension,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ShipperModalResponse } from '../../../../../../appcoretruckassist';
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
import {
    AddressEntity,
    CreateRatingCommand,
    CreateReviewCommand,
    SignInResponse,
    UpdateReviewCommand,
} from 'appcoretruckassist';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import {
    phoneFaxRegex,
    fullNameValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import {
    ReviewCommentModal,
    TaUserReviewComponent,
} from '../../shared/ta-user-review/ta-user-review.component';
import {
    LikeDislikeModel,
    TaLikeDislikeService,
} from '../../shared/ta-like-dislike/ta-like-dislike.service';
import { ShipperTService } from 'src/app/pages/customer/services/shipper.service';
import { debounceTime, Subject, takeUntil, switchMap } from 'rxjs';
import { ReviewsRatingService } from '../../../services/reviews-rating/reviewsRating.service';
import { FormService } from '../../../services/form/form.service';
import { convertTimeFromBackend } from '../../../utils/methods.calculations';
import { LoadModalComponent } from '../../../../pages/load/pages/load-modal/load-modal.component';
import { ShipperResponse } from '../../../../../../appcoretruckassist/model/shipperResponse';
import { CommonModule } from '@angular/common';
import { AppTooltipComponent } from '../../standalone-components/app-tooltip/app-tooltip.component';
import { TaModalComponent } from '../../shared/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../standalone-components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '../../shared/ta-input/ta-input.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { InputAddressDropdownComponent } from '../../shared/input-address-dropdown/input-address-dropdown.component';
import { TaCustomCardComponent } from '../../shared/ta-custom-card/ta-custom-card.component';
import { TaCheckboxComponent } from '../../shared/ta-checkbox/ta-checkbox.component';
import { TaUploadFilesComponent } from '../../shared/ta-upload-files/ta-upload-files.component';
import { TaInputNoteComponent } from '../../shared/ta-input-note/ta-input-note.component';
import { TaInputDropdownComponent } from '../../shared/ta-input-dropdown/ta-input-dropdown.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-shipper-modal',
    templateUrl: './shipper-modal.component.html',
    styleUrls: ['./shipper-modal.component.scss'],
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
        TaCustomCardComponent,
        TaCheckboxComponent,
        TaUploadFilesComponent,
        TaInputNoteComponent,
        TaUserReviewComponent,
        TaInputDropdownComponent,
    ],
})
export class ShipperModalComponent implements OnInit, OnDestroy {
    @Input() editData: any = null;

    public shipperForm: UntypedFormGroup;

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

    public companyUser: SignInResponse = null;

    public isFormDirty: boolean;

    public disableOneMoreReview: boolean = false;

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];
    public longitude: number;
    public latitude: number;

    public addNewAfterSave: boolean = false;

    public disableCardAnimation: boolean = false;

    public shipperName: string = '';

    private destroy$ = new Subject<void>();

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private shipperModalService: ShipperTService,
        private modalService: ModalService,
        private taLikeDislikeService: TaLikeDislikeService,
        private reviewRatingService: ReviewsRatingService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.getShipperDropdowns();
        this.companyUser = JSON.parse(localStorage.getItem('user'));
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
            files: [null],
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
            this.addShipper();
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
                this.deleteShipperById(this.editData.id);
                this.modalService.setModalSpinner({
                    action: 'delete',
                    status: true,
                    close: false,
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

    public get shipperContacts(): UntypedFormArray {
        return this.shipperForm.get('shipperContacts') as UntypedFormArray;
    }

    private createShipperContacts(data?: {
        fullName: any;
        departmentId: any;
        phone: any;
        phoneExt: any;
        email: any;
    }): UntypedFormGroup {
        return this.formBuilder.group({
            fullName: [
                data?.fullName ? data.fullName : null,
                [Validators.required, ...fullNameValidation],
            ],
            departmentId: [
                data?.departmentId ? data.departmentId : null,
                [Validators.required, ...departmentValidation],
            ],
            phone: [
                data?.phone ? data.phone : null,
                [Validators.required, phoneFaxRegex],
            ],
            phoneExt: [data?.phoneExt ? data.phoneExt : null],
            email: [data?.email ? data.email : null],
        });
    }

    public addShipperContacts(event: { check: boolean; action: string }) {
        const form = this.createShipperContacts();
        if (event.check) {
            this.shipperContacts.push(form);
        }

        this.inputService.customInputValidator(
            form.get('email'),
            'email',
            this.destroy$
        );

        setTimeout(() => {
            this.trackShipperContactEmail();
        }, 50);
    }

    public removeShipperContacts(id: number) {
        this.shipperContacts.removeAt(id);
        this.selectedContractDepartmentFormArray.splice(id, 1);
    }

    public trackShipperContactEmail() {
        const helper = new Array(this.shipperContacts.length).fill(false);

        this.shipperContacts.valueChanges
            .pipe(debounceTime(300), takeUntil(this.destroy$))
            .subscribe((items) => {
                items.forEach((item, index) => {
                    if (item.email && helper[index] === false) {
                        helper[index] = true;

                        this.inputService.changeValidators(
                            this.shipperContacts.at(index).get('phone'),
                            false,
                            [],
                            false
                        );
                    }

                    if (!item.email && helper[index] === true) {
                        this.shipperContacts
                            .at(index)
                            .get('email')
                            .patchValue(null);
                        this.inputService.changeValidators(
                            this.shipperContacts.at(index).get('phone'),
                            true,
                            [phoneFaxRegex]
                        );
                        helper[index] = false;
                    }
                });
            });
    }

    public onScrollingShipperContacts(event: any) {
        this.isContactCardsScrolling = event.target.scrollLeft > 1;
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

    // ------- Review ------
    public createReview() {
        if (
            this.reviews.some((item) => item.isNewReview) ||
            this.disableOneMoreReview
        ) {
            return;
        }

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
                            return this.shipperModalService.getShipperById(
                                this.editData.id
                            );
                        })
                    )
                    .subscribe({
                        next: (res: ShipperResponse) => {
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
            .subscribe();
    }

    private addShipper() {
        const { addressUnit, shipperContacts, ...form } =
            this.shipperForm.value;
        let receivingShipping = this.receivingShippingObject();

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        let newData: any = {
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
            files: documents,
            longitude: this.longitude,
            latitude: this.latitude,
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
            .addShipper(newData)
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
                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                            close: false,
                        });

                        this.formService.resetForm(this.shipperForm);

                        this.selectedAddress = null;
                        this.selectedContractDepartmentFormArray = [];

                        this.shipperContacts.controls = [];

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
        const { addressUnit, shipperContacts, ...form } =
            this.shipperForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        let receivingShipping = this.receivingShippingObject();

        let newData: any = {
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
            files: documents ? documents : this.shipperForm.value.files,
            filesForDeleteIds: this.filesForDelete,
            longitude: this.longitude,
            latitude: this.latitude,
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

    private deleteShipperById(id: number) {
        this.shipperModalService
            .deleteShipperById(id)
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

    private editShipperById(id: number) {
        this.shipperModalService
            .getShipperById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: any) => {
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
                                : convertTimeFromBackend(res.shippingFrom),
                        shippingTo:
                            res.shippingHoursSameReceiving &&
                            res.shippingAppointment
                                ? null
                                : convertTimeFromBackend(res.shippingTo),
                        note: res.note,
                        shipperContacts: [],
                    });

                    this.shipperName = res.businessName;

                    this.selectedAddress = res.address;
                    this.isPhoneExtExist = !!res.phoneExt;
                    this.documents = res.files;
                    this.longitude = res.longitude;
                    this.latitude = res.latitude;

                    if (res.phoneExt) {
                        this.isPhoneExtExist = true;
                    }

                    if (res.shipperContacts.length) {
                        for (const contact of res.shipperContacts) {
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
                            this.selectedContractDepartmentFormArray.push(
                                contact.department
                            );
                        }
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

                    this.taLikeDislikeService.populateLikeDislikeEvent({
                        downRatingCount: res.downCount,
                        upRatingCount: res.upCount,
                        currentCompanyUserRating: res.currentCompanyUserRating,
                    });

                    this.startFormChanges();
                    setTimeout(() => {
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private getShipperDropdowns() {
        this.shipperModalService
            .getShipperDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: ShipperModalResponse) => {
                    this.labelsDepartments = res.departments;

                    // From Another Modal Data
                    if (this.editData?.type === 'edit-contact') {
                        this.disableCardAnimation = true;
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
                            this.disableCardAnimation = true;
                            this.editShipperById(this.editData.id);
                            this.tabs.push({
                                id: 3,
                                name: 'Review',
                            });
                            this.ratingChanges();
                        } else {
                            this.startFormChanges();
                        }
                    }
                    this.tabs = this.tabs.map((tab) => {
                        if (tab.name === this.editData.openedTab) {
                            return { ...tab, checked: true };
                        } else {
                            return { ...tab, checked: false };
                        }
                    });
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
                    shippingFrom: this.shipperForm.get('shippingFrom').value,
                    shippingTo: this.shipperForm.get('shippingTo').value,
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

    private startFormChanges() {
        this.formService.checkFormChange(this.shipperForm);
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
