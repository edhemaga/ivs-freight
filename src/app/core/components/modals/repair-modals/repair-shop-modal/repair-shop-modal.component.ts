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
import { distinctUntilChanged, Subject, takeUntil } from 'rxjs';
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
    LikeDislikeModel,
    TaLikeDislikeService,
} from '../../../shared/ta-like-dislike/ta-like-dislike.service';
import {
    CreateRatingCommand,
    CreateReviewCommand,
    SignInResponse,
    UpdateReviewCommand,
} from '../../../../../../../appcoretruckassist';
import moment from 'moment';
import { debounceTime } from 'rxjs/operators';

@Component({
    selector: 'app-repair-shop-modal',
    templateUrl: './repair-shop-modal.component.html',
    styleUrls: ['./repair-shop-modal.component.scss'],
    animations: [tab_modal_animation('animationTabsModal')],
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, BankVerificationService, FormService],
})
export class RepairShopModalComponent implements OnInit, OnDestroy {
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
            disabled: true,
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
        'MON - FRI',
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
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
    public disableCardAnimation: boolean = false;
    public longitude: number;
    public latitude: number;
    private destroy$ = new Subject<void>();

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

    public get openHours(): FormArray {
        return this.repairShopForm.get('openHours') as FormArray;
    }

    public get contacts(): FormArray {
        return this.repairShopForm.get('contacts') as FormArray;
    }

    public trackOpenHours() {
        this.openHours.valueChanges
            .pipe(debounceTime(2000), takeUntil(this.destroy$))
            .subscribe((array: any[]) => {
                array.forEach((item) => {
                    if (item.startTime && item.endTime) {
                        if (
                            moment(array[0].startTime, 'HH:mm:ss').format(
                                'HH:mm:ss'
                            ) !== '00:00:00' &&
                            moment(array[0].endTime, 'HH:mm:ss').format(
                                'HH:mm:ss'
                            ) !== '00:00:00'
                        ) {
                            this.repairShopForm
                                .get('openAlways')
                                .patchValue(false);
                        } else {
                            this.repairShopForm
                                .get('openAlways')
                                .patchValue(true);
                        }
                    }
                });
            });
    }

    ngOnInit() {
        this.companyUser = JSON.parse(localStorage.getItem('user'));
        this.createForm();
        this.getRepairShopModalDropdowns();
        this.onBankSelected();
        this.trackOpenHours();

        if (this.editData?.id) {
            this.disableCardAnimation = true;
            this.tabs = this.tabs.map((item) => {
                return {
                    ...item,
                    disabled: false,
                };
            });
            this.editRepairShopById(this.editData.id);
            this.ratingChanges();
        }

        if (!this.editData || this.editData?.canOpenModal) {
            for (let i = 0; i < this.openHoursDays.length; i++) {
                this.addOpenHours(
                    this.openHoursDays[i],
                    i !== this.openHoursDays.length - 1,
                    i - 1,
                    i == this.openHoursDays.length - 1
                        ? null
                        : convertTimeFromBackend('8:00:00 AM'),
                    i == this.openHoursDays.length - 1
                        ? null
                        : convertTimeFromBackend('5:00:00 AM')
                );
            }
            this.openHours.removeAt(1);
            this.addOpenHours('Sunday', false, 0, null, null);
        }
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

    public active24Hours(event: any) {
        this.repairShopForm.get('openAlways').patchValue(event.check);
        this.openHours.controls.forEach((item) => {
            if (item.get('isDay').value) {
                item.get('startTime').patchValue(
                    event.check
                        ? convertTimeFromBackend('0:00:00 AM')
                        : convertTimeFromBackend('8:00:00 AM')
                );
                item.get('endTime').patchValue(
                    event.check
                        ? convertTimeFromBackend('0:00:00 AM')
                        : convertTimeFromBackend('5:00:00 PM')
                );
            }
        });
    }

    public openHourDayAction(event: boolean, index: number) {
        this.openHours
            .at(index)
            .get('isDay')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.openHours
                        .at(index)
                        .get('startTime')
                        .patchValue(convertTimeFromBackend('8:00:00 AM'));
                    this.openHours
                        .at(index)
                        .get('endTime')
                        .patchValue(convertTimeFromBackend('5:00:00 PM'));
                } else {
                    this.openHours.at(index).get('startTime').patchValue(null);
                    this.openHours.at(index).get('endTime').patchValue(null);
                }
            });
    }

    public pickedServices() {
        return this.services.filter((item) => item.active).length;
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
            .createBank({ name: bank.data.name })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CreateResponse) => {
                    this.selectedBank = {
                        id: res.id,
                        name: bank.data.name,
                    };
                    this.labelsBank = [...this.labelsBank, this.selectedBank];
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

    public toggleDays() {
        this.isDaysVisible = !this.isDaysVisible;
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
            openHoursSameAllDays: [null],
            startTimeAllDays: [null],
            endTimeAllDays: [null],
            openAlways: [false],
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

    private createOpenHour(
        day: string,
        isDay: boolean,
        dayOfWeek: number,
        startTime?: any,
        endTime?: any
    ): FormGroup {
        return this.formBuilder.group({
            isDay: [isDay],
            dayOfWeek: [dayOfWeek],
            dayLabel: [day],
            startTime: [startTime],
            endTime: [endTime],
        });
    }

    private createContacts(data?: {
        id: number;
        fullName: string;
        departmentId: string;
        phone: string;
        phoneExt: string;
        email: string;
    }): FormGroup {
        return this.formBuilder.group({
            id: [data?.id ? data.id : null],
            fullName: [
                data?.fullName ? data.fullName : null,
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
            phoneExt: [
                data?.phoneExt ? data.phoneExt : null,
                [...phoneExtension],
            ],
            email: [data?.email ? data.email : null],
        });
    }

    private onBankSelected(): void {
        this.repairShopForm
            .get('bankId')
            .valueChanges.pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe(() => {
                const timeout = setTimeout(async () => {
                    this.isBankSelected =
                        await this.bankVerificationService.onSelectBank(
                            this.selectedBank ? this.selectedBank.name : null,
                            this.repairShopForm.get('routing'),
                            this.repairShopForm.get('account')
                        );
                    clearTimeout(timeout);
                }, 100);
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
                        openHoursSameAllDays: res.openHoursSameAllDays,
                        startTimeAllDays: res.startTimeAllDays,
                        endTimeAllDays: res.endTimeAllDays,
                        openAlways: res.openAlways,
                        bankId: res.bank ? res.bank.name : null,
                        routing: res.routing,
                        account: res.account,
                        note: res.note,
                    });

                    this.selectedAddress = res.address;
                    this.selectedBank = res.bank;
                    this.isBankSelected = !!this.selectedBank;
                    this.isPhoneExtExist = !!res.phoneExt;
                    this.isRepairShopFavourite = res.pinned;
                    this.documents = res.files;
                    this.longitude = res.longitude;
                    this.latitude = res.latitude;

                    // Services
                    this.services = res.serviceTypes.map((item) => {
                        return {
                            id: item.serviceType.id,
                            serviceType: item.serviceType.name,
                            svg: `assets/svg/common/repair-services/${item.logoName}`,
                            active: item.active,
                        };
                    });

                    // Contacts
                    if (res.contacts) {
                        for (const contact of res.contacts) {
                            this.contacts.push(
                                this.createContacts({
                                    id: contact.id,
                                    fullName: contact.fullName,
                                    departmentId: contact.department.name,
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

                    // Reviews
                    if (res.reviews?.length) {
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
                        currentCompanyUserRating: res.currentCompanyUserRating,
                    });

                    // Open Hours
                    if (res.openHoursSameAllDays) {
                        this.openHoursDays.forEach((el, index) => {
                            this.addOpenHours(
                                el,
                                true,
                                index,
                                convertTimeFromBackend(res.startTimeAllDays),
                                convertTimeFromBackend(res.endTimeAllDays)
                            );
                        });
                    } else {
                        this.addOpenHours(
                            'MON - SAT',
                            true,
                            -1,
                            res.openAlways
                                ? convertTimeFromBackend('00:00:00 AM')
                                : convertTimeFromBackend('8:00:00 AM'),
                            res.openAlways
                                ? convertTimeFromBackend('00:00:00 PM')
                                : convertTimeFromBackend('5:00:00 PM')
                        );
                        this.isDaysVisible = true;
                        res.openHours.forEach((el) => {
                            this.addOpenHours(
                                el.dayOfWeek,
                                !!(el.startTime && el.endTime),
                                this.openHoursDays.indexOf(el.dayOfWeek) - 1,
                                convertTimeFromBackend(el.startTime),
                                convertTimeFromBackend(el.endTime)
                            );
                        });
                    }

                    setTimeout(() => {
                        this.disableCardAnimation = false;
                    }, 1000);
                },
                error: () => {},
            });
    }

    private addRepairShop() {
        let {
            addressUnit,
            openHours,
            contacts,
            openHoursSameAllDays,
            startTimeAllDays,
            endTimeAllDays,
            ...form
        } = this.repairShopForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const formatOpenHours = openHours
            .map((item) => {
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
            })
            .filter((item) => {
                if (!this.isDaysVisible) {
                    return item.dayOfWeek === 0 || item.dayOfWeek === 6;
                }
                return item;
            })
            .filter((item) => item.dayOfWeek !== -1)
            .map((item) => {
                if (item.dayOfWeek === 0) {
                    item.dayOfWeek = 'Sunday';
                }
                return item;
            });

        console.log(formatOpenHours);

        let newData: any = {
            ...form,
            address: { ...this.selectedAddress, addressUnit: addressUnit },
            bankId: this.selectedBank ? this.selectedBank.id : null,
            openHoursSameAllDays: !this.isDaysVisible,
            startTimeAllDays: !this.isDaysVisible
                ? openHours[0].startTime
                : null,
            endTimeAllDays: !this.isDaysVisible ? openHours[0].endTime : null,
            openHours: formatOpenHours,
            serviceTypes: this.services.map((item) => {
                return {
                    serviceType: item.serviceType,
                    active: item.active,
                };
            }),
            files: documents,
            longitude: this.longitude,
            latitude: this.latitude,
        };

        for (let index = 0; index < contacts.length; index++) {
            contacts[index].departmentId =
                this.selectedContractDepartmentFormArray[index].id;
        }

        newData = {
            ...newData,
            contacts: contacts,
        };

        console.log('repair shop: ', newData);
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
                                    i !== this.openHoursDays.length - 1 &&
                                        i !== this.openHoursDays.length - 2,
                                    i - 1,
                                    i !== this.openHoursDays.length - 1 ||
                                        i !== this.openHoursDays.length - 2
                                        ? convertTimeFromBackend('8:00:00 AM')
                                        : null,
                                    i !== this.openHoursDays.length - 1 ||
                                        i !== this.openHoursDays.length - 2
                                        ? convertTimeFromBackend('5:00:00 PM')
                                        : null
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
        let {
            addressUnit,
            openHours,
            contacts,
            openHoursSameAllDays,
            startTimeAllDays,
            endTimeAllDays,
            ...form
        } = this.repairShopForm.value;

        let documents = [];
        this.documents.map((item) => {
            if (item.realFile) {
                documents.push(item.realFile);
            }
        });

        const formatOpenHours = openHours
            .map((item) => {
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
            })
            .filter((item) => {
                if (!this.isDaysVisible) {
                    return item.dayOfWeek === 5 || item.dayOfWeek === 6;
                }
                return item;
            })
            .filter((item) => item.dayOfWeek !== -1);

        let newData: any = {
            id: id,
            ...form,
            address: { ...this.selectedAddress, addressUnit: addressUnit },
            bankId: this.selectedBank ? this.selectedBank.id : null,
            openHoursSameAllDays: !this.isDaysVisible,
            startTimeAllDays: !this.isDaysVisible
                ? openHours[0].startTime
                : null,
            endTimeAllDays: !this.isDaysVisible ? openHours[0].endTime : null,
            openHours: formatOpenHours,
            serviceTypes: this.services.map((item) => {
                return {
                    serviceType: item.serviceType,
                    active: item.active,
                };
            }),
            files: documents,
            longitude: this.longitude,
            latitude: this.latitude,
        };

        for (let index = 0; index < contacts.length; index++) {
            contacts[index].departmentId =
                this.selectedContractDepartmentFormArray[index].id;
        }

        newData = {
            ...newData,
            contacts: contacts,
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
                    this.labelsDepartments = res.departments;
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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
