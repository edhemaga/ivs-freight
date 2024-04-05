import {
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

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
} from '../../../../../shared/components/ta-input/validators/ta-input.regex-validations';
import {
    phoneFaxRegex,
    rentValidation,
} from '../../../../../shared/components/ta-input/validators/ta-input.regex-validations';

// models
import {
    AddressEntity,
    CompanyOfficeModalResponse,
    CreateTerminalCommand,
    TerminalResponse,
    UpdateTerminalCommand,
} from 'appcoretruckassist';
import { Address } from '../../../../../core/components/shared/model/address';

// animation
import { tab_modal_animation } from '../../../../../core/components/shared/animations/tabs-modal.animation';

// services
import { SettingsLocationService } from 'src/app/pages/settings/pages/settings-location/services/settings-location.service';
import { ModalService } from '../../../../../shared/components/ta-modal/services/modal.service';
import { TaInputService } from '../../../../../shared/components/ta-input/services/ta-input.service';
import { FormService } from 'src/app/shared/services/form.service';

// components
import { TaInputComponent } from '../../../../../shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../../../../shared/components/ta-input-dropdown/ta-input-dropdown.component';
import { TaModalComponent } from '../../../../../shared/components/ta-modal/ta-modal.component';
import { TaTabSwitchComponent } from '../../../../../shared/components/ta-tab-switch/ta-tab-switch.component';
import { TaCheckboxCardComponent } from '../../../../../shared/components/ta-checkbox-card/ta-checkbox-card.component';
import { InputAddressDropdownComponent } from '../../../../../core/components/shared/input-address-dropdown/input-address-dropdown.component';

// utils
import { MethodsCalculationsHelper } from '../../../../../shared/utils/helpers/methods-calculations.helper';

@Component({
    selector: 'app-settings-terminal-modal',
    templateUrl: './settings-terminal-modal.component.html',
    styleUrls: ['./settings-terminal-modal.component.scss'],
    animations: [tab_modal_animation('animationTabsModal')],
    providers: [ModalService, FormService],
    standalone: true,
    imports: [
        // Module
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,

        // Component
        TaInputComponent,
        TaInputDropdownComponent,
        TaModalComponent,
        TaTabSwitchComponent,
        TaCheckboxCardComponent,
        InputAddressDropdownComponent,
    ],
})
export class SettingsTerminalModalComponent implements OnInit, OnDestroy {
    @Input() editData: any;

    public terminalForm: UntypedFormGroup;

    public selectedTab: number = 1;
    public tabs: any[] = [
        {
            id: 1,
            name: 'Basic',
            checked: true,
        },
        {
            id: 2,
            name: 'Additional',
        },
    ];

    public gateBtns = [
        {
            id: 511,
            name: 'Yes',
            checked: false,
        },
        {
            id: 522,
            name: 'No',
            checked: false,
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
            checked: false,
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

    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };

    public selectedAddress: Address | AddressEntity = null;

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

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private settingsLocationService: SettingsLocationService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.parkingSlot();
        this.fullParkingSlot();
        this.openCloseCheckboxCard();
        this.getModalDropdowns();
    }

    private createForm() {
        this.terminalForm = this.formBuilder.group({
            // Terminal
            isOwner: [false],
            name: [null, [Validators.required, ...terminalNameValidation]],
            address: [null, [Validators.required, ...addressValidation]],
            addressUnit: [null, [...addressUnitValidation]],
            phone: [null, [Validators.required, phoneFaxRegex]],
            extensionPhone: [null, [...phoneExtension]],
            email: [null],
            // Office
            officeChecked: [true],
            officePhone: [null, [Validators.required, phoneFaxRegex]],
            officeExtPhone: [null, [...phoneExtension]],
            officeEmail: [null],
            // Parking
            parkingChecked: [true],
            parkingPhone: [null, [Validators.required, phoneFaxRegex]],
            parkingExtPhone: [null, [...phoneExtension]],
            parkingEmail: [null],

            terminalParkingSlot: [null, parkingSlotValidation],
            terminalFullParkingSlot: [null, fullParkingSlotValidation],
            gate: [true],
            securityCamera: [true],
            // Warehouse
            warehouseChecked: [true],
            warehousePhone: [null, [Validators.required, phoneFaxRegex]],
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
            this.terminalForm.get('email'),
            'email',
            this.destroy$
        );

        this.inputService.customInputValidator(
            this.terminalForm.get('officeEmail'),
            'email',
            this.destroy$
        );

        this.inputService.customInputValidator(
            this.terminalForm.get('parkingEmail'),
            'email',
            this.destroy$
        );

        this.inputService.customInputValidator(
            this.terminalForm.get('warehouseEmail'),
            'email',
            this.destroy$
        );
    }

    public tabChange(event: any): void {
        this.selectedTab = event.id;
        let dotAnimation = document.querySelector('.animation-two-tabs');
        this.animationObject = {
            value: this.selectedTab,
            params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
                if (this.terminalForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.terminalForm);
                    return;
                }
                if (this.editData?.type === 'edit') {
                    this.updateTerminal(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                } else {
                    this.addTerminal();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: false,
                    });
                }
                break;
            }
            case 'delete': {
                this.deleteTerminalById(this.editData.id);
                this.modalService.setModalSpinner({
                    action: 'delete',
                    status: true,
                    close: false,
                });
                break;
            }
            default: {
                break;
            }
        }
    }

    public openCloseCheckboxCard() {
        this.isCheckedOffice();

        this.isCheckedParking();

        this.isCheckedWarehouse();
    }

    public isCheckedOffice() {
        this.terminalForm
            .get('officeChecked')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.inputService.changeValidators(
                        this.terminalForm.get('officePhone'),
                        true,
                        [phoneFaxRegex]
                    );
                } else {
                    this.inputService.changeValidators(
                        this.terminalForm.get('officePhone'),
                        false
                    );
                }
            });
    }

    public isCheckedParking() {
        this.terminalForm
            .get('parkingChecked')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.inputService.changeValidators(
                        this.terminalForm.get('parkingPhone'),
                        true,
                        [phoneFaxRegex]
                    );
                } else {
                    this.inputService.changeValidators(
                        this.terminalForm.get('parkingPhone'),
                        false
                    );
                }
            });
    }

    public isCheckedWarehouse() {
        this.terminalForm
            .get('warehouseChecked')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.inputService.changeValidators(
                        this.terminalForm.get('warehousePhone'),
                        true,
                        [phoneFaxRegex]
                    );
                } else {
                    this.inputService.changeValidators(
                        this.terminalForm.get('warehousePhone'),
                        false
                    );
                }
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
            case 'gate': {
                this.gateBtns = this.gateBtns.map((item) => {
                    event.name === 'No'
                        ? this.terminalForm.get('gate').patchValue(false)
                        : this.terminalForm.get('gate').patchValue(true);

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
                              .get('securityCamera')
                              .patchValue(false)
                        : this.terminalForm
                              .get('securityCamera')
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
            .get('terminalParkingSlot')
            .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
            .subscribe((value) => {
                this.parkingSlots = [...this.parkingSlots];
                this.parkingSlots[0].value =
                    MethodsCalculationsHelper.calculateParkingSlot(
                        value,
                        this.terminalForm.get('terminalParkingSlot')
                    );
            });
    }

    private fullParkingSlot() {
        this.terminalForm
            .get('terminalFullParkingSlot')
            .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
            .subscribe((value) => {
                this.parkingSlots = [...this.parkingSlots];
                this.parkingSlots[1].value =
                    MethodsCalculationsHelper.calculateParkingSlot(
                        value,
                        this.terminalForm.get('terminalFullParkingSlot')
                    );
            });
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'pay-period': {
                this.selectedPayPeriod = event;
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
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
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

    private addTerminal() {
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
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                        close: true,
                    });
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

    private deleteTerminalById(id: number) {
        this.settingsLocationService
            .deleteCompanyTerminalById(id)
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
