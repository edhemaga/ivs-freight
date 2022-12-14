import {
    addressUnitValidation,
    addressValidation,
    businessNameValidation,
    departmentValidation,
    phoneExtension,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ShipperModalResponse } from '../../../../../../appcoretruckassist';
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
    ShipperResponse,
    SignInResponse,
    UpdateReviewCommand,
} from 'appcoretruckassist';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import {
    phoneFaxRegex,
    fullNameValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { ReviewCommentModal } from '../../shared/ta-user-review/ta-user-review.component';
import {
    LikeDislikeModel,
    TaLikeDislikeService,
} from '../../shared/ta-like-dislike/ta-like-dislike.service';
import { ShipperTService } from '../../customer/state/shipper-state/shipper.service';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../services/notification/notification.service';
import { ReviewsRatingService } from '../../../services/reviews-rating/reviewsRating.service';
import { FormService } from '../../../services/form/form.service';
import { convertTimeFromBackend } from '../../../utils/methods.calculations';

@Component({
    selector: 'app-shipper-modal',
    templateUrl: './shipper-modal.component.html',
    styleUrls: ['./shipper-modal.component.scss'],
    animations: [tab_modal_animation('animationTabsModal')],
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, TaLikeDislikeService, FormService],
})
export class ShipperModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
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

    public companyUser: SignInResponse = null;

    public isFormDirty: boolean;

    public disableOneMoreReview: boolean = false;

    public user: SignInResponse = JSON.parse(localStorage.getItem('user'));

    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

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

        this.formService.checkFormChange(this.shipperForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        if (data.action === 'close') {
            return;
        } else {
            // Save & Update
            if (data.action === 'save') {
                if (this.shipperForm.invalid || !this.isFormDirty) {
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
    }

    public removeShipperContacts(id: number) {
        this.shipperContacts.removeAt(id);
        this.selectedContractDepartmentFormArray.splice(id, 1);
    }

    public onScrollingShipperContacts(event: any) {
        this.isContactCardsScrolling = event.target.scrollLeft > 1;
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
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.editShipperById(this.editData.id);
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
            .subscribe();
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
            .subscribe();
    }

    private deleteShipperById(id: number) {
        this.shipperModalService
            .deleteShipperById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private editShipperById(id: number) {
        this.shipperModalService
            .getShipperById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                
                next: (res: any) => {
                    console.log(convertTimeFromBackend(res.receivingTo), "-------");
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

                    this.selectedAddress = res.address;
                    this.isPhoneExtExist = !!res.phoneExt;
                    this.documents = res.files;

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
                            item.companyUser.id === this.user.companyUserId
                    );

                    if (reviewIndex !== -1) {
                        this.disableOneMoreReview = true;
                    }

                    this.taLikeDislikeService.populateLikeDislikeEvent({
                        downRatingCount: res.downCount,
                        upRatingCount: res.upCount,
                        currentCompanyUserRating: res.currentCompanyUserRating,
                    });
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
