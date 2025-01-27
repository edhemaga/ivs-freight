import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

import { debounceTime, Subject, takeUntil } from 'rxjs';

// icon
import { AngularSvgIconModule } from 'angular-svg-icon';

// validators
import {
    addressUnitValidation,
    addressValidation,
    fullParkingSlotValidation,
    parkingSlotValidation,
    phoneExtension,
    terminalNameValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';
import {
    phoneFaxRegex,
    rentValidation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// models
import {
    AddressEntity,
    CompanyOfficeModalResponse,
    CreateTerminalCommand,
    TerminalResponse,
    UpdateTerminalCommand,
} from 'appcoretruckassist';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';

// animation
import { tabsModalAnimation } from '@shared/animations/tabs-modal.animation';

// services
import { SettingsLocationService } from '@pages/settings/pages/settings-location/services/settings-location.service';
import { ModalService } from '@shared/services/modal.service';
import { TaInputService } from '@shared/services/ta-input.service';
import { FormService } from '@shared/services/form.service';
import { ConfirmationService } from '@shared/components/ta-shared-modals/confirmation-modal/services/confirmation.service';
import { DropDownService } from '@shared/services/drop-down.service';

// components
import { TaTabSwitchComponent } from '@shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaCheckboxCardComponent } from '@shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { TaInputAddressDropdownComponent } from '@shared/components/ta-input-address-dropdown/ta-input-address-dropdown.component';
import {
    CaInputComponent,
    CaInputDropdownComponent,
    CaModalButtonComponent,
    CaModalComponent,
} from 'ca-components';
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';

// utils
import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

// Enums
import { TaModalActionEnum } from '@shared/components/ta-modal/enums';
import { SettingsFormEnum } from '@pages/settings/pages/settings-modals/enums';
import {
    DropActionsStringEnum,
    ModalButtonType,
    TableStringEnum,
} from '@shared/enums';

// Config
import { SettingsTerminalConfig } from './config';

// Svg routes
import { SettingsLocationSvgRoutes } from '@pages/settings/pages/settings-location/utils';
import { SharedSvgRoutes } from '@shared/utils/svg-routes';

// Pipes
import { FormatDatePipe } from '@shared/pipes';

// Helpers
import { DropActionNameHelper } from '@shared/utils/helpers';

@Component({
    selector: 'app-settings-terminal-modal',
    templateUrl: './settings-terminal-modal.component.html',
    styleUrls: ['./settings-terminal-modal.component.scss'],
    animations: [tabsModalAnimation('animationTabsModal')],
    providers: [ModalService, FormService],
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
        TaInputAddressDropdownComponent,
        TaAppTooltipV2Component,
        CaModalButtonComponent,
        // Pipes
        FormatDatePipe,
    ],
})
export class SettingsTerminalModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public terminalForm: UntypedFormGroup;

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
            id: 533,
            name: 'Yes',
            checked: false,
        },
        {
            id: 544,
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

    public selectedAddress: AddressEntity = null;

    public payPeriods: any[] = [];
    public selectedPayPeriod: any = null;

    public weeklyDays: any[] = [];
    public monthlyDays: any[] = [];
    public selectedDay: any = null;

    public isTerminalPhoneExtExist: boolean = false;
    public isOfficePhoneExtExist: boolean = false;
    public isParkingPhoneExtExist: boolean = false;
    public isWarehousePhoneExtExist: boolean = false;

    public isFormDirty: boolean;

    public terminalName: string = null;

    private destroy$ = new Subject<void>();

    public formConfig = SettingsTerminalConfig;
    public phoneConfig: ITaInput = SettingsTerminalConfig.getPhoneInputConfig();
    public phoneExtConfig: ITaInput =
        SettingsTerminalConfig.getPhoneExtInputConfig();
    public emailConfig: ITaInput = SettingsTerminalConfig.getEmailInputConfig();
    public addressConfig: ITaInput =
        SettingsTerminalConfig.getAddressInputConfig();
    public addressUnitConfig: ITaInput =
        SettingsTerminalConfig.getAddressUnitInputConfig();
    public payPeriodConfig: ITaInput =
        SettingsTerminalConfig.getPayPeriodInputConfig();
    public rentConfig: ITaInput = SettingsTerminalConfig.getRentConfig();
    public parkingSlotConfig: ITaInput =
        SettingsTerminalConfig.getParkingSlotConfig();
    public fullParkingSlotConfig: ITaInput =
        SettingsTerminalConfig.getFullParkingSlotConfig();

    public svgRoutes = SettingsLocationSvgRoutes;
    public taModalActionEnum = TaModalActionEnum;
    public svgRoutesCommon = SharedSvgRoutes;
    public modalButtonType = ModalButtonType;
    public activeAction!: string;
    public data: TerminalResponse;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private settingsLocationService: SettingsLocationService,
        private formService: FormService,
        private ngbActiveModal: NgbActiveModal,
        public dropDownService: DropDownService,
        private confirmationService: ConfirmationService
    ) {}

    ngOnInit() {
        this.createForm();
        this.parkingSlot();
        this.fullParkingSlot();
        this.openCloseCheckboxCard();
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
        this.terminalForm = this.formBuilder.group({
            // Terminal
            isOwner: [true],
            name: [null, [Validators.required, ...terminalNameValidation]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            phone: [null, phoneFaxRegex],
            extensionPhone: [null, [...phoneExtension]],
            email: [null],

            // Office
            officeChecked: [false],
            officePhone: [null],
            officeExtPhone: [null, [...phoneExtension]],
            officeEmail: [null],

            // Parking
            parkingChecked: [false],
            parkingPhone: [null],
            parkingExtPhone: [null, [...phoneExtension]],
            parkingEmail: [null],
            terminalParkingSlot: [null, parkingSlotValidation],
            terminalFullParkingSlot: [null, fullParkingSlotValidation],
            gate: [true],
            securityCamera: [true],

            // Warehouse
            warehouseChecked: [false],
            warehousePhone: [null],
            warehouseExtPhone: [null, [...phoneExtension]],
            warehouseEmail: [null],

            // Fuel stattion
            fuelStationChecked: [false],

            // Additional tab
            rent: [null, rentValidation],
            payPeriod: [null],
            weeklyDay: [null],
            monthlyDay: [null],
        });

        this.inputService.customInputValidator(
            this.terminalForm.get(SettingsFormEnum.EMAIL),
            SettingsFormEnum.EMAIL,
            this.destroy$
        );

        this.inputService.customInputValidator(
            this.terminalForm.get(SettingsFormEnum.OFFICE_EMAIL),
            SettingsFormEnum.EMAIL,
            this.destroy$
        );

        this.inputService.customInputValidator(
            this.terminalForm.get(SettingsFormEnum.PARKING_EMAIL),
            SettingsFormEnum.EMAIL,
            this.destroy$
        );

        this.inputService.customInputValidator(
            this.terminalForm.get(SettingsFormEnum.WAREHOUSE_EMAIL),
            SettingsFormEnum.EMAIL,
            this.destroy$
        );
    }

    public onModalAction(action: string): void {
        this.activeAction = action;
        switch (action) {
            case TaModalActionEnum.CLOSE: {
                this.ngbActiveModal.close();
                break;
            }
            case TaModalActionEnum.SAVE: {
                if (this.terminalForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.terminalForm);
                    return;
                }
                if (this.editData?.type === 'edit') {
                    this.updateTerminal(this.editData.id);
                } else {
                    this.addTerminal();
                }
                break;
            }
            case TaModalActionEnum.SAVE_AND_ADD_NEW: {
                if (this.terminalForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.terminalForm);
                    return;
                }

                this.addTerminal(true);
                break;
            }
            case TaModalActionEnum.DELETE: {
                this.deleteTerminalById();
                break;
            }
            default: {
                break;
            }
        }
    }

    public openCloseCheckboxCard() {
        this.isChecked(
            SettingsFormEnum.OFFICE_CHECKED,
            SettingsFormEnum.OFFICE_PHONE
        );
        this.isChecked(
            SettingsFormEnum.PARKING_CHECKED,
            SettingsFormEnum.OFFICE_PHONE
        );
        this.isChecked(
            SettingsFormEnum.WAREHOUSE_CHECKED,
            SettingsFormEnum.WAREHOUSE_PHONE
        );
    }

    public isChecked(formControlName: string, phoneControlName: string) {
        this.terminalForm
            .get(formControlName)
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                this.inputService.changeValidators(
                    this.terminalForm.get(phoneControlName),
                    value,
                    value ? [phoneFaxRegex] : []
                );
            });
    }

    public onHandleAddress(event: {
        address: AddressEntity;
        valid: boolean;
    }): void {
        if (event.valid) this.selectedAddress = event.address;
    }

    public onAction(event: any, action: string) {
        switch (action) {
            case SettingsFormEnum.GATE: {
                this.gateBtns = this.gateBtns.map((item) => {
                    event.name === 'No'
                        ? this.terminalForm
                              .get(SettingsFormEnum.GATE)
                              .patchValue(false)
                        : this.terminalForm
                              .get(SettingsFormEnum.GATE)
                              .patchValue(true);

                    return {
                        ...item,
                        checked: item.id === event.id,
                    };
                });
                break;
            }
            case 'camera': {
                this.cameraBtns = this.cameraBtns.map((item) => {
                    event.name === 'No'
                        ? this.terminalForm
                              .get(SettingsFormEnum.SECURITY_CAMERA)
                              .patchValue(false)
                        : this.terminalForm
                              .get(SettingsFormEnum.SECURITY_CAMERA)
                              .patchValue(true);

                    return {
                        ...item,
                        checked: item.id === event.id,
                    };
                });
                break;
            }
            default: {
                break;
            }
        }
    }

    private parkingSlot() {
        this.terminalForm
            .get(SettingsFormEnum.TERMINAL_PARKING_STOP)
            .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
            .subscribe((value) => {
                this.parkingSlots = [...this.parkingSlots];
                this.parkingSlots[0].value =
                    MethodsCalculationsHelper.calculateParkingSlot(
                        value,
                        this.terminalForm.get(
                            SettingsFormEnum.TERMINAL_PARKING_STOP
                        )
                    );
            });
    }

    private fullParkingSlot() {
        this.terminalForm
            .get(SettingsFormEnum.TERMINAL_FULL_PARKING_STOP)
            .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
            .subscribe((value) => {
                this.parkingSlots = [...this.parkingSlots];
                this.parkingSlots[1].value =
                    MethodsCalculationsHelper.calculateParkingSlot(
                        value,
                        this.terminalForm.get(
                            SettingsFormEnum.TERMINAL_FULL_PARKING_STOP
                        )
                    );
            });
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'pay-period': {
                this.selectedPayPeriod = event;
                this.terminalForm.get('monthlyDay').patchValue('');
                this.selectedDay = null;
                break;
            }
            case 'day': {
                this.selectedDay = event;
                break;
            }
            default: {
                break;
            }
        }
    }

    private updateTerminal(id: number) {
        const { addressUnit, rent, ...form } = this.terminalForm.value;

        const newData: UpdateTerminalCommand = {
            id: id,
            ...form,
            address: { ...this.selectedAddress, addressUnit: addressUnit },
            rent: rent
                ? MethodsCalculationsHelper.convertThousanSepInNumber(rent)
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
            terminalParkingCount: this.parkingSlots.length
                ? this.parkingSlots[0].value
                    ? this.parkingSlots[0].value
                    : 0 + this.parkingSlots[1].value
                      ? this.parkingSlots[1].value
                      : 0
                : 0,
            terminalParkingSlotCount: this.parkingSlots.length
                ? this.parkingSlots[0].value
                : 0,
            fullTerminalParkingSlotCount: this.parkingSlots.length
                ? this.parkingSlots[1].value
                : 0,
        };

        this.settingsLocationService
            .updateCompanyTerminal(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();
                },
                error: () => {
                    this.activeAction = null;
                },
            });
    }

    private addTerminal(addNew?: boolean) {
        const { addressUnit, rent, ...form } = this.terminalForm.value;

        const newData: CreateTerminalCommand = {
            ...form,
            address: { ...this.selectedAddress, addressUnit: addressUnit },
            rent: rent
                ? MethodsCalculationsHelper.convertThousanSepInNumber(rent)
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
            terminalParkingCount: this.parkingSlots.length
                ? this.parkingSlots[0].value
                    ? this.parkingSlots[0].value
                    : 0 + this.parkingSlots[1].value
                      ? this.parkingSlots[1].value
                      : 0
                : 0,
            terminalParkingSlotCount: this.parkingSlots.length
                ? this.parkingSlots[0].value
                : 0,
            fullTerminalParkingSlotCount: this.parkingSlots.length
                ? this.parkingSlots[1].value
                : 0,
        };

        this.settingsLocationService
            .addCompanyTerminal(newData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.ngbActiveModal.close();

                    if (addNew) {
                        this.modalService.openModal(
                            SettingsTerminalModalComponent,
                            {}
                        );
                    }
                },
                error: () => {
                    this.activeAction = null;
                },
            });
    }

    private deleteTerminalById() {
        const eventData = {
            id: this.editData.id,
            type: DropActionsStringEnum.DELETE_ITEM,
        };
        const name = DropActionNameHelper.dropActionNameDriver(
            eventData,
            DropActionsStringEnum.TERMINAL
        );
        this.dropDownService.dropActionCompanyLocation(
            eventData,
            name,
            this.data
        );
    }

    private editTerminalById(id: number) {
        this.settingsLocationService
            .getCompanyTerminalById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: (res: TerminalResponse) => {
                    this.terminalForm.patchValue({
                        isOwner: res.isOwner,
                        name: res.name,
                        address: res.address.address,
                        addressUnit: res.address.addressUnit,
                        phone: res.phone,
                        extensionPhone: res.extensionPhone,
                        email: res.email,
                        // Office
                        officeChecked: res.officeChecked,
                        officePhone: res.officePhone,
                        officeExtPhone: res.officeExtPhone,
                        officeEmail: res.officeEmail,
                        // Parking
                        parkingChecked: res.parkingChecked,
                        parkingPhone: res.parkingPhone,
                        parkingExtPhone: res.parkingExtPhone,
                        parkingEmail: res.parkingEmail,

                        terminalParkingSlot: res.terminalParkingSlot,
                        terminalFullParkingSlot: res.terminalFullParkingSlot,
                        gate: res.gate,
                        securityCamera: res.securityCamera,
                        // Warehouse
                        warehouseChecked: res.warehouseChecked,
                        warehousePhone: res.warehousePhone,
                        warehouseExtPhone: res.warehouseExtPhone,
                        warehouseEmail: res.warehouseEmail,
                        // Fuel stattion
                        fuelStationChecked: res.fuelStationChecked,
                        // Additional tab
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
                    this.terminalName = res.name;
                    this.selectedAddress = res.address;
                    this.selectedPayPeriod = res.payPeriod;

                    this.selectedDay = res.payPeriod
                        ? res.payPeriod.name === 'Monthly'
                            ? res.monthlyDay
                            : res.weeklyDay
                        : null;

                    this.parkingSlots[0] = {
                        id: 1,
                        value: res.terminalParkingSlot,
                    };
                    this.parkingSlots[1] = {
                        id: 2,
                        value: res.terminalFullParkingSlot,
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
                        this.isTerminalPhoneExtExist = true;
                    }

                    if (res.officeExtPhone) {
                        this.isOfficePhoneExtExist = true;
                    }

                    if (res.parkingExtPhone) {
                        this.isParkingPhoneExtExist = true;
                    }

                    if (res.warehouseExtPhone) {
                        this.isWarehousePhoneExtExist = true;
                    }

                    this.data = res;

                    setTimeout(() => {
                        this.startFormChanges();
                    }, 1000);
                },
                error: () => {},
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

                    if (this.editData?.type === 'edit') {
                        this.editTerminalById(this.editData.id);
                    } else {
                        this.startFormChanges();
                    }
                },
                error: () => {},
            });
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.terminalForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
