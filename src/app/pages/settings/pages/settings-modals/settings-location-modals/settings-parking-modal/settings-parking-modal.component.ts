import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { debounceTime, Subject, takeUntil } from 'rxjs';

// icon
import { AngularSvgIconModule } from 'angular-svg-icon';

// models
import {
    AddressEntity,
    CompanyOfficeModalResponse,
    CreateParkingCommand,
    ParkingResponse,
    UpdateParkingCommand,
} from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// animations
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// services
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';
import { ModalService } from '@shared/services/modal.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { rentValidation } from '@shared/components/ta-input/validators/ta-input.regex-validations';
import { FormService } from '@shared/services/form.service';
import { DispatcherService } from '@pages/dispatch/services/dispatcher.service';
import { DropDownService } from '@shared/services/drop-down.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { AddressService } from '@shared/services/address.service';

// components
import {
    CaInputComponent,
    CaInputDropdownComponent,
    CaModalComponent,
    CaModalButtonComponent,
    CaInputAddressDropdownComponent,
} from 'ca-components';
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaCustomCardComponent } from '@shared/components/ta-custom-card/ta-custom-card.component';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// pipes
import { SumArraysPipe } from '@shared/pipes/sum-arrays.pipe';
import { FormatDatePipe } from '@shared/pipes';
import { SettingsParkingConfigPipe } from '@pages/settings/pipes';

// Enums
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import {
    ModalButtonType,
    TableStringEnum,
    DropActionsStringEnum,
    EGeneralActions,
} from '@shared/enums';
import { ESettingsFormEnum } from '@pages/settings/pages/settings-modals/enums';

// validators
import {
    addressValidation,
    addressUnitValidation,
    phoneFaxRegex,
    phoneExtension,
    parkingNameValidation,
    parkingSlotValidation,
    fullParkingSlotValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// utils
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Config
import { SettingsParkingConfig } from '@pages/settings/pages/settings-modals/settings-location-modals/settings-parking-modal/config';

// Svg routes
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Helpers
import { DropActionNameHelper } from '@shared/utils/helpers';

// mixin
import { AddressMixin } from '@shared/mixins/address/address.mixin';
@Component({
    selector: 'app-settings-parking-modal',
    templateUrl: './settings-parking-modal.component.html',
    styleUrls: ['./settings-parking-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    providers: [ModalService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        NgbTooltipModule,

        // Component
        CaInputComponent,
        CaInputDropdownComponent,
        CaModalComponent,
        TaTabSwitchComponent,
        TaCheckboxCardComponent,
        CaInputAddressDropdownComponent,
        TaCustomCardComponent,
        TaAppTooltipV2Component,
        CaModalButtonComponent,

        // Pipe
        SumArraysPipe,

        // Pipes
        FormatDatePipe,
        SettingsParkingConfigPipe,
    ],
})
export class SettingsParkingModalComponent
    extends AddressMixin(
        class {
            addressService!: AddressService;
        }
    )
    implements OnInit, OnDestroy
{
    @Input() editData: any;

    public parkingForm: UntypedFormGroup;

    public gateBtns = [
        {
            id: 511,
            name: 'Yes',
            checked: false,
        },
        {
            id: 522,
            name: 'No',
            checked: true,
        },
    ];

    public cameraBtns = [
        {
            id: 363,
            name: 'Yes',
            checked: false,
        },
        {
            id: 367,
            name: 'No',
            checked: true,
        },
    ];

    public parkingSlots: any[] = [
        {
            id: 1,
            value: 0,
        },
        {
            id: 2,
            value: 0,
        },
    ];

    public weeklyDays: any[] = [];
    public monthlyDays: any[] = [];
    public selectedDay: any = null;

    public selectedAddress: AddressEntity = null;

    public payPeriods: any[] = [];
    public selectedPayPeriod: any = null;

    public isPhoneExtExist: boolean = false;

    public isFormDirty: boolean;

    public parkingName: string = null;

    public isFinanceCardOpen: boolean = true;
    public isParkingCardOpen: boolean = true;

    public isCardAnimationDisabled: boolean = false;

    public destroy$ = new Subject<void>();

    public formConfig = SettingsParkingConfig;

    public phoneConfig: ITaInput = SettingsParkingConfig.getPhoneInputConfig();
    public phoneExtConfig: ITaInput =
        SettingsParkingConfig.getPhoneExtInputConfig();
    public emailConfig: ITaInput = SettingsParkingConfig.getEmailInputConfig();
    public addressConfig: ITaInput =
        SettingsParkingConfig.getAddressInputConfig();
    public addressUnitConfig: ITaInput =
        SettingsParkingConfig.getAddressUnitInputConfig();
    public payPeriodConfig: ITaInput =
        SettingsParkingConfig.getPayPeriodInputConfig();
    public rentConfig: ITaInput = SettingsParkingConfig.getRentConfig();
    public parkingSlotConfig: ITaInput =
        SettingsParkingConfig.getParkingSlotConfig();
    public fullParkingSlotConfig: ITaInput =
        SettingsParkingConfig.getFullParkingSlotConfig();

    public taModalActionEnum = TaModalActionEnum;
    public svgRoutes = SharedSvgRoutes;
    public modalButtonType = ModalButtonType;
    public activeAction!: string;
    public data: ParkingResponse;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private settingsLocationService: SettingsLocationService,
        private formService: FormService,
        private dispatcherService: DispatcherService,

        private ngbActiveModal: NgbActiveModal,
        public dropDownService: DropDownService,
        private confirmationService: ConfirmationService,
        public addressService: AddressService
    ) {
        super();
    }

    ngOnInit() {
        this.createForm();
        this.parkingSlot();
        this.fullParkingSlot();
        this.getModalDropdowns();
        this.confirmationActivationSubscribe();
    }

    private confirmationActivationSubscribe(): void {
        this.confirmationService.confirmationData$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                if (res.action !== TableStringEnum.CLOSE)
                    this.ngbActiveModal?.close();
            });
    }

    private createForm() {
        this.parkingForm = this.formBuilder.group({
            isOwner: [false],
            name: [null, [Validators.required, ...parkingNameValidation]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            phone: [null, phoneFaxRegex],
            extensionPhone: [null, [...phoneExtension]],
            email: [null],
            parkingSlot: [null, parkingSlotValidation],
            fullParkingSlot: [null, fullParkingSlotValidation],
            gate: [true],
            securityCamera: [true],
            rent: [null, rentValidation],
            payPeriod: [null],
            monthlyDay: [null],
            weeklyDay: [null],
        });

        this.inputService.customInputValidator(
            this.parkingForm.get('email'),
            'email',
            this.destroy$
        );
    }

    public tabChange(event: any, action?: string): void {
        switch (action) {
            case ESettingsFormEnum.GATE:
                this.gateBtns = this.gateBtns.map((item) => {
                    event.name === 'No'
                        ? this.parkingForm
                              .get(ESettingsFormEnum.GATE)
                              .patchValue(false)
                        : this.parkingForm
                              .get(ESettingsFormEnum.GATE)
                              .patchValue(true);

                    return {
                        ...item,
                        checked: item.id === event.id,
                    };
                });
                break;

            case 'camera':
                this.cameraBtns = this.cameraBtns.map((item) => {
                    event.name === 'No'
                        ? this.parkingForm
                              .get(ESettingsFormEnum.SECURITY_CAMERA)
                              .patchValue(false)
                        : this.parkingForm
                              .get(ESettingsFormEnum.SECURITY_CAMERA)
                              .patchValue(true);
                    return {
                        ...item,
                        checked: item.id === event.id,
                    };
                });
                break;
            default:
                break;
        }
    }

    public onModalAction(action: string): void {
        this.activeAction = action;

        switch (action) {
            case TaModalActionEnum.CLOSE:
                this.ngbActiveModal.close();
                break;
            case TaModalActionEnum.SAVE:
                if (this.parkingForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.parkingForm);
                    return;
                }
                if (this.editData?.type === EGeneralActions.EDIT)
                    this.updateParking(this.editData.id);
                else this.addParking();
                break;
            case TaModalActionEnum.SAVE_AND_ADD_NEW:
                if (this.parkingForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.parkingForm);
                    return;
                }
                this.addParking(true);
                break;
            case TaModalActionEnum.DELETE:
                this.deleteParkingById(this.editData.id);
                break;
            default:
                break;
        }
    }

    public onHandleAddress(event: {
        address: AddressEntity | any;
        valid: boolean;
    }): void {
        if (event.valid) this.selectedAddress = event.address;
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'pay-period':
                this.selectedPayPeriod = event;
                this.parkingForm.get('monthlyDay').patchValue(null);
                this.parkingForm.get('weeklyDay').patchValue(null);
                this.selectedDay = null;
                break;
            case 'day':
                this.selectedDay = event;
                break;
            default:
                break;
        }
    }

    private parkingSlot() {
        this.parkingForm
            .get('parkingSlot')
            .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
            .subscribe((value) => {
                this.parkingSlots = [...this.parkingSlots];
                this.parkingSlots[0].value =
                    MethodsCalculationsHelper.calculateParkingSlot(
                        value,
                        this.parkingForm.get('parkingSlot')
                    );
            });
    }

    private fullParkingSlot() {
        this.parkingForm
            .get('fullParkingSlot')
            .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
            .subscribe((value) => {
                this.parkingSlots = [...this.parkingSlots];
                this.parkingSlots[1].value =
                    MethodsCalculationsHelper.calculateParkingSlot(
                        value,
                        this.parkingForm.get('fullParkingSlot')
                    );
            });
    }

    private updateParking(id: number) {
        const { addressUnit, rent, ...form } = this.parkingForm.value;

        if (this.selectedAddress) {
            this.selectedAddress = {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            };
        }

        const newData: UpdateParkingCommand = {
            id: id,
            ...form,
            address: this.selectedAddress?.address
                ? this.selectedAddress
                : null,
            rent: rent
                ? MethodsCalculationsHelper.convertThousandSepInNumber(rent)
                : null,
            payPeriod: this.selectedPayPeriod
                ? this.selectedPayPeriod.id
                : null,
            monthlyDay:
                this.selectedPayPeriod?.name === 'Monthly'
                    ? this.selectedDay
                        ? this.selectedDay.id
                        : null
                    : null,
            weeklyDay:
                this.selectedPayPeriod?.name === 'Weekly'
                    ? this.selectedDay
                        ? this.selectedDay.id
                        : null
                    : null,
            parkingCount: this.parkingSlots.length
                ? this.parkingSlots[0].value
                    ? this.parkingSlots[0].value
                    : 0 + this.parkingSlots[1].value
                      ? this.parkingSlots[1].value
                      : 0
                : 0,
            parkingSlotCount: this.parkingSlots.length
                ? this.parkingSlots[0].value
                : 0,
            fullParkingSlotCount: this.parkingSlots.length
                ? this.parkingSlots[1].value
                : 0,
        };

        this.settingsLocationService
            .updateCompanyParking(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => this.ngbActiveModal.close(),
                error: () => (this.activeAction = null),
            });
    }

    private getUpdatedAddress(
        address: AddressEntity,
        addressUnit: string
    ): AddressEntity {
        return {
            ...address,
            addressUnit: addressUnit,
        };
    }

    private addParking(addNew?: boolean) {
        const { addressUnit, rent, ...form } = this.parkingForm.value;

        const updatedAddress = this.selectedAddress
            ? this.getUpdatedAddress(this.selectedAddress, addressUnit)
            : null;

        const newData: CreateParkingCommand = {
            ...form,
            address: updatedAddress?.address ? updatedAddress : null,
            rent: rent
                ? MethodsCalculationsHelper.convertThousandSepInNumber(rent)
                : null,
            payPeriod: this.selectedPayPeriod
                ? this.selectedPayPeriod.id
                : null,
            monthlyDay:
                this.selectedPayPeriod?.name === 'Monthly'
                    ? this.selectedDay
                        ? this.selectedDay.id
                        : null
                    : null,
            weeklyDay:
                this.selectedPayPeriod?.name === 'Weekly'
                    ? this.selectedDay
                        ? this.selectedDay.id
                        : null
                    : null,
            parkingCount: this.parkingSlots.length
                ? this.parkingSlots[0].value
                    ? this.parkingSlots[0].value
                    : 0 + this.parkingSlots[1].value
                      ? this.parkingSlots[1].value
                      : 0
                : 0,
            parkingSlotCount: this.parkingSlots.length
                ? this.parkingSlots[0].value
                : 0,
            fullParkingSlotCount: this.parkingSlots.length
                ? this.parkingSlots[1].value
                : 0,
        };

        this.settingsLocationService
            .addCompanyParking(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
                    if (addNew) {
                        this.modalService.openModal(
                            SettingsParkingModalComponent,
                            {
                                size: TableStringEnum.SMALL,
                            }
                        );
                    }
                    this.dispatcherService.updateModalList();
                },
                error: () => (this.activeAction = null),
            });
    }

    private deleteParkingById(id: number) {
        const eventData = {
            id: this.editData.id,
            type: DropActionsStringEnum.DELETE_ITEM,
        };
        const name = DropActionNameHelper.dropActionNameDriver(
            eventData,
            DropActionsStringEnum.PARKING
        );
        this.dropDownService.dropActionCompanyLocation(
            eventData,
            name,
            this.data
        );
    }

    private editCompanyParkingById(id: number) {
        this.settingsLocationService
            .getCompanyParkingById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: ParkingResponse) => {
                    this.parkingForm.patchValue({
                        isOwner: res.isOwner,
                        name: res.name,
                        address: res.address.address,
                        addressUnit: res.address.addressUnit,
                        phone: res.phone,
                        extensionPhone: res.extensionPhone,
                        email: res.email,
                        parkingSlot: res.parkingSlot,
                        fullParkingSlot: res.fullParkingSlot,
                        gate: res.gate,
                        securityCamera: res.securityCamera,
                        rent: res.rent
                            ? MethodsCalculationsHelper.convertNumberInThousandSep(
                                  res.rent
                              )
                            : null,
                        payPeriod: res.payPeriod ? res.payPeriod.name : null,
                        monthlyDay: res.payPeriod?.name
                            ? res.payPeriod.name === 'Monthly'
                                ? res.monthlyDay.name
                                : res.weeklyDay.name
                            : null,
                    });
                    this.parkingName = res.name;
                    this.selectedAddress = res.address;
                    this.selectedPayPeriod = res.payPeriod;

                    this.selectedDay = res.payPeriod
                        ? res.payPeriod.name === 'Monthly'
                            ? res.monthlyDay
                            : res.weeklyDay
                        : null;

                    this.parkingSlots[0] = { id: 1, value: res.parkingSlot };
                    this.parkingSlots[1] = {
                        id: 2,
                        value: res.fullParkingSlot,
                    };

                    if (res.gate) {
                        this.gateBtns[0].checked = true;
                        this.gateBtns[1].checked = false;
                    } else {
                        this.gateBtns[0].checked = false;
                        this.gateBtns[1].checked = true;
                    }

                    if (res.securityCamera) {
                        this.cameraBtns[0].checked = true;
                        this.cameraBtns[1].checked = false;
                    } else {
                        this.cameraBtns[0].checked = false;
                        this.cameraBtns[1].checked = true;
                    }

                    if (res.extensionPhone) {
                        this.isPhoneExtExist = true;
                    }

                    this.data = res;

                    setTimeout(() => {
                        this.startFormChanges();
                        this.isCardAnimationDisabled = false;
                    }, 1000);
                },
                error: () => (this.activeAction = null),
            });
    }

    private getModalDropdowns() {
        this.settingsLocationService
            .getModalDropdowns()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: CompanyOfficeModalResponse) => {
                    this.monthlyDays = res.payPeriodMonthly;
                    this.payPeriods = res.payPeriod;
                    this.weeklyDays = res.dayOfWeek;

                    if (this.editData?.type === EGeneralActions.EDIT) {
                        this.isCardAnimationDisabled = true;
                        this.editCompanyParkingById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => (this.activeAction = null),
            });
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.parkingForm);
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
