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
import { Subject, takeUntil } from 'rxjs';

// moment

// Models
import { AddressEntity } from 'appcoretruckassist/model/addressEntity';
import {
    BankResponse,
    CreateResponse,
    EnumValue,
    RatingReviewResponse,
    RepairShopModalResponse,
    RepairShopResponse,
} from 'appcoretruckassist/model/models';
import {
    DisplayServiceTab,
    OpenedTab,
    RepairShopModalAction,
    RepairShopModalService,
    RepairShopTabs,
    RepeairShopModalInput,
} from './models/edit-data.model';
import { ReviewComment } from '@shared/models/review-comment.model';

// Services
import { ModalService } from '@shared/services/modal.service';
import { BankVerificationService } from '@shared/services/bank-verification.service';
import { FormService } from '@shared/services/form.service';
import { RepairService } from '@shared/services/repair.service';

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
    RepairShopModalStringEnum = RepairShopModalStringEnum;
    @Input() editData: null | RepeairShopModalInput;
    public tabs: RepairShopTabs[];
    TableStringEnum = TableStringEnum;
    selectedTab: OpenedTab = TableStringEnum.DETAILS;
    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };

    public animationTabClass = 'animation-three-tabs';
    private destroy$ = new Subject<void>();
    public RepairShopModalEnum = RepairShopModalEnum;
    public repairShopForm: UntypedFormGroup;
    banks: BankResponse[];
    public longitude: number;
    public latitude: number;
    services: RepairShopModalService[] = [];
    public repairTypes: DisplayServiceTab[] = [];
    // Contact tab
    public modalTableTypeEnum = ModalTableTypeEnum;
    public contactAddedCounter: number = 0;
    isNewContactAdded: boolean;
    isDaysVisible: boolean;
    public isPhoneExtExist: boolean = false;
    reviews: RatingReviewResponse[] = [];
    repairShopName: string;
    constructor(
        private formBuilder: UntypedFormBuilder,
        private shopService: RepairService,
        private bankVerificationService: BankVerificationService,
        private cdr: ChangeDetectorRef,
        private modalService: ModalService
    ) {}

    ngOnInit() {
        this.generateForm();
        this.initializeServices();
        this.initTabs();
        this.initWorkingHours();
        this.repairShopForm.valueChanges.subscribe((v) => console.log(v));
        if (this.isEditMode) {
            this.editRepairShopById(this.editData?.id);
        }
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
            [RepairShopModalStringEnum.SELECTED_ADDRESS]: [
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
            [RepairShopModalStringEnum.CONTACTS]: [null],
            [RepairShopModalStringEnum.FILES]: [null],
            [RepairShopModalStringEnum.SERVICES_HELPER]: [null],
            [RepairShopModalStringEnum.SHOP_SERVICE_TYPE]: [
                null,
                Validators.required,
            ],
            [RepairShopModalStringEnum.LONGITUDE]: [null],
            [RepairShopModalStringEnum.LATITUDE]: [null],
        });

        this.repairShopName = this.editData?.data?.name;
    }

    private initializeServices() {
        return this.shopService
            .getRepairShopModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RepairShopModalResponse) => {
                    this.services = mapServices(res, true);
                    this.repairTypes = res.shopServiceTypes;
                    if (!this.isEditMode) this.repairTypes[0].checked = true;
                    this.banks = res.banks;
                },
            });
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

    private editRepairShopById(id: number) {
        this.shopService
            .getRepairShopById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: RepairShopResponse) => {
                    this.repairShopForm.patchValue({
                        [RepairShopModalStringEnum.NAME]: res.name,
                        [RepairShopModalStringEnum.PINNED]: res.pinned,
                        [RepairShopModalStringEnum.PHONE]: res.phone,
                        [RepairShopModalStringEnum.PHONE_EXT]: res.phoneExt,
                        [RepairShopModalStringEnum.EMAIL]: res.email,
                        [RepairShopModalStringEnum.ADDRESS_UNIT]:
                            res.address.addressUnit,
                        // [RepairShopModalStringEnum.OPEN_HOURS]: this.formBuilder.array([]),
                        [RepairShopModalStringEnum.OPEN_HOURS_SAME_ALL_DAYS]:
                            res.openHoursSameAllDays,
                        [RepairShopModalStringEnum.START_TIME_ALL_DAYS]:
                            res.startTimeAllDays,
                        [RepairShopModalStringEnum.END_TIME_ALL_DAYS]:
                            res.endTimeAllDays,
                        [RepairShopModalStringEnum.OPEN_ALWAYS]: res.openAlways,
                        [RepairShopModalStringEnum.BANK_ID]: res.bank?.id,
                        [RepairShopModalStringEnum.ROUTING]: res.routing,
                        [RepairShopModalStringEnum.ACCOUNT]: res.account,
                        [RepairShopModalStringEnum.NOTE]: res.note,
                        [RepairShopModalStringEnum.CONTACTS]: res.contacts,
                        [RepairShopModalStringEnum.FILES]: res.files,
                        [RepairShopModalStringEnum.LONGITUDE]: res.longitude,
                        [RepairShopModalStringEnum.LATITUDE]: res.latitude,
                    });
                    this.isPhoneExtExist = !!res.phoneExt;
                    this.reviews = res.ratingReviews;
                    this.services = mapServices(res, false);
                    this.onHandleAddress({
                        address: res.address,
                        valid: true,
                        longLat: {
                            latitude: res.latitude,
                            longitude: res.longitude,
                        },
                    });
                    this.repairTypes.forEach(
                        (repairType) =>
                            (repairType.checked =
                                repairType.id === res.shopServiceType.id)
                    );
                },
            });
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
        longLat: any;
    }) {
        if (event.valid) {
            this.repairShopForm
                .get(RepairShopModalStringEnum.SELECTED_ADDRESS)
                .patchValue(event.address.address);
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
                    const newBank = {
                        id: res.id,
                        name: bank.data.name,
                    };
                    this.onBankChange({ id: newBank.id });
                    this.banks = [...this.banks, newBank];
                },
                error: () => {},
            });
    }

    public onBankChange(event: BankResponse | null) {
        // TODO: Not working when bank is selected it pass name value as id
        console.log(event);
        this.bankForm.patchValue(event?.id ?? null);
    }

    get isBankSelected() {
        return !!this.bankForm.value;
    }

    get bankForm() {
        return this.repairShopForm.get(RepairShopModalStringEnum.BANK_ID);
    }

    // Documents
    public documents: any[] = [];
    public onFilesEvent(event: any) {
        this.repairShopForm
            .get(RepairShopModalStringEnum.FILES)
            .patchValue(event.files);
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

    // TODO:
    public addNewRepairShop() {
        console.log('Trying to add addRepairShop');
        const newShop = {
            ...this.repairShopForm.value,
            serviceTypes: this.services.map((item) => {
                return {
                    serviceType: item.serviceType,
                    active: item.active,
                };
            }),
            openHoursSameAllDays: !this.isDaysVisible,
            startTimeAllDays: !this.isDaysVisible,
            endTimeAllDays: !this.isDaysVisible
                ? this.openHours.value.at(0).endTime
                : null,
        };
        console.log(newShop);
        // this.shopService
        //     .addRepairShop(generateShopModel(newShop))
        //     .pipe(takeUntil(this.destroy$))
        //     .subscribe({
        //         next: () => {
        //             // TODO:?
        //             console.log("Save new shop");
        //         },
        //         error: () => {
        //             this.setModalSpinner(null, false, false);
        //         },
        //     });
    }

    public onModalAction(data: RepairShopModalAction) {
        // console.log(data.action);
        // TODO:
        if (data.action === ActionTypesEnum.SAVE_AND_ADD_NEW) {
            if (!this.isModalValidToSubmit) {
                // this.inputService.markInvalid(this.repairShopForm);
                return;
            }
            this.addNewRepairShop();
            this.setModalSpinner(data.action, true, false);
            return;
        }

        if (data.action === ActionTypesEnum.SAVE) {
            // Call update shop here
        }
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
    }

    get isModalValidToSubmit() {
        return this.repairShopForm.valid && this.repairShopForm.dirty;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
