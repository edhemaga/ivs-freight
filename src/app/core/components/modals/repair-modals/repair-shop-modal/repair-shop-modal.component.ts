import { RepairOrderModalComponent } from '../repair-order-modal/repair-order-modal.component';
import {
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    AddressEntity,
    CreateResponse,
    RepairShopModalResponse,
    RepairShopResponse,
} from 'appcoretruckassist';
import { distinctUntilChanged, takeUntil, Subject } from 'rxjs';
import { RepairTService } from '../../../repair/state/repair.service';
import {
    accountBankValidation,
    addressUnitValidation,
    addressValidation,
    bankValidation,
    departmentValidation,
    phoneExtension,
    phoneFaxRegex,
    repairShopValidation,
    routingBankValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { BankVerificationService } from '../../../../services/BANK-VERIFICATION/bankVerification.service';
import { FormService } from '../../../../services/form/form.service';
import { convertTimeFromBackend } from 'src/app/core/utils/methods.calculations';
import { tab_modal_animation } from '../../../shared/animations/tabs-modal.animation';
import { ReviewsRatingService } from 'src/app/core/services/reviews-rating/reviewsRating.service';
import { ReviewCommentModal } from '../../../shared/ta-user-review/ta-user-review.component';
import {
    TaLikeDislikeService,
    LikeDislikeModel,
} from '../../../shared/ta-like-dislike/ta-like-dislike.service';
import { SignInResponse } from '../../../../../../../appcoretruckassist/model/signInResponse';
import { CreateRatingCommand } from '../../../../../../../appcoretruckassist/model/createRatingCommand';
import { CreateReviewCommand } from '../../../../../../../appcoretruckassist/model/createReviewCommand';
import { UpdateReviewCommand } from '../../../../../../../appcoretruckassist/model/updateReviewCommand';

@Component({
    selector: 'app-repair-shop-modal',
    templateUrl: './repair-shop-modal.component.html',
    styleUrls: ['./repair-shop-modal.component.scss'],
    animations: [tab_modal_animation('animationTabsModal')],
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, BankVerificationService, FormService],
})
export class RepairShopModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    @Input() editData: any;
    public repairShopForm: FormGroup;

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
        {
            id: 3,
            name: 'Review',
        },
    ];

    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };

    public isRepairShopFavourite: boolean = false;
    public isPhoneExtExist: boolean = false;

    public selectedAddress: AddressEntity = null;

    public labelsBank: any[] = [];
    public selectedBank: any = null;
    public isBankSelected: boolean = false;

    public services: any[] = [];

    // DAYS
    public openHoursDays = [
        'MON - SAT',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ];
    public isDaysVisible: boolean = false;

    // Documents
    public documents: any[] = [];
    public fileModified: boolean = false;
    public filesForDelete: any[] = [];

    // Contact Tab
    public isContactCardsScrolling: boolean = false;
    public labelsDepartments: any[] = [];
    public selectedContractDepartmentFormArray: any[] = [];

    // Review
    public reviews: any[] = [];
    public companyUser: SignInResponse = null;
    public disableOneMoreReview: boolean = false;

    public addNewAfterSave: boolean = false;
    public isFormDirty: boolean;

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private shopService: RepairTService,
        private modalService: ModalService,
        private bankVerificationService: BankVerificationService,
        private formService: FormService,
        private reviewRatingService: ReviewsRatingService,
        private taLikeDislikeService: TaLikeDislikeService
    ) {}

    ngOnInit() {
        this.companyUser = JSON.parse(localStorage.getItem('user'));
        this.createForm();
        this.getRepairShopModalDropdowns();
        this.onBankSelected();

        if (this.editData?.id) {
            this.editRepairShopById(this.editData.id);
            this.ratingChanges();
        }

        if (!this.editData || this.editData?.canOpenModal) {
            for (let i = 0; i < this.openHoursDays.length; i++) {
                this.addOpenHours(
                    this.openHoursDays[i],
                    i !== this.openHoursDays.length - 1,
                    i
                );
            }
        }
    }

    private createForm() {
        this.repairShopForm = this.formBuilder.group({
            name: [null, [Validators.required, ...repairShopValidation]],
            pinned: [null],
            phone: [null, [Validators.required, phoneFaxRegex]],
            phoneExt: [null, [...phoneExtension]],
            email: [null],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            openHours: this.formBuilder.array([]),
            bankId: [null, [...bankValidation]],
            routing: [null, routingBankValidation],
            account: [null, accountBankValidation],
            note: [null],
            contacts: this.formBuilder.array([]),
            files: [null],
        });

        this.inputService.customInputValidator(
            this.repairShopForm.get('email'),
            'email',
            this.destroy$
        );

        this.formService.checkFormChange(this.repairShopForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;
        let dotAnimation = document.querySelector('.animation-three-tabs');

        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };
    }

    public onModalAction(data: { action: string; bool: boolean }) {
        switch (data.action) {
            case 'close': {
                if (this.editData?.canOpenModal) {
                    switch (this.editData?.key) {
                        case 'repair-modal': {
                            this.modalService.setProjectionModal({
                                action: 'close',
                                payload: {
                                    key: this.editData?.key,
                                    value: null,
                                },
                                component: RepairOrderModalComponent,
                                size: 'large',
                                type: this.editData?.type,
                                closing: 'fastest',
                            });
                            break;
                        }
                        default: {
                            break;
                        }
                    }
                }
                break;
            }
            case 'save and add new': {
                if (this.repairShopForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.repairShopForm);
                    return;
                }
                this.addRepairShop();
                this.modalService.setModalSpinner({
                    action: 'save and add new',
                    status: true,
                });
                this.addNewAfterSave = true;
                break;
            }
            case 'save': {
                if (this.repairShopForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.repairShopForm);
                    return;
                }
                if (this.editData?.id) {
                    this.updateRepairShop(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                } else {
                    this.addRepairShop();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                }
                break;
            }
            case 'delete': {
                if (this.editData) {
                    this.deleteRepairShopById(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: 'delete',
                        status: true,
                    });
                }
                break;
            }
            default: {
                break;
            }
        }
    }

    public get openHours(): FormArray {
        return this.repairShopForm.get('openHours') as FormArray;
    }

    private createOpenHour(
        day: string,
        isDay: boolean,
        dayOfWeek: number,
        startTime: any = convertTimeFromBackend('8:00:00 AM'),
        endTime: any = convertTimeFromBackend('5:00:00 PM')
    ): FormGroup {
        return this.formBuilder.group({
            isDay: [isDay],
            dayOfWeek: [dayOfWeek],
            dayLabel: [day],
            startTime: [startTime],
            endTime: [endTime],
        });
    }

    public addOpenHours(
        day: string,
        isDay: boolean = false,
        dayOfWeek: number,
        startTime?: any,
        endTime?: any
    ) {
        if (!isDay) {
            this.openHours.push(this.createOpenHour(day, isDay, dayOfWeek));
        } else {
            this.openHours.push(
                this.createOpenHour(day, isDay, dayOfWeek, startTime, endTime)
            );
        }
    }

    public openHourDayAction(event: boolean, index: number) {
        this.openHours
            .at(index)
            .get('isDay')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (!value) {
                    this.openHours
                        .at(index)
                        .get('startTime')
                        .patchValue(convertTimeFromBackend('8:00:00 AM'));
                    this.openHours
                        .at(index)
                        .get('endTime')
                        .patchValue(convertTimeFromBackend('8:00:00 AM'));
                }
            });
    }

    public pickedServices() {
        return this.services.filter((item) => item.active).length;
    }

    public get contacts(): FormArray {
        return this.repairShopForm.get('contacts') as FormArray;
    }

    private createContacts(data?: {
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

    public addContacts(event: { check: boolean; action: string }) {
        const form = this.createContacts();

        if (event.check) {
            this.contacts.push(form);
        }
        this.inputService.customInputValidator(
            form.get('email'),
            'email',
            this.destroy$
        );
    }

    public removeContacts(id: number) {
        this.contacts.removeAt(id);
        this.selectedContractDepartmentFormArray.splice(id, 1);

        if (this.contacts.length === 0) {
            this.repairShopForm.markAsUntouched();
        }
    }

    public onScrollingContacts(event: any) {
        this.isContactCardsScrolling = event.target.scrollLeft > 1;
    }

    public onHandleAddress(event: {
        address: AddressEntity | any;
        valid: boolean;
    }): void {
        if (event.valid) {
            this.selectedAddress = event.address;
        }
    }

    public favouriteRepairShop() {
        this.isRepairShopFavourite = !this.isRepairShopFavourite;
        this.repairShopForm
            .get('pinned')
            .patchValue(this.isRepairShopFavourite);
    }

    public identity(index: number, item: any): number {
        return item.id;
    }

    public onSelectDropdown(event: any, action: string, indx?: number) {
        switch (action) {
            case 'bank': {
                this.selectedBank = event;
                if (!event) {
                    this.repairShopForm.get('bankId').patchValue(null);
                }
                break;
            }
            case 'contact-department': {
                this.selectedContractDepartmentFormArray[indx] = event;
                break;
            }
            default: {
                break;
            }
        }
    }

    public onSaveNewBank(bank: { data: any; action: string }) {
        this.selectedBank = bank.data;

        this.bankVerificationService
            .createBank({ name: this.selectedBank.name })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CreateResponse) => {
                    this.selectedBank = {
                        id: res.id,
                        name: this.selectedBank.name,
                    };
                    this.labelsBank = [...this.labelsBank, this.selectedBank];
                },
                error: () => {},
            });
    }

    private onBankSelected(): void {
        this.repairShopForm
            .get('bankId')
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe((value) => {
                this.isBankSelected = this.bankVerificationService.onSelectBank(
                    this.selectedBank ? this.selectedBank.name : value,
                    this.repairShopForm.get('routing'),
                    this.repairShopForm.get('account')
                );
            });
    }

    private editRepairShopById(id: number) {
        this.shopService
            .getRepairShopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RepairShopResponse) => {
                    this.repairShopForm.patchValue({
                        name: res.name,
                        pinned: res.pinned,
                        phone: res.phone,
                        phoneExt: res.phoneExt,
                        email: res.email,
                        address: res.address.address,
                        addressUnit: res.address.addressUnit,
                        openHours: [],
                        bankId: res.bank ? res.bank.name : null,
                        routing: res.routing,
                        account: res.account,
                        note: res.note,
                    });

                    this.selectedAddress = res.address;
                    this.selectedBank = res.bank;
                    this.isPhoneExtExist = !!res.phoneExt;
                    this.isRepairShopFavourite = res.pinned;
                    this.documents = res.files;

                    this.services = res.serviceTypes.map((item) => {
                        return {
                            id: item.serviceType.id,
                            serviceType: item.serviceType.name,
                            svg: `assets/svg/common/repair-services/${item.logoName}`,
                            active: item.active,
                        };
                    });
                    // Contacts
                    //   if (reasponse.contacts) {
                    //     for (const contact of reasponse.contacts) {
                    //         this.contacts.push(
                    //             this.createContacts({
                    //                 contactName: contact.contactName,
                    //                 departmentId: contact.department.name,
                    //                 phone: contact.phone,
                    //                 extensionPhone: contact.extensionPhone,
                    //                 email: contact.email,
                    //             })
                    //         );

                    //         this.selectedContractDepartmentFormArray.push(
                    //             contact.department
                    //         );
                    //     }
                    // }

                    // Review
                    // this.reviews = reasponse.reviews.map((item: any) => ({
                    //     ...item,
                    //     companyUser: {
                    //         ...item.companyUser,
                    //         avatar: item.companyUser.avatar,
                    //     },
                    //     commentContent: item.comment,
                    //     rating: item.ratingFromTheReviewer,
                    // }));

                    // const reviewIndex = this.reviews.findIndex(
                    //     (item) =>
                    //         item.companyUser.id ===
                    //         this.companyUser.companyUserId
                    // );

                    // if (reviewIndex !== -1) {
                    //     this.disableOneMoreReview = true;
                    // }

                    // this.taLikeDislikeService.populateLikeDislikeEvent({
                    //     downRatingCount: reasponse.downCount,
                    //     upRatingCount: reasponse.upCount,
                    //     currentCompanyUserRating:
                    //         reasponse.currentCompanyUserRating,
                    // });

                    res.openHours.forEach((el) => {
                        this.addOpenHours(
                            el.dayOfWeek,
                            !!(el.startTime && el.endTime),
                            this.openHoursDays.indexOf(el.dayOfWeek),
                            convertTimeFromBackend(el.startTime),
                            convertTimeFromBackend(el.endTime)
                        );
                    });
                },
                error: () => {},
            });
    }

    private addRepairShop() {
        let { addressUnit, openHours, ...form } = this.repairShopForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        openHours = openHours.map((item) => {
            if (!this.toggleDays) {
                return {
                    dayOfWeek: openHours[0].dayOfWeek,
                    startTime: openHours[0].startTime,
                    endTime: openHours[0].endTime,
                };
            }
            if (item.isDay) {
                return {
                    dayOfWeek: item.dayOfWeek,
                    startTime: item.startTime,
                    endTime: item.endTime,
                };
            } else {
                return {
                    dayOfWeek: item.dayOfWeek,
                    startTime: null,
                    endTime: null,
                };
            }
        });

        let newData: any = {
            ...form,
            address: { ...this.selectedAddress, addressUnit: addressUnit },
            bankId: this.selectedBank ? this.selectedBank.id : null,
            openHours: openHours,
            serviceTypes: this.services.map((item) => {
                return {
                    serviceType: item.serviceType,
                    active: item.active,
                };
            }),
            files: documents,
        };

        for (let index = 0; index < this.contacts.length; index++) {
            this.contacts[index].departmentId =
                this.selectedContractDepartmentFormArray[index].id;
        }

        newData = {
            ...newData,
            contacts: this.contacts,
        };

        this.shopService
            .addRepairShop(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    if (this.editData?.canOpenModal) {
                        switch (this.editData?.key) {
                            case 'repair-modal': {
                                this.modalService.setProjectionModal({
                                    action: 'close',
                                    payload: {
                                        key: this.editData?.key,
                                        value: null,
                                    },
                                    component: RepairOrderModalComponent,
                                    size: 'large',
                                    type: this.editData?.type,
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
                        this.formService.resetForm(this.repairShopForm);
                        this.modalService.setModalSpinner({
                            action: 'save and add new',
                            status: false,
                        });

                        this.services = this.services.map((item) => {
                            return {
                                ...item,
                                active: false,
                            };
                        });
                        if (!this.editData || this.editData?.canOpenModal) {
                            for (
                                let i = 0;
                                i < this.openHoursDays.length;
                                i++
                            ) {
                                this.addOpenHours(
                                    this.openHoursDays[i],
                                    i !== this.openHoursDays.length - 1,
                                    i
                                );
                            }
                        }
                        this.isRepairShopFavourite = false;
                        this.favouriteRepairShop = null;
                        this.isPhoneExtExist = false;
                        this.documents = [];

                        this.addNewAfterSave = false;
                    }
                },
                error: () => {},
            });
    }

    private updateRepairShop(id: number) {
        let { addressUnit, openHours, ...form } = this.repairShopForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        openHours = openHours.map((item) => {
            if (!this.toggleDays) {
                return {
                    dayOfWeek: openHours[0].dayOfWeek,
                    startTime: openHours[0].startTime,
                    endTime: openHours[0].endTime,
                };
            }
            if (item.isDay) {
                return {
                    dayOfWeek: item.dayOfWeek,
                    startTime: item.startTime,
                    endTime: item.endTime,
                };
            } else {
                return {
                    dayOfWeek: item.dayOfWeek,
                    startTime: null,
                    endTime: null,
                };
            }
        });

        let newData: any = {
            id: id,
            ...form,
            bankId: this.selectedBank ? this.selectedBank.id : null,
            address: { ...this.selectedAddress, addressUnit: addressUnit },
            openHours: openHours,
            serviceTypes: this.services.map((item) => {
                return {
                    serviceType: item.serviceType,
                    active: item.active,
                };
            }),
            files: documents ? documents : this.repairShopForm.value.files,
            filesForDeleteIds: this.filesForDelete,
        };

        for (let index = 0; index < this.contacts.length; index++) {
            this.contacts[index].departmentId =
                this.selectedContractDepartmentFormArray[index].id;
        }

        newData = {
            ...newData,
            contacts: this.contacts,
        };

        this.shopService
            .updateRepairShop(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private deleteRepairShopById(id: number) {
        this.shopService
            .deleteRepairShopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private getRepairShopModalDropdowns() {
        return this.shopService
            .getRepairShopModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RepairShopModalResponse) => {
                    this.labelsBank = res.banks;

                    this.services = res.serviceTypes.map((item) => {
                        return {
                            id: item.serviceType.id,
                            serviceType: item.serviceType.name,
                            svg: `assets/svg/common/repair-services/${item.logoName}`,
                            active: false,
                        };
                    });
                },
                error: () => {},
            });
    }

    public onFilesEvent(event: any) {
        this.documents = event.files;
        switch (event.action) {
            case 'add': {
                this.repairShopForm
                    .get('files')
                    .patchValue(JSON.stringify(event.files));
                break;
            }
            case 'delete': {
                this.repairShopForm
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

    // Reviews
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
                        entityTypeRatingId: 2,
                        entityTypeId: this.editData.id,
                        thumb: action.likeDislike,
                    };
                } else {
                    rating = {
                        entityTypeRatingId: 2,
                        entityTypeId: this.editData.id,
                        thumb: action.likeDislike,
                    };
                }

                this.reviewRatingService
                    .addRating(rating)
                    .pipe(takeUntil(this.destroy$))
                    .subscribe({
                        next: () => {
                            this.editRepairShopById(this.editData.id);
                        },
                        error: () => {},
                    });
            });
    }

    private addReview(reviews: ReviewCommentModal) {
        const review: CreateReviewCommand = {
            entityTypeReviewId: 2,
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

    public toggleDays() {
        this.isDaysVisible = !this.isDaysVisible;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
