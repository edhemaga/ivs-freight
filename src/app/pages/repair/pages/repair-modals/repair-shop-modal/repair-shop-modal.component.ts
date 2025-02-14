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
    FormArray,
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
    CreateShopModel,
    RepairShopContactExtended,
} from '@pages/repair/pages/repair-modals/repair-shop-modal/models';

// Services
import { ModalService } from '@shared/services/modal.service';
import { BankVerificationService } from '@shared/services/bank-verification.service';
import { FormService } from '@shared/services/form.service';
import { RepairService } from '@shared/services/repair.service';
import { TaLikeDislikeService } from '@shared/components/ta-like-dislike/services/ta-like-dislike.service';
import { ReviewsRatingService } from '@shared/services/reviews-rating.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { ConfirmationActivationService } from '@shared/components/ta-shared-modals/confirmation-activation-modal/services/confirmation-activation.service';

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
import { RepairShopHelper } from '@pages/repair/pages/repair-modals/repair-shop-modal/utils/helpers';
import { RepairShopConfig, RepairShopModalUploadFilesConfig } from '@pages/repair/pages/repair-modals/repair-shop-modal/utils/config';

// Animation
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// Components
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaModalTableComponent } from '@shared/components/ta-modal-table/ta-modal-table.component';
import { TaCheckboxComponent } from '@shared/components/ta-checkbox/ta-checkbox.component';
import {
    CaInputComponent,
    CaInputDropdownComponent,
    CaInputNoteComponent,
    CaModalButtonComponent,
    CaModalComponent,
    CaUploadFilesComponent,
    CaInputAddressDropdownComponent,
    CaInputDatetimePickerComponent,
} from 'ca-components';
import { TaUserReviewComponent } from '@shared/components/ta-user-review/ta-user-review.component';
import { ConfirmationActivationModalComponent } from '@shared/components/ta-shared-modals/confirmation-activation-modal/confirmation-activation-modal.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { ConfirmationModalComponent } from '@shared/components/ta-shared-modals/confirmation-modal/confirmation-modal.component';

// Modules
import { AngularSvgIconModule } from 'angular-svg-icon';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

// Enums
import { ModalTableTypeEnum } from '@shared/enums/modal-table-type.enum';
import {
    ModalButtonSize,
    ModalButtonType,
    TableStringEnum,
} from '@shared/enums';
import { ConfirmationActivationStringEnum } from '@shared/components/ta-shared-modals/confirmation-activation-modal/enums/confirmation-activation-string.enum';
import {
    ActionTypesEnum,
    OpenWorkingHours,
    RepairShopModalStringEnum,
    RepairShopModalEnum,
} from '@pages/repair/pages/repair-modals/repair-shop-modal/enums';

// Constants
import { RepairShopConstants } from '@pages/repair/pages/repair-modals/repair-shop-modal/utils/constants';

// SVG Routes
import { RepairShopModalSvgRoutes } from '@pages/repair/pages/repair-modals/repair-shop-modal/utils/svg-routes';
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Types
import { OpenedTab } from '@pages/repair/pages/repair-modals/repair-shop-modal/types';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// Pipes
import { FormatDatePipe } from '@shared/pipes';
import { AddressService } from '@shared/services/address.service';

// mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';

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
        NgbTooltipModule,

        // Component
        TaAppTooltipV2Component,
        CaModalComponent,
        CaModalButtonComponent,
        TaTabSwitchComponent,
        CaInputComponent,
        TaCustomCardComponent,
        CaInputDropdownComponent,
        CaInputAddressDropdownComponent,
        CaInputNoteComponent,
        CaInputDatetimePickerComponent,
        TaCheckboxComponent,
        CaUploadFilesComponent,
        TaModalTableComponent,
        TaUserReviewComponent,
        TaCheckboxCardComponent,
        TaAppTooltipV2Component,

        // Pipes
        FormatDatePipe,
    ],
})
export class RepairShopModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnInit, OnDestroy
{
    // Enums
    public repairShopModalSvgRoutes = RepairShopModalSvgRoutes;
    public RepairShopModalStringEnum = RepairShopModalStringEnum;
    public TableStringEnum = TableStringEnum;
    public RepairShopModalEnum = RepairShopModalEnum;
    public modalTableTypeEnum = ModalTableTypeEnum;

    // Inputs
    @Input() editData: RepeairShopModalInput;

    public companyUser: SignInResponse;

    public isRequestInProgress: boolean;
    public showPhoneExt: boolean = false;

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
    public destroy$ = new Subject<void>();

    // Services and Types
    public services: RepairShopModalService[] = [];
    public repairTypes: DisplayServiceTab[] = [];

    // Bank Tab
    public banks: BankResponse[];
    public selectedBank: BankResponse = null;
    public isBankSelected: boolean;

    // Contact Tab
    public repairShopContacts: RepairShopContactResponse[] = [];
    public updatedRepairShopContacts: RepairShopContactResponse[] = [];

    public isNewContactAdded: boolean = false;
    public isEachContactRowValid: boolean = true;

    private departments: DepartmentResponse[];

    // Reviews
    public reviews: any[] = [];
    public isOneMoreReviewDisabled: boolean;

    // documents
    public files: UploadFile[] | FileResponse[] = [];
    public coverPhoto: any;
    public filesForDelete: any[] = [];

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
    public businessStatus: number;
    private repairShop: RepairShopResponse;
    public isCompanyRelated: boolean = false;
    public isFormDirty: boolean = false;

    public actionTypesEnum = ActionTypesEnum;

    public svgRoutes = SharedSvgRoutes;
    public activeAction: string;

    public modalButtonType = ModalButtonType;
    public modalButtonSize = ModalButtonSize;

    public uploadDocumentFilesConfig = RepairShopModalUploadFilesConfig.REPAIR_SHOP_MODAL_DOCUMENT_UPLOAD_FILES_CONFIG;
    public uploadCoverPhotoFilesConfig = RepairShopModalUploadFilesConfig.REPAIR_SHOP_MODAL_COVER_PHOTO_UPLOAD_FILES_CONFIG;

    constructor(
        private formBuilder: UntypedFormBuilder,

        // change detection
        private cdr: ChangeDetectorRef,

        // services
        private shopService: RepairService,
        private bankVerificationService: BankVerificationService,
        private modalService: ModalService,
        private taLikeDislikeService: TaLikeDislikeService,
        private formService: FormService,
        private reviewRatingService: ReviewsRatingService,
        private confirmationService: ConfirmationService,
        private ngbActiveModal: NgbActiveModal,
        private confirmationActivationService: ConfirmationActivationService,
        private inputService: TaInputService,
        public addressService: AddressService
    ) {
        super();
    }

    public get isModalValidToSubmit(): boolean {
        return (
            this.repairShopForm.valid &&
            this.isFormDirty &&
            this.isEachContactRowValid
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
        this.confirmationActivationSubscribe();
        this.confirmationData();
        this.companyUser = JSON.parse(localStorage.getItem('user'));
        this.uploadCoverPhotoFilesConfig = {
            ...RepairShopModalUploadFilesConfig.REPAIR_SHOP_MODAL_DOCUMENT_UPLOAD_FILES_CONFIG,
            files: [{ url: this.coverPhoto?.url}],
        };
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationActivationService.getConfirmationActivationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe(() => {
                this.ngbActiveModal?.close();
            });
    }

    private confirmationData(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res.action !== TableStringEnum.CLOSE)
                    this.ngbActiveModal?.close();
            });
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
            [RepairShopModalStringEnum.CONTACTS]: [this.formBuilder.array([])],
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
            [RepairShopModalStringEnum.COVER]: [null],
            [RepairShopModalStringEnum.SERVICE_HELPER]: null,
        });
        this.tabTitle = this.editData?.data?.name;

        this.inputService.customInputValidator(
            this.repairShopForm.get(RepairShopModalStringEnum.EMAIL),
            RepairShopModalStringEnum.EMAIL,
            this.destroy$
        );

        this.isCompanyRelated = this.editData?.companyOwned;
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
                    this.businessStatus = repairShop?.status;
                    this.repairShop = repairShop;

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
                            [RepairShopModalStringEnum.CONTACTS]: [
                                this.mapContacts(repairShop.contacts, true),
                            ],
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
                            [RepairShopModalStringEnum.COVER]: repairShop.cover,
                        });

                        this.mapEditData(repairShop);
                        this.isCompanyRelated =
                            this.editData?.companyOwned ||
                            repairShop.isCompanyRelated;
                    }

                    this.initWorkingHours(repairShop);

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
        this.coverPhoto = res.cover;

        this.repairShopForm
            .get(RepairShopModalStringEnum.SERVICE_HELPER)
            .patchValue(JSON.stringify(this.services));

        this.updatedRepairShopContacts = res.contacts;

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
        this.onAddressChangeInit({
            address: res.address,
            valid: true,
            longLat: {
                latitude: res.latitude,
                longitude: res.longitude,
            },
        });

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

    public onAddressChangeInit(event: {
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
        this.repairShopForm.markAsDirty();
    }

    private initWorkingHours(repairShop: RepairShopResponse): void {
        if (this.editData?.id) {
            this.workingDaysLabel.forEach((day) => {
                const matchingOpenHours = repairShop.openHoursModal.filter(
                    (openDay) => openDay.dayOfWeek === day.dayOfWeek
                );

                // Create the open hour entry
                const openHourEntry = RepairShopHelper.createOpenHour(
                    {
                        ...day,
                        shifts: matchingOpenHours.length
                            ? matchingOpenHours.map((openDay) => ({
                                  startTime: openDay.startTime,
                                  endTime: openDay.endTime,
                              }))
                            : [
                                  {
                                      startTime: RepairShopConstants.startTime,
                                      endTime: RepairShopConstants.endTime,
                                  },
                              ],
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
        setTimeout(() => this.startFormChanges(), 500);
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

        const shiftsArray = newWorkingDay.get(
            RepairShopModalStringEnum.SHIFTS
        ) as FormArray;

        const newShift = { startTime, endTime };
        if (!dayActiveField.value) {
            shiftsArray.patchValue([this.formBuilder.group(newShift)]);
        } else {
            shiftsArray.clear();
            shiftsArray.push(this.formBuilder.group(newShift));
        }
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
            const shiftsArray = item.get(
                RepairShopModalStringEnum.SHIFTS
            ) as FormArray;

            const newShift = { startTime, endTime };

            shiftsArray.clear();
            shiftsArray.push(this.formBuilder.group(newShift));
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
                    [RepairShopModalStringEnum.SHIFTS]: monday.get(
                        RepairShopModalStringEnum.SHIFTS
                    ).value,
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
        this.repairShopForm
            .get(RepairShopModalStringEnum.SERVICE_HELPER)
            .patchValue(JSON.stringify(this.services));
    }

    private startFormChanges(): void {
        this.formService.checkFormChange(this.repairShopForm);

        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe(
                (isFormChange: boolean) => (this.isFormDirty = isFormChange)
            );
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

    public onUploadCoverPhoto(event): void {
        this.coverPhoto = [
            event.files.length ? event.files[0].realFile : { url: '' },
        ];
        this.repairShopForm
            .get(RepairShopModalStringEnum.COVER)
            .patchValue(event);
    }

    public onFilesEvent(event): void {
        this.files = event;
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

    public onModalAction(data: string): void {
        this.activeAction = data;

        if (data === ActionTypesEnum.CLOSE) {
            this.ngbActiveModal.close();
        }

        if (data === ActionTypesEnum.DELETE) {
            this.showDeleteBusinessModal();
        }

        if (data === ActionTypesEnum.CLOSE_BUSINESS) {
            this.showCloseBusinessModal();
        }

        // Prevent double click
        if (!this.isModalValidToSubmit || this.isRequestInProgress) {
            return;
        }

        this.isRequestInProgress = true;
        if (data === ActionTypesEnum.SAVE_AND_ADD_NEW) {
            this.addNewRepairShop(true);
            return;
        }

        if (data === ActionTypesEnum.SAVE) {
            if (this.isEditMode) {
                this.updateRepairShop(this.editData.id);
            } else {
                this.addNewRepairShop(false);
            }

            return;
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
            contacts: this.mapContacts(this.repairShopContacts),
            shopServiceType: this.getFromFieldValue(
                RepairShopModalStringEnum.SHOP_SERVICE_TYPE
            ),
            openHours: this.formatOpenHours(),
            weeklyDay: !this.getFromFieldValue(
                RepairShopModalStringEnum.COMPANY_OWNED
            )
                ? this.selectedWeeklyDay
                    ? this.selectedWeeklyDay.id
                    : null
                : null,
            payPeriod: !this.getFromFieldValue(
                RepairShopModalStringEnum.COMPANY_OWNED
            )
                ? this.selectedPayPeriod
                    ? this.selectedPayPeriod.id
                    : null
                : null,
            monthlyDay: !this.getFromFieldValue(
                RepairShopModalStringEnum.COMPANY_OWNED
            )
                ? this.selectedMonthlyDays
                    ? this.selectedMonthlyDays.id
                    : null
                : null,
            companyOwned: this.isCompanyRelated
                ? this.getFromFieldValue(
                      RepairShopModalStringEnum.COMPANY_OWNED
                  )
                : null,
            isCompanyRelated: this.isCompanyRelated,
            rent: !this.getFromFieldValue(
                RepairShopModalStringEnum.COMPANY_OWNED
            )
                ? MethodsCalculationsHelper.convertThousandSepInNumber(
                      this.getFromFieldValue(RepairShopModalStringEnum.RENT)
                  )
                : null,
            cover: this.convertCoverDocumentForRequest(),
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
                        isWorking: openHour.isWorkingDay,
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

    private convertCoverDocumentForRequest(): any {
        return this.coverPhoto;
    }

    private mapContacts(
        contacts: RepairShopContactExtended[],
        isFormPatch: boolean = false
    ): RepairShopContactExtended[] {
        return contacts.map((contact, index) => {
            const { department, phone, email, fullName, phoneExt } = contact;

            return isFormPatch
                ? {
                      fullName,
                      department: (department as DepartmentResponse).name,
                      phone,
                      phoneExt:
                          phoneExt ?? RepairShopModalStringEnum.EMPTY_STRING,
                      email,
                  }
                : {
                      id: this.updatedRepairShopContacts[index]?.id,
                      fullName,
                      departmentId: this.departments.find(
                          (item) => item.name === department
                      )?.id,
                      phone,
                      phoneExt: phoneExt,
                      email,
                  };
        });
    }

    public addNewRepairShop(addNewShop: boolean): void {
        this.shopService
            .addRepairShop(this.generateShopRequest())
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.setModalSpinner(true, addNewShop);
                },
                error: () => {
                    this.setModalSpinner(false, false);
                },
            });
    }

    private updateRepairShop(id: number): void {
        this.shopService
            .updateRepairShop({ id, ...this.generateShopRequest() })
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.setModalSpinner(true, false);
                },
                error: () => {
                    this.setModalSpinner(false, false);
                },
            });
    }

    private setModalSpinner(close: boolean, addNew?: boolean): void {
        if (close) this.ngbActiveModal.close();

        if (addNew) this.modalService.openModal(RepairShopModalComponent, {});

        // Wait for modal to close to prevent click while closing it
        setTimeout(() => (this.isRequestInProgress = false), 400);

        this.activeAction = null;
    }

    private showDeleteBusinessModal(): void {
        // close current modal
        const mappedEvent = {
            ...this.repairShop,
            data: this.repairShop,
            type: this.repairShop.status
                ? TableStringEnum.CLOSE
                : TableStringEnum.OPEN,
            modalTitle: this.repairShop.name,
            modalSecondTitle: this.repairShop.address?.address
                ? this.repairShop.address.address
                : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
        };

        this.modalService.openModal(
            ConfirmationModalComponent,
            { size: TableStringEnum.SMALL },
            {
                ...mappedEvent,
                template: TableStringEnum.REPAIR_SHOP_3,
                type: TableStringEnum.DELETE,
            }
        );
    }

    private showCloseBusinessModal(): void {
        // close current modal
        const mappedEvent = {
            ...this.repairShop,
            data: this.repairShop,
            type: this.repairShop.status
                ? TableStringEnum.CLOSE
                : TableStringEnum.OPEN,
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
                modalTitle: this.repairShop.name,
                modalSecondTitle: this.repairShop.address?.address
                    ? this.repairShop.address.address
                    : TableStringEnum.EMPTY_STRING_PLACEHOLDER,
            }
        );
    }

    // Contact tab
    public addContact(): void {
        if (!this.isEachContactRowValid) return;
        this.repairShopForm.markAsDirty();
        this.isNewContactAdded = true;

        setTimeout(() => {
            this.isNewContactAdded = false;
        }, 400);
    }

    public handleModalTableValueEmit(
        modalTableDataValue: RepairShopContactCommand[]
    ): void {
        this.repairShopContacts = modalTableDataValue;

        this.repairShopForm
            .get(RepairShopModalStringEnum.CONTACTS)
            .patchValue(this.repairShopContacts);

        this.cdr.detectChanges();
    }

    public handleModalTableValidStatusEmit(
        isEachContactRowValid: boolean
    ): void {
        this.isEachContactRowValid = isEachContactRowValid;
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

                    this.isOneMoreReviewDisabled = true;
                },
            });
    }

    private deleteReview(reviews: ReviewComment): void {
        this.reviews = reviews.sortData;
        this.isOneMoreReviewDisabled = false;
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
