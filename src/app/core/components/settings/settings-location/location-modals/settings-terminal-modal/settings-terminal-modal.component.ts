import {
    addressUnitValidation,
    addressValidation,
    fullParkingSlotValidation,
    parkingSlotValidation,
    phoneExtension,
    terminalNameValidation,
} from '../../../../shared/ta-input/ta-input.regex-validations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
    AddressEntity,
    CompanyOfficeModalResponse,
    CreateTerminalCommand,
    TerminalResponse,
    UpdateTerminalCommand,
} from 'appcoretruckassist';

import { debounceTime, Subject, takeUntil } from 'rxjs';
import { SettingsLocationService } from '../../../state/location-state/settings-location.service';
import { tab_modal_animation } from '../../../../shared/animations/tabs-modal.animation';
import { ModalService } from '../../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../../shared/ta-input/ta-input.service';
import { NotificationService } from '../../../../../services/notification/notification.service';
import {
    phoneFaxRegex,
    rentValidation,
} from '../../../../shared/ta-input/ta-input.regex-validations';
import {
    calculateParkingSlot,
    convertThousanSepInNumber,
    convertNumberInThousandSep,
} from '../../../../../utils/methods.calculations';
import { Address } from '../../../../shared/model/address';
import { FormService } from '../../../../../services/form/form.service';

@Component({
    selector: 'app-settings-terminal-modal',
    templateUrl: './settings-terminal-modal.component.html',
    styleUrls: ['./settings-terminal-modal.component.scss'],
    animations: [tab_modal_animation('animationTabsModal')],
    providers: [ModalService, FormService],
})
export class SettingsTerminalModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() editData: any;
    public terminalForm: FormGroup;

    public selectedTab: number = 1;
    public tabs: any[] = [
        {
            id: 1,
            name: 'Basic',
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

    constructor(
        private formBuilder: FormBuilder,
        private inputService: TaInputService,
        private modalService: ModalService,
        private notificationService: NotificationService,
        private settingsLocationService: SettingsLocationService,
        private formService: FormService
    ) {}

    ngOnInit() {
        this.createForm();
        this.parkingSlot();
        this.fullParkingSlot();
        this.openCloseCheckboxCard();
        this.getModalDropdowns();

        if (this.editData?.type === 'edit') {
            this.editTerminalById(this.editData.id);
        }
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

        this.formService.checkFormChange(this.terminalForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
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
                    });
                } else {
                    this.addTerminal();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                }
                break;
            }
            case 'delete': {
                this.deleteTerminalById(this.editData.id);
                this.modalService.setModalSpinner({
                    action: 'delete',
                    status: true,
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
                this.parkingSlots[0].value = calculateParkingSlot(
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
                this.parkingSlots[1].value = calculateParkingSlot(
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
            rent: rent ? convertThousanSepInNumber(rent) : null,
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
                    this.notificationService.success(
                        'Successfuly updated company terminal',
                        'Success'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Can't update company terminal.",
                        'Error'
                    );
                },
            });
    }

    private addTerminal() {
        const { addressUnit, rent, ...form } = this.terminalForm.value;

        const newData: CreateTerminalCommand = {
            ...form,
            address: { ...this.selectedAddress, addressUnit: addressUnit },
            rent: rent ? convertThousanSepInNumber(rent) : null,
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
                    this.notificationService.success(
                        'Successfuly added company terminal',
                        'Success'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Can't add company terminal.",
                        'Error'
                    );
                },
            });
    }

    private deleteTerminalById(id: number) {
        this.settingsLocationService
            .deleteCompanyTerminalById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Successfuly deleted company terminal.',
                        'Success'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Can't delete company terminal.",
                        'Error'
                    );
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
                            ? convertNumberInThousandSep(res.rent)
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
                },
                error: () => {
                    this.notificationService.error(
                        "Can't load company terminal.",
                        'Error'
                    );
                },
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
                },
                error: () => {
                    this.notificationService.error(
                        "Can't load modal dropdowns",
                        'Error'
                    );
                },
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
