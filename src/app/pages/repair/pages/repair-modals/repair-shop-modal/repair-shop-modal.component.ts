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
    FormsModule,
    ReactiveFormsModule,
    UntypedFormArray,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Subject, Subscription, forkJoin, of, takeUntil } from 'rxjs';

// Models
import { AddressEntity } from 'appcoretruckassist/model/addressEntity';
import {
    BankResponse,
    CreateResponse,
    CreateReviewCommand,
    DepartmentResponse,
    EnumValue,
    FileResponse,
    RepairShopContactCommand,
    RepairShopContactResponse,
    RepairShopOpenHoursCommand,
    RepairShopResponse,
    ServiceType,
    SignInResponse,
    UpdateReviewCommand,
} from 'appcoretruckassist/model/models';
import { ReviewComment } from '@shared/models/review-comment.model';
import { FileEvent } from '@shared/models/file-event.model';
import { UploadFile } from '@shared/components/ta-upload-files/models/upload-file.model';
import {
    RepeairShopModalInput,
    RepairShopTabs,
    RepairShopModalService,
    DisplayServiceTab,
    RepairShopModalAction,
    CreateShopModel,
} from '@pages/repair/pages/repair-modals/repair-shop-modal/models';

// Services
import { ModalService } from '@shared/services/modal.service';
import { BankVerificationService } from '@shared/services/bank-verification.service';
import { FormService } from '@shared/services/form.service';
import { RepairService } from '@shared/services/repair.service';
import { TaLikeDislikeService } from '@shared/components/ta-like-dislike/services/ta-like-dislike.service';
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';

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
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';
import { RepairShopHelper } from './utils/repair-shop.helper';
import { RepairShopConfig } from '../repair-order-modal/utils/config/repair-shop-form.config';

// Animation
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// Components
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
import { TaUserReviewComponent } from '@shared/components/ta-user-review/ta-user-review.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// Enums
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';
import { TableStringEnum } from '@shared/enums/table-string.enum';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';
import {
    ActionTypesEnum,
    FileActionEvent,
    OpenWorkingHours,
    RepairShopModalStringEnum,
    RepairShopModalEnum,
} from '@pages/repair/pages/repair-modals/repair-shop-modal/enums';

// Constants
import { RepairShopConstants } from './utils/constants/repair-shop-modal.constants';

// SVG Routes
import { RepairShopModalSvgRoutes } from './utils/svg-routes/repair-shop-modal-svg-routes';

// Types
import { OpenedTab } from '@pages/repair/pages/repair-modals/repair-shop-modal/types/open-tabs.type';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';

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
        TaCheckboxCardComponent,
    ],
})
export class RepairShopModalComponent implements OnInit, OnDestroy {
    // Enums
    public repairShopModalSvgRoutes = RepairShopModalSvgRoutes;
    public RepairShopModalStringEnum = RepairShopModalStringEnum;
    public TableStringEnum = TableStringEnum;
    public RepairShopModalEnum = RepairShopModalEnum;
    public modalTableTypeEnum = ModalTableTypeEnum;

    // Inputs
    @Input() editData: RepeairShopModalInput;

    // Tabs
    public tabs: RepairShopTabs[];
    public selectedTab: OpenedTab = TableStringEnum.DETAILS;
    public tabTitle: string;

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
    public isNewContactAdded: boolean;
    public isDaysVisible: boolean;
    public showPhoneExt: boolean = false;
    // Reviews
    public reviews: any[] = [];
    public contacts = [];
    public isRequestInProgress: boolean;
    private departments: DepartmentResponse[];
    private isContactFormValid: boolean = true;
    public disableOneMoreReview: boolean;
    public files: UploadFile[] | FileResponse[] = [];
    public filesForDelete: any[] = [];
    public companyUser: SignInResponse = null;
    public daysOfWeekDropdown: EnumValue[];
    public payPeriodsDropdown: EnumValue[];
    public daysOfMonthDropdown: EnumValue[];
    public selectedPayPeriod: EnumValue;
    public selectedWeeklyDay: EnumValue;
    public selectedMonthlyDays: EnumValue;
    public isMonthlyPeriodSeleced: boolean;
    public workingDaysLabel = RepairShopConstants.DEFAULT_OPEN_HOUR_DAYS;

    public openHoursFormField: ITaInput =
        RepairShopConfig.getOpenHoursFormField();
    constructor(
        private formBuilder: UntypedFormBuilder,
        private shopService: RepairService,
        private bankVerificationService: BankVerificationService,
        private cdr: ChangeDetectorRef,
        private modalService: ModalService,
        private taLikeDislikeService: TaLikeDislikeService,
        private formService: FormService,
        private reviewRatingService: ReviewsRatingService
    ) {}

    public get isModalValidToSubmit() {
        return (
            this.repairShopForm.valid &&
            this.repairShopForm.dirty &&
            this.isContactFormValid
        );
    }

    public get openAlways() {
        return this.repairShopForm.get(RepairShopModalStringEnum.OPEN_ALWAYS);
    }

    public get isOpenAllDay() {
        return !!this.openAlways.value;
    }

    public get isEditMode() {
        return this.editData?.data || this.editData?.id;
    }

    public get isCompanyOwnedOptionAvailable(): boolean {
        return this.editData?.companyOwned;
    }

    public get modalTitle(): string {
        if (this.isCompanyOwnedOptionAvailable) {
            return this.isEditMode
                ? RepairShopModalEnum.COMPANY_MODAL_TITLE_EDIT
                : RepairShopModalEnum.COMPANY_MODAL_TITLE_ADD;
        }

        return this.isEditMode
            ? RepairShopModalEnum.MODAL_TITLE_EDIT
            : RepairShopModalEnum.MODAL_TITLE_ADD;
    }

    public get isFavorite() {
        return !!this.favoriteField.value;
    }

    private get favoriteField() {
        return this.repairShopForm.get(RepairShopModalStringEnum.PINNED);
    }

    public get favoriteLabel() {
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

    public get nameInputConfig(): ITaInput {
        return RepairShopConfig.getNameInputConfig();
    }

    public get phoneInputConfig(): ITaInput {
        return RepairShopConfig.getPhoneInputConfig();
    }

    public get phoneExtInputConfig(): ITaInput {
        return RepairShopConfig.getPhoneExtInputConfig();
    }

    public get emailInputConfig(): ITaInput {
        return RepairShopConfig.getEmailInputConfig();
    }

    public get addressInputConfig(): ITaInput {
        return RepairShopConfig.getAddressInputConfig();
    }

    public get addressUnitInputConfig(): ITaInput {
        return RepairShopConfig.getAddressUnitInputConfig();
    }

    public get bankInputConfig(): ITaInput {
        return RepairShopConfig.getBankInputConfig();
    }

    public get payPeriodConfig(): ITaInput {
        return RepairShopConfig.getPayPeriodConfig();
    }

    public get payDayConfig(): ITaInput {
        return RepairShopConfig.getDayConfig();
    }

    public get payMonthlyConfig(): ITaInput {
        return RepairShopConfig.getMonthlyPeriodConfig();
    }

    get accountNumberInputConfig(): ITaInput {
        return RepairShopConfig.getAccountNumberInputConfig(
            this.isBankSelected
        );
    }

    get routingNumberInputConfig(): ITaInput {
        return RepairShopConfig.getRoutingNumberInputConfig(
            this.isBankSelected
        );
    }

    public get rentInputConfig(): ITaInput {
        return RepairShopConfig.getRentInputConfig();
    }

    public get getServiceCounter(): number {
        return this.services.filter((service) => service.active).length;
    }

    ngOnInit() {
        this.initTabs();
        this.generateForm();
        this.initializeServices();
        this.companyUser = JSON.parse(localStorage.getItem('user'));
    }

    private generateForm(): void {
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
            [RepairShopModalStringEnum.OPEN_ALWAYS]: [false],
            [RepairShopModalStringEnum.ACCOUNT]: [null, accountBankValidation],
            [RepairShopModalStringEnum.NOTE]: [null],
            [RepairShopModalStringEnum.CONTACTS]: [[]],
            [RepairShopModalStringEnum.FILES]: [[]],
            [RepairShopModalStringEnum.SHOP_SERVICE_TYPE]: [
                null,
                Validators.required,
            ],
            [RepairShopModalStringEnum.ROUTING]: [null, routingBankValidation],
            [RepairShopModalStringEnum.BANK_ID]: [null, [...bankValidation]],
            [RepairShopModalStringEnum.LONGITUDE]: [null],
            [RepairShopModalStringEnum.LATITUDE]: [null],
            [RepairShopModalStringEnum.COMPANY_OWNED]: [true],
            [RepairShopModalStringEnum.WEEKLY_DAY]: [null],
            [RepairShopModalStringEnum.PAY_PERIOD]: [null],
            [RepairShopModalStringEnum.MONTHLY_DAYS]: [null],
            [RepairShopModalStringEnum.RENT]: [null],
            [RepairShopModalStringEnum.OPEN_HOURS]: this.formBuilder.array([]),
        });

        this.tabTitle = this.editData?.data?.name;
    }

    // Inside your component
    private initializeServices(): Subscription {
        return forkJoin({
            dropdowns: this.shopService.getRepairShopModalDropdowns(),
            repairShop: this.isEditMode
                ? this.shopService.getRepairShopById(this.editData?.id)
                : of(null),
        })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: ({ dropdowns, repairShop }) => {
                    this.initWorkingHours(repairShop);

                    this.services = RepairShopHelper.mapServices(
                        dropdowns,
                        true
                    );
                    this.repairTypes = dropdowns.shopServiceTypes;
                    this.banks = dropdowns.banks;
                    this.departments = dropdowns.departments;
                    this.payPeriodsDropdown = dropdowns.payPeriods;
                    this.daysOfWeekDropdown = dropdowns.daysOfWeek;
                    this.daysOfMonthDropdown = dropdowns.monthlyDays;

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
                            [RepairShopModalStringEnum.OPEN_ALWAYS]: false,
                            [RepairShopModalStringEnum.ACCOUNT]:
                                repairShop.account,
                            [RepairShopModalStringEnum.NOTE]: repairShop.note,
                            [RepairShopModalStringEnum.CONTACTS]:
                                repairShop.contacts,
                            [RepairShopModalStringEnum.FILES]: repairShop.files,
                            [RepairShopModalStringEnum.SHOP_SERVICE_TYPE]:
                                repairShop.shopServiceType.id,
                            [RepairShopModalStringEnum.ROUTING]:
                                repairShop.routing,
                            [RepairShopModalStringEnum.BANK_ID]:
                                repairShop?.bank?.id ?? null,
                            [RepairShopModalStringEnum.LONGITUDE]:
                                repairShop.longitude,
                            [RepairShopModalStringEnum.LATITUDE]:
                                repairShop.latitude,
                            [RepairShopModalStringEnum.COMPANY_OWNED]:
                                repairShop.companyOwned,
                            [RepairShopModalStringEnum.WEEKLY_DAY]:
                                repairShop.weeklyDay,
                            [RepairShopModalStringEnum.PAY_PERIOD]:
                                repairShop.payPeriod,
                            [RepairShopModalStringEnum.MONTHLY_DAYS]:
                                repairShop.monthlyDay,
                            [RepairShopModalStringEnum.RENT]: repairShop.rent,
                        });

                        this.mapEditData(repairShop);
                    }
                    this.preSelectService(repairShop?.shopServiceType);
                },
            });
    }

    private mapEditData(res: RepairShopResponse): void {
        // This fields are custom and cannot be part of the form so we need to remap it
        this.showPhoneExt = !!res.phoneExt;
        this.services = RepairShopHelper.mapServices(res, false);
        this.selectedAddress = res.address;
        this.isBankSelected = !!res.bank;
        this.files = res.files;
        if (res.payPeriod) {
            this.selectedPayPeriod =
                this.payPeriodsDropdown.find(
                    (payPeriod) => payPeriod.id === res.payPeriod.id
                ) ?? null;
        }

        if (res.weeklyDay) {
            this.selectedWeeklyDay =
                this.daysOfWeekDropdown.find(
                    (weeklyDay) => weeklyDay.id === res.weeklyDay.id
                ) ?? null;
        }

        if (res.monthlyDay) {
            this.selectedMonthlyDays =
                this.daysOfMonthDropdown.find(
                    (monthlyDay) => monthlyDay.id === res.monthlyDay.id
                ) ?? null;
        }

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

        this.contacts = res.contacts;
        this.checkForPayPeriodMethod(res.payPeriod);
        this.mapRatings(res);
    }

    private checkForPayPeriodMethod(payPeriod: EnumValue | null) {
        this.isMonthlyPeriodSeleced = payPeriod?.id === 2;
    }

    private preSelectService(shopServiceType?: EnumValue): void {
        const service = shopServiceType ?? this.repairTypes[0];
        this.repairTypes.forEach(
            (repairType) => (repairType.checked = repairType.id === service.id)
        );
        this.repairShopForm
            .get(RepairShopModalStringEnum.SHOP_SERVICE_TYPE)
            .patchValue(service.id);
    }

    public tabChange(selectedTab: RepairShopTabs): void {
        this.selectedTab = selectedTab.id;
        const dotAnimation = document.querySelector(
            `.${this.animationTabClass}`
        );

        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };
    }

    private initTabs(): void {
        if (this.editData)
            this.selectedTab =
                this.editData.openedTab ?? TableStringEnum.DETAILS;
        this.tabs = RepairShopHelper.TABS(!this.isEditMode, this.selectedTab);
    }

    public mapRatings(res: RepairShopResponse): void {
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
    }): void {
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
    public addShopToFavorite(): void {
        this.favoriteField.patchValue(!this.isFavorite);
    }

    private patchWorkingDayTime(
        item: any,
        startTime: string | Date,
        endTime: string | Date,
        isWorkingDay: boolean
    ): void {
        item.get(RepairShopModalStringEnum.START_TIME)?.patchValue(startTime);
        item.get(RepairShopModalStringEnum.END_TIME)?.patchValue(endTime);
        item.get(RepairShopModalStringEnum.IS_WORKING_DAY)?.patchValue(
            isWorkingDay
        );
    }

    private initWorkingHours(repairShop: RepairShopResponse): void {
        if (this.editData?.id) {
            this.workingDaysLabel.forEach((day) => {
                const matchingOpenHours = repairShop.openHours.filter(
                    (openDay) => openDay.dayOfWeek === day.dayOfWeek
                );

                // Create the open hour entry
                const openHourEntry = RepairShopHelper.createOpenHour(
                    {
                        ...day,
                        shifts: matchingOpenHours.map((openDay) => ({
                            startTime: openDay.startTime,
                            endTime: openDay.endTime,
                        })),
                    },
                    this.formBuilder,
                    matchingOpenHours.length > 0
                );

                this.openHours.push(openHourEntry);
            });
        } else {
            // For new repair shop
            RepairShopConstants.DEFAULT_OPEN_HOUR_DAYS.forEach((defaultDay) => {
                this.openHours.push(
                    RepairShopHelper.createOpenHour(
                        defaultDay,
                        this.formBuilder,
                        defaultDay.isWorkingDay
                    )
                );
            });
        }
    }

    public addShift(dayIndex: number): void {
        const openHour = this.openHours.at(dayIndex) as UntypedFormGroup;
        const shifts = openHour.get(
            RepairShopModalStringEnum.SHIFTS
        ) as UntypedFormArray;
        shifts.push(
            this.formBuilder.group({
                startTime: [null],
                endTime: [null],
            })
        );
    }

    // Working hours
    public toggleWorkingDay(index: number): void {
        const newWorkingDay = this.openHours.at(index);

        // Toggle value
        const dayActiveField = this.openHours
            .at(index)
            .get(RepairShopModalStringEnum.IS_WORKING_DAY);
        dayActiveField.patchValue(!dayActiveField.value);

        const startTime = dayActiveField.value
            ? this.isOpenAllDay
                ? OpenWorkingHours.MIDNIGHT
                : OpenWorkingHours.EIGHTAM
            : null;

        const endTime = dayActiveField.value
            ? this.isOpenAllDay
                ? OpenWorkingHours.MIDNIGHT
                : OpenWorkingHours.FIVEPM
            : null;

        this.patchWorkingDayTime(
            newWorkingDay,
            startTime,
            endTime,
            dayActiveField.value
        );
    }

    public toggleDoubleWorkingTime(dayIndex: number): void {
        const openHour = this.openHours.at(dayIndex) as UntypedFormGroup;
        const shifts = openHour.get(
            RepairShopModalStringEnum.SHIFTS
        ) as UntypedFormArray;

        if (shifts.length === 1) {
            // Add second shift
            shifts.push(
                this.formBuilder.group({
                    startTime: [OpenWorkingHours.EIGHTAM],
                    endTime: [OpenWorkingHours.FIVEPM],
                })
            );
        } else {
            // Remove second shift
            shifts.removeAt(1);
        }
    }

    public toggle247WorkingHours(): void {
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
                this.patchWorkingDayTime(item, startTime, endTime, true);
            }
        });
    }

    public convertTime(time: string): Date {
        return MethodsCalculationsHelper.convertTimeFromBackend(time);
    }

    public applyMondayToAllDays(): void {
        const monday = this.openHours.controls[0];

        this.openHours.controls.forEach((item, index) => {
            if (
                item.get(RepairShopModalStringEnum.IS_WORKING_DAY)?.value &&
                index
            ) {
                item.patchValue({
                    ...monday.value,
                    [RepairShopModalStringEnum.DAY_OF_WEEK]: item.get(
                        RepairShopModalStringEnum.DAY_OF_WEEK
                    ).value,
                });
            }
        });
    }

    // Services
    public repairTypeTabChange(repairType: EnumValue): void {
        this.repairShopForm
            .get(RepairShopModalStringEnum.SHOP_SERVICE_TYPE)
            .patchValue(repairType.id);
    }

    public activeRepairService(service: RepairShopModalService): void {
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

    public onBankSelected(event: BankResponse | null): void {
        this.selectedBank = event;

        if (!event)
            this.repairShopForm
                .get(RepairShopModalStringEnum.BANK_ID)
                .patchValue(null);

        this.checkBankField();
    }

    public onPayPeriodSelect(event: EnumValue): void {
        this.selectedPayPeriod = event;
        this.onWeeklyDaySelected(null);
        this.onMonthlyDaySelected(null);
        this.checkForPayPeriodMethod(event);

        if (!event)
            this.repairShopForm
                .get(RepairShopModalStringEnum.PAY_PERIOD)
                .patchValue(null);
    }

    public onWeeklyDaySelected(event: EnumValue): void {
        this.selectedWeeklyDay = event;

        if (!event)
            this.repairShopForm
                .get(RepairShopModalStringEnum.WEEKLY_DAY)
                .patchValue(null);
    }

    public onMonthlyDaySelected(event: EnumValue): void {
        this.selectedMonthlyDays = event;

        if (!event)
            this.repairShopForm
                .get(RepairShopModalStringEnum.MONTHLY_DAYS)
                .patchValue(null);
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

    public onFilesEvent(event: FileEvent): void {
        this.files = event.files;

        switch (event.action) {
            case FileActionEvent.ADD:
                this.updateFilesField(event.files);
                break;
            case FileActionEvent.DELETE:
                this.handleDeleteEvent(event);
                break;
            default:
                console.warn(`Unhandled file event action: ${event.action}`);
        }
    }

    private updateFilesField(files: any[]): void {
        const filesValue = files.length ? JSON.stringify(files) : null;
        this.repairShopForm
            .get(RepairShopModalStringEnum.FILES)
            .patchValue(filesValue);
    }

    private handleDeleteEvent(event: FileEvent): void {
        this.updateFilesField(event.files);

        if (event.deleteId) {
            this.filesForDelete.push(event.deleteId);
        }
    }

    public onModalAction(data: RepairShopModalAction): void {
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
        if (data.action === ActionTypesEnum.CLOSE_BUSINESS) {
            this.showCloseBusinessModal();
        }
    }

    private getFromFieldValue(keyName: string) {
        const field = this.repairShopForm.get(keyName);

        if (field) {
            return field.value;
        }

        return null;
    }

    private generateShopRequest(): CreateShopModel {
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
            files: this.createDocumentsForRequest(),
            filesForDeleteIds: this.filesForDelete,
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
            // openAlways: this.getFromFieldValue(
            //     RepairShopModalStringEnum.OPEN_ALWAYS
            // ),
            contacts: this.mapContacts(),
            shopServiceType: this.getFromFieldValue(
                RepairShopModalStringEnum.SHOP_SERVICE_TYPE
            ),
            openHours: this.formatOpenHours(),
            weeklyDay: this.selectedWeeklyDay
                ? this.selectedWeeklyDay.id
                : null,
            payPeriod: this.selectedPayPeriod
                ? this.selectedPayPeriod.id
                : null,
            monthlyDay: this.selectedMonthlyDays
                ? this.selectedMonthlyDays.id
                : null,
            companyOwned: this.getFromFieldValue(
                RepairShopModalStringEnum.COMPANY_OWNED
            ),
            rent: this.getFromFieldValue(RepairShopModalStringEnum.RENT),
        };
        return repairModel;
    }
    private formatOpenHours(): RepairShopOpenHoursCommand[] {
        const formattedOpenHours: RepairShopOpenHoursCommand[] = [];
        const openHours = [...this.openHours.value];

        openHours.forEach((openHour: any) => {
            if (openHour.isWorkingDay) {
                openHour.shifts.forEach((shift: any) => {
                    formattedOpenHours.push({
                        // isWorkingDay: openHour.isWorkingDay,
                        dayOfWeek: openHour.dayOfWeek,
                        startTime: shift.startTime,
                        endTime: shift.endTime,
                    });
                });
            }
        });

        return formattedOpenHours;
    }

    private createDocumentsForRequest(): Array<Blob> {
        let documents: Array<Blob> = [];
        (this.files as UploadFile[]).map((item) => {
            if (item.realFile) documents.push(item.realFile);
        });
        return documents;
    }

    private mapContacts(): RepairShopContactCommand[] {
        const contacts: RepairShopContactResponse[] = this.getFromFieldValue(
            RepairShopModalStringEnum.CONTACTS
        );
        return contacts.map((contact) => {
            return {
                ...contact,
                departmentId: this.departments.find(
                    (d) => d.name === contact.department
                )?.id,
            };
        });
    }

    public addNewRepairShop(addNewShop: boolean): void {
        this.shopService
            .addRepairShop(this.generateShopRequest())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.setModalSpinner(null, false, !addNewShop);
                    if (addNewShop) {
                        this.formService.resetForm(this.repairShopForm);
                        this.tabChange(this.tabs[0]);
                        this.contacts = [];
                        this.showPhoneExt = false;
                        this.selectedAddress = null;
                        this.isBankSelected = null;
                        this.files = [];
                        this.filesForDelete = [];
                    }
                },
                error: () => {
                    this.setModalSpinner(null, false, false);
                },
            });
    }

    private updateRepairShop(id: number): void {
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

    private deleteRepairShopById(id: number): void {
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
    ): void {
        this.modalService.setModalSpinner({
            action,
            status,
            close,
        });

        // Wait for modal to close to prevent click while closing it
        setTimeout(() => (this.isRequestInProgress = false), 400);
    }

    private showCloseBusinessModal(): void {
        // close current modal
        this.setModalSpinner(ActionTypesEnum.DELETE, false, true);

        const data = {
            data: this.editData,
        };
        const mappedEvent = {
            ...data,
            type: TableStringEnum.CLOSE,
        };
        this.modalService.openModal(
            ConfirmationActivationModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...mappedEvent,
                template: TableStringEnum.INFO,
                subType: TableStringEnum.REPAIR_SHOP,
                subTypeStatus: TableStringEnum.BUSINESS,
                tableType: ConfirmationActivationStringEnum.REPAIR_SHOP_TEXT,
                modalTitle: this.getFromFieldValue(
                    RepairShopModalStringEnum.NAME
                ),
                modalSecondTitle:
                    this.selectedAddress.address ??
                    TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            }
        );
    }

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
        this.cdr.detectChanges();
    }

    public handleModalTableValidStatusEmit(validStatus: boolean): void {
        this.isContactFormValid = validStatus;
    }

    public changeReviewsEvent(reviews: ReviewComment): void {
        switch (reviews.action) {
            case 'delete':
                this.deleteReview(reviews);
                break;

            case 'add':
                this.addReview(reviews);
                break;

            case 'update':
                this.updateReview(reviews);
                break;

            default:
                break;
        }
    }

    public createReview(): void {
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
                /*    avatar: this.companyUser.avatar, */
            },
            commentContent: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isNewReview: true,
        });
    }

    private addReview(reviews: ReviewComment): void {
        // 2 represent repair shop entity
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

    private deleteReview(reviews: ReviewComment): void {
        this.reviews = reviews.sortData;
        this.disableOneMoreReview = false;
        this.reviewRatingService
            .deleteReview(reviews.data)
            .pipe(takeUntil(this.destroy$))
            .subscribe();
    }

    private updateReview(reviews: ReviewComment): void {
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
