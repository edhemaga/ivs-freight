import {
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    Input,
    OnDestroy,
    OnInit,
    ViewEncapsulation,
} from '@angular/core';

import { CommonModule } from '@angular/common';
import {
    FormControl,
    FormGroup,
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Subject, forkJoin, of, takeUntil } from 'rxjs';

// Models
import { AddressEntity } from 'appcoretruckassist/model/addressEntity';
import {
    BankResponse,
    CreateResponse,
    EnumValue,
    RepairShopResponse,
    ServiceType,
} from 'appcoretruckassist/model/models';
import {
    CreateShopModel,
    DisplayServiceTab,
    OpenedTab,
    RepairShopModalAction,
    RepairShopModalService,
    RepairShopRatingReviewModal,
    RepairShopTabs,
    RepeairShopModalInput,
} from './models/edit-data.model';
import { ReviewComment } from '@shared/models/review-comment.model';

// Services
import { ModalService } from '@shared/services/modal.service';
import { BankVerificationService } from '@shared/services/bank-verification.service';
import { FormService } from '@shared/services/form.service';
import { RepairService } from '@shared/services/repair.service';
import { TaLikeDislikeService } from '@shared/components/ta-like-dislike/services/ta-like-dislike.service';

// Validators
import {
    repairShopValidation,
    phoneFaxRegex,
    phoneExtension,
    addressValidation,
    addressUnitValidation,
    bankValidation,
    routingBankValidation,
    accountBankValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// Helpers
import { createOpenHour, mapServices } from './utils/helper';
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Animation
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// Component
import { TaModalComponent } from '@shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaInputNoteComponent } from '@shared/components/ta-input-note/ta-input-note.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import { TaUploadFilesComponent } from '@shared/components/ta-upload-files/ta-upload-files.component';

// Pipes
import { ActiveItemsPipe } from '@shared/pipes/active-Items.pipe';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Enums
import {
    ActionTypesEnum,
    OpenWorkingHours,
    RepairShopModalEnum,
} from './enums/repair-shop-modal.enum';
import {
    RepairShopConstants,
    RepairShopModalStringEnum,
} from './utils/constants/repair-shop-modal.constants';
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { TaUserReviewComponent } from '@shared/components/ta-user-review/ta-user-review.component';
export type OpenHourFormGroup = FormGroup<{
    isWorkingDay: FormControl<boolean>;
    dayOfWeek: FormControl<number>;
    dayLabel: FormControl<string>;
    startTime: FormControl<string | null | Date>;
    endTime: FormControl<string | null | Date>;
}>;
@Component({
    selector: 'app-repair-shop-modal',
    templateUrl: './repair-shop-modal.component.html',
    styleUrls: ['./repair-shop-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    changeDetection: ChangeDetectionStrategy.OnPush,
    encapsulation: ViewEncapsulation.None,
    providers: [ModalService, BankVerificationService, FormService],
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
        TaCustomCardComponent,
        TaInputDropdownComponent,
        TaInputAddressDropdownComponent,
        TaInputNoteComponent,
        TaCheckboxComponent,
        TaUploadFilesComponent,
        TaModalTableComponent,
        TaUserReviewComponent,

        // Pipes
        ActiveItemsPipe,
    ],
})
export class RepairShopModalComponent implements OnInit, OnDestroy {
    // Enums
    RepairShopModalStringEnum = RepairShopModalStringEnum;
    TableStringEnum = TableStringEnum;
    public RepairShopModalEnum = RepairShopModalEnum;
    public modalTableTypeEnum = ModalTableTypeEnum;

    // Inputs
    @Input() editData: null | RepeairShopModalInput;

    // Tabs
    public tabs: RepairShopTabs[];
    selectedTab: OpenedTab = TableStringEnum.DETAILS;
    tabTitle: string;

    // Form
    public repairShopForm: UntypedFormGroup;

    // Animation
    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };
    public animationTabClass = 'animation-three-tabs';

    // Address
    public selectedAddress: AddressEntity;

    // Subject
    private destroy$ = new Subject<void>();

    // Services and Types
    public services: RepairShopModalService[] = [];
    public repairTypes: DisplayServiceTab[] = [];

    // Bank Tab
    public banks: BankResponse[];
    public selectedBank: BankResponse = null;
    public isBankSelected: boolean;

    // Contact Tab
    public contactAddedCounter: number = 0;
    isNewContactAdded: boolean;
    isDaysVisible: boolean;
    public showPhoneExt: boolean = false;

    // Reviews
    reviews: RepairShopRatingReviewModal[] = [];
    //TODO:
    contacts = [];
    isRequestInProgress: boolean;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private shopService: RepairService,
        private bankVerificationService: BankVerificationService,
        private cdr: ChangeDetectorRef,
        private modalService: ModalService,
        private taLikeDislikeService: TaLikeDislikeService
    ) {}

    ngOnInit() {
        this.initTabs();
        this.initializeServices();
        this.generateForm();
        this.initWorkingHours();
    }

    private generateForm() {
        this.repairShopForm = this.formBuilder.group({
            [RepairShopModalStringEnum.NAME]: [
                null,
                [Validators.required, ...repairShopValidation],
            ],
            [RepairShopModalStringEnum.PINNED]: [null],
            [RepairShopModalStringEnum.PHONE]: [
                null,
                [Validators.required, phoneFaxRegex],
            ],
            [RepairShopModalStringEnum.PHONE_EXT]: [null, [...phoneExtension]],
            [RepairShopModalStringEnum.EMAIL]: [null],
            [RepairShopModalStringEnum.ADDRESS]: [
                null,
                [Validators.required, ...addressValidation],
            ],
            [RepairShopModalStringEnum.ADDRESS_UNIT]: [
                null,
                [...addressUnitValidation],
            ],
            [RepairShopModalStringEnum.OPEN_HOURS]: this.formBuilder.array([]),
            [RepairShopModalStringEnum.OPEN_HOURS_SAME_ALL_DAYS]: [null],
            [RepairShopModalStringEnum.START_TIME_ALL_DAYS]: [null],
            [RepairShopModalStringEnum.END_TIME_ALL_DAYS]: [null],
            [RepairShopModalStringEnum.OPEN_ALWAYS]: [false],
            [RepairShopModalStringEnum.BANK_ID]: [null, [...bankValidation]],
            [RepairShopModalStringEnum.ROUTING]: [null, routingBankValidation],
            [RepairShopModalStringEnum.ACCOUNT]: [null, accountBankValidation],
            [RepairShopModalStringEnum.NOTE]: [null],
            [RepairShopModalStringEnum.CONTACTS]: [[]],
            [RepairShopModalStringEnum.FILES]: [[]],
            [RepairShopModalStringEnum.SHOP_SERVICE_TYPE]: [
                null,
                Validators.required,
            ],
            [RepairShopModalStringEnum.LONGITUDE]: [null],
            [RepairShopModalStringEnum.LATITUDE]: [null],
        });

        this.tabTitle = this.editData?.data?.name;
        this.repairShopForm.valueChanges.subscribe((s) => console.log(s));
    }

    // Inside your component
    private initializeServices() {
        return forkJoin({
            dropdowns: this.shopService.getRepairShopModalDropdowns(),
            repairShop: this.isEditMode
                ? this.shopService.getRepairShopById(this.editData?.id)
                : of(null),
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ dropdowns, repairShop }) => {
                    this.services = mapServices(dropdowns, true);
                    this.repairTypes = dropdowns.shopServiceTypes;
                    this.banks = dropdowns.banks;

                    if (repairShop) {
                        this.repairShopForm.patchValue({
                            [RepairShopModalStringEnum.NAME]: repairShop.name,
                            [RepairShopModalStringEnum.PINNED]:
                                repairShop.pinned,
                            [RepairShopModalStringEnum.PHONE]: repairShop.phone,
                            [RepairShopModalStringEnum.PHONE_EXT]:
                                repairShop.phoneExt,
                            [RepairShopModalStringEnum.EMAIL]: repairShop.email,
                            [RepairShopModalStringEnum.ADDRESS_UNIT]:
                                repairShop.address.addressUnit,
                            [RepairShopModalStringEnum.ADDRESS]:
                                repairShop.address.address,
                            [RepairShopModalStringEnum.OPEN_HOURS_SAME_ALL_DAYS]:
                                repairShop.openHoursSameAllDays,
                            [RepairShopModalStringEnum.START_TIME_ALL_DAYS]:
                                repairShop.startTimeAllDays,
                            [RepairShopModalStringEnum.END_TIME_ALL_DAYS]:
                                repairShop.endTimeAllDays,
                            [RepairShopModalStringEnum.OPEN_ALWAYS]:
                                repairShop.openAlways,
                            [RepairShopModalStringEnum.ROUTING]:
                                repairShop.routing,
                            [RepairShopModalStringEnum.ACCOUNT]:
                                repairShop.account,
                            [RepairShopModalStringEnum.NOTE]: repairShop.note,
                            [RepairShopModalStringEnum.CONTACTS]:
                                repairShop.contacts,
                            [RepairShopModalStringEnum.FILES]: repairShop.files,
                            [RepairShopModalStringEnum.SHOP_SERVICE_TYPE]:
                                repairShop.shopServiceType.id,
                            [RepairShopModalStringEnum.LONGITUDE]:
                                repairShop.longitude,
                            [RepairShopModalStringEnum.LATITUDE]:
                                repairShop.latitude,
                        });
                        this.mapEditData(repairShop);
                    }
                    this.preSelectService(repairShop?.shopServiceType);
                },
            });
    }

    private mapEditData(res: RepairShopResponse) {
        // This fields are custom and cannot be part of the form so we need to remap it
        this.showPhoneExt = !!res.phoneExt;
        this.services = mapServices(res, false);
        this.selectedAddress = res.address;
        this.isBankSelected = !!res.bank;
        if (res.bank) {
            this.selectedBank =
                this.banks.find((bank) => bank.id === res.bank.id) ?? null;
        }

        // Patch address
        this.onAddressChange({
            address: res.address,
            valid: true,
            longLat: {
                latitude: res.latitude,
                longitude: res.longitude,
            },
        });

        this.mapRatings(res);
    }

    private preSelectService(shopServiceType?: EnumValue) {
        const service = shopServiceType ?? this.repairTypes[0];
        this.repairShopForm
            .get(RepairShopModalStringEnum.SHOP_SERVICE_TYPE)
            .patchValue(service.id);

        this.repairTypes.forEach(
            (repairType) => (repairType.checked = repairType.id === service.id)
        );
    }

    public tabChange(selectedTab: RepairShopTabs): void {
        this.selectedTab = selectedTab.id;
        let dotAnimation = document.querySelector(`.${this.animationTabClass}`);

        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };
    }

    initTabs() {
        if (this.editData) this.selectedTab = this.editData.openedTab;
        this.tabs = RepairShopConstants.TABS(
            !this.isEditMode,
            this.selectedTab
        );
    }

    get isEditMode() {
        return this.editData?.data;
    }

    get modalTitle(): string {
        return this.isEditMode
            ? RepairShopModalEnum.MODAL_TITLE_EDIT
            : RepairShopModalEnum.MODAL_TITLE_ADD;
    }

    public mapRatings(res: RepairShopResponse) {
        // If there is no rating and commentContent, rating will not be visible
        this.reviews = res.ratingReviews.map((item) => ({
            ...item,
            commentContent: item.comment,
            rating: item.thumb,
        }));

        this.taLikeDislikeService.populateLikeDislikeEvent({
            downRatingCount: res.downCount,
            upRatingCount: res.upCount,
            currentCompanyUserRating: res.currentCompanyUserRating,
        });
    }

    public onAddressChange(event: {
        address: AddressEntity;
        valid: boolean;
        longLat: any;
    }) {
        if (event.valid) {
            this.selectedAddress = event.address;
            this.repairShopForm
                .get(RepairShopModalStringEnum.LONGITUDE)
                .patchValue(event.longLat.longitude);
            this.repairShopForm
                .get(RepairShopModalStringEnum.LATITUDE)
                .patchValue(event.longLat.latitude);
        }
    }

    // Favorite
    public addShopToFavorite() {
        this.favoriteField.patchValue(!this.isFavorite);
    }

    get isFavorite() {
        return !!this.favoriteField.value;
    }

    get favoriteField() {
        return this.repairShopForm.get(RepairShopModalStringEnum.PINNED);
    }

    get favoriteLabel() {
        return this.isFavorite
            ? this.RepairShopModalEnum.REMOVE_FAVORITE
            : this.RepairShopModalEnum.ADD_FAVORITE;
    }

    // Open hours
    public get openHours(): UntypedFormArray {
        return this.repairShopForm.get(
            RepairShopModalStringEnum.OPEN_HOURS
        ) as UntypedFormArray;
    }

    patchWorkingDayTime(item: any, startTime: Date, endTime: Date): void {
        item.get(RepairShopModalStringEnum.START_TIME)?.patchValue(startTime);
        item.get(RepairShopModalStringEnum.END_TIME)?.patchValue(endTime);
    }

    private initWorkingHours() {
        RepairShopConstants.DEFAULT_OPEN_HOUR_DAYS.forEach((day) =>
            this.openHours.push(createOpenHour(day, this.formBuilder))
        );
    }

    public toggleDays() {
        this.isDaysVisible = !this.isDaysVisible;
    }

    public addNewWorkingDays(index: number) {
        const newWorkingDay = this.openHours.at(index);
        const isShopOpen =
            newWorkingDay.get(RepairShopModalStringEnum.START_TIME).value ===
            null;
        const startTime = isShopOpen
            ? this.convertTime(OpenWorkingHours.EIGHTAM)
            : null;

        const endTime = isShopOpen
            ? this.convertTime(OpenWorkingHours.FIVEPM)
            : null;

        this.patchWorkingDayTime(newWorkingDay, startTime, endTime);
    }

    public toggle247WorkingHours() {
        this.openAlways.patchValue(!this.isOpenAllDay);

        const startTime = this.convertTime(
            this.isOpenAllDay
                ? OpenWorkingHours.MIDNIGHT
                : OpenWorkingHours.EIGHTAM
        );
        const endTime = this.convertTime(
            this.isOpenAllDay
                ? OpenWorkingHours.MIDNIGHT
                : OpenWorkingHours.FIVEPM
        );

        this.openHours.controls.forEach((item) => {
            if (item.get(RepairShopModalStringEnum.IS_WORKING_DAY)?.value) {
                this.patchWorkingDayTime(item, startTime, endTime);
            }
        });
    }

    get openAlways() {
        return this.repairShopForm.get(RepairShopModalStringEnum.OPEN_ALWAYS);
    }

    get isOpenAllDay() {
        return !!this.openAlways.value;
    }

    public convertTime(time: string) {
        return MethodsCalculationsHelper.convertTimeFromBackend(time);
    }

    // Services
    public repairTypeTabChange(repairType: EnumValue) {
        this.repairShopForm
            .get(RepairShopModalStringEnum.SHOP_SERVICE_TYPE)
            .patchValue(repairType.id);
    }

    public activeRepairService(service: RepairShopModalService) {
        service.active = !service.active;
    }

    // Bank
    public onSaveNewBank(bank: { data: { name: string } }) {
        this.bankVerificationService
            .createBank({ name: bank.data.name })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CreateResponse) => {
                    this.selectedBank = {
                        id: res.id,
                        name: bank.data.name,
                    };

                    this.banks = [...this.banks, this.selectedBank];
                },
                error: () => {},
            });
    }

    public onBankSelected(event: BankResponse | null) {
        this.selectedBank = event;

        if (!event)
            this.repairShopForm
                .get(RepairShopModalStringEnum.BANK_ID)
                .patchValue(null);

        this.checkBankField();
    }

    private checkBankField(): void {
        const timeout = setTimeout(async () => {
            this.isBankSelected =
                await this.bankVerificationService.onSelectBank(
                    this.selectedBank ? this.selectedBank.name : null,

                    this.repairShopForm.get(RepairShopModalStringEnum.ROUTING),
                    this.repairShopForm.get(RepairShopModalStringEnum.ACCOUNT)
                );
            this.cdr.detectChanges();
            clearTimeout(timeout);
        }, 100);
    }

    public onFilesEvent(event: any) {
        this.repairShopForm
            .get(RepairShopModalStringEnum.FILES)
            .patchValue(event.files);
    }

    get documents() {
        return this.repairShopForm.get(RepairShopModalStringEnum.FILES).value;
    }

    public onModalAction(data: RepairShopModalAction) {
        // Prevent double click
        if (!this.isModalValidToSubmit || this.isRequestInProgress) {
            return;
        }

        this.isRequestInProgress = true;
        if (data.action === ActionTypesEnum.SAVE_AND_ADD_NEW) {
            this.addNewRepairShop(true);
            return;
        }

        if (data.action === ActionTypesEnum.SAVE) {
            if (this.isEditMode) {
                this.updateRepairShop(this.editData.id);
            } else {
                this.addNewRepairShop(false);
            }

            return;
        }

        if (data.action === ActionTypesEnum.DELETE) {
            this.deleteRepairShopById(this.editData.id);
        }
    }

    getFromFieldValue(keyName: string) {
        const field = this.repairShopForm.get(keyName);

        if (field) {
            return field.value;
        }

        return null;
    }

    generateShopRequest() {
        const repairModel: CreateShopModel = {
            name: this.getFromFieldValue(RepairShopModalStringEnum.NAME),
            phone: this.getFromFieldValue(RepairShopModalStringEnum.PHONE),
            email: this.getFromFieldValue(RepairShopModalStringEnum.EMAIL),
            phoneExt: this.getFromFieldValue(
                RepairShopModalStringEnum.PHONE_EXT
            ),
            address: {
                ...this.selectedAddress,
                addressUnit: this.getFromFieldValue(
                    RepairShopModalStringEnum.ADDRESS_UNIT
                ),
            },
            serviceTypes: this.services.map((item) => {
                return {
                    serviceType: item.serviceType as ServiceType,
                    active: item.active,
                };
            }),
            bankId: this.selectedBank ? this.selectedBank.id : null,
            files: this.getFromFieldValue(RepairShopModalStringEnum.FILES),
            pinned: this.getFromFieldValue(RepairShopModalStringEnum.PINNED),
            note: this.getFromFieldValue(RepairShopModalStringEnum.NOTE),
            account: this.getFromFieldValue(RepairShopModalStringEnum.ACCOUNT),
            routing: this.getFromFieldValue(RepairShopModalStringEnum.ROUTING),
            latitude: this.getFromFieldValue(
                RepairShopModalStringEnum.LATITUDE
            ),
            longitude: this.getFromFieldValue(
                RepairShopModalStringEnum.LONGITUDE
            ),
            openAlways: this.getFromFieldValue(
                RepairShopModalStringEnum.OPEN_ALWAYS
            ),
            contacts: this.getFromFieldValue(
                RepairShopModalStringEnum.CONTACTS
            ),
            shopServiceType: this.getFromFieldValue(
                RepairShopModalStringEnum.SHOP_SERVICE_TYPE
            ),
            // TODO: Check meaning of this fields since we are not showing them on FE
            companyOwned: false,
            rent: 1,
            // TODO: HOURS NOT DONE yet
            openHoursSameAllDays: !this.isDaysVisible,
            startTimeAllDays: !this.isDaysVisible
                ? this.openHours.value.at(0).startTime
                : null,
            endTimeAllDays: !this.isDaysVisible
                ? this.openHours.value.at(0).endTime
                : null,
            weeklyDay: null,
            monthlyDay: null,
            openHours: [],
            payPeriod: 'Weekly',
        };
        console.log(repairModel);
        return repairModel;
    }

    // TODO:
    public addNewRepairShop(addNewShop: boolean) {
        this.shopService
            .addRepairShop(this.generateShopRequest())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.setModalSpinner(null, true, !addNewShop);
                    // TODO: Test this, aslo check if files be reseted and all manully setup values
                    if (addNewShop) this.repairShopForm.reset();
                },
                error: () => {
                    this.setModalSpinner(null, false, false);
                },
            });
    }

    updateRepairShop(id: number) {
        this.shopService
            .updateRepairShop({ id, ...this.generateShopRequest() })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.setModalSpinner(null, true, true);
                },
                error: () => {
                    this.setModalSpinner(null, false, false);
                },
            });
    }

    private deleteRepairShopById(id: number) {
        this.shopService
            .deleteRepairShopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () =>
                    this.setModalSpinner(ActionTypesEnum.DELETE, true, false),
                error: () =>
                    this.setModalSpinner(ActionTypesEnum.DELETE, false, false),
            });
    }

    private setModalSpinner(
        action:
            | null
            | ActionTypesEnum.SAVE_AND_ADD_NEW
            | ActionTypesEnum.DELETE,
        status: boolean,
        close: boolean
    ) {
        this.modalService.setModalSpinner({
            action,
            status,
            close,
        });

        // Wait for modal to close to prevent click while closing it
        setTimeout(() => (this.isRequestInProgress = false), 400);
    }

    get isModalValidToSubmit() {
        return this.repairShopForm.valid && this.repairShopForm.dirty;
    }

    // TODO: Check this code
    // Contact tab
    public addContact(): void {
        this.isNewContactAdded = true;

        setTimeout(() => {
            this.isNewContactAdded = false;
        }, 400);
    }
    public handleModalTableValueEmit(modalTableDataValue): void {
        this.contactAddedCounter = modalTableDataValue.length;

        this.repairShopForm
            .get(RepairShopModalStringEnum.CONTACTS)
            .patchValue(modalTableDataValue);

        console.log(modalTableDataValue);

        this.cdr.detectChanges();
    }
    public handleModalTableValidStatusEmit(validStatus: boolean): void {
        this.repairShopForm.setErrors({ invalid: !validStatus });
    }

    changeReviewsEvent(reviews: ReviewComment) {
        switch (reviews.action) {
            case 'delete': {
                // this.deleteReview(reviews);
                break;
            }
            case 'add': {
                // this.addReview(reviews);
                break;
            }
            case 'update': {
                // this.updateReview(reviews);
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
