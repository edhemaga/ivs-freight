import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
    AddressEntity,
    CompanyOfficeModalResponse,
    CreateParkingCommand,
    ParkingResponse,
    UpdateParkingCommand,
} from 'appcoretruckassist';
import { debounceTime, Subject, takeUntil } from 'rxjs';

import { SettingsLocationService } from '../../../state/location-state/settings-location.service';
import { tab_modal_animation } from '../../../../shared/animations/tabs-modal.animation';
import { ModalService } from '../../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../../shared/ta-input/ta-input.service';
import { NotificationService } from '../../../../../services/notification/notification.service';
import { rentValidation } from '../../../../shared/ta-input/ta-input.regex-validations';
import { FormService } from '../../../../../services/form/form.service';
import {
    addressValidation,
    addressUnitValidation,
    phoneFaxRegex,
    phoneExtension,
    parkingNameValidation,
    parkingSlotValidation,
    fullParkingSlotValidation,
} from '../../../../shared/ta-input/ta-input.regex-validations';
import {
    calculateParkingSlot,
    convertThousanSepInNumber,
    convertNumberInThousandSep,
} from '../../../../../utils/methods.calculations';

@Component({
    selector: 'app-settings-parking-modal',
    templateUrl: './settings-parking-modal.component.html',
    styleUrls: ['./settings-parking-modal.component.scss'],
    animations: [tab_modal_animation('animationTabsModal')],
    providers: [ModalService],
})
export class SettingsParkingModalComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    @Input() editData: any;

    public parkingForm: FormGroup;

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

    public animationObject = {
        value: this.selectedTab,
        params: { height: '0px' },
    };

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
            id: 363,
            name: 'Yes',
            checked: false,
        },
        {
            id: 367,
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
        this.getModalDropdowns();

        if (this.editData?.type === 'edit') {
            this.editCompanyParkingById(this.editData.id);
        }
    }

    private createForm() {
        this.parkingForm = this.formBuilder.group({
            isOwner: [true],
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

        this.formService.checkFormChange(this.parkingForm);
        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public tabChange(event: any, action?: string): void {
        switch (action) {
            case 'gate': {
                this.gateBtns = this.gateBtns.map((item) => {
                    event.name === 'No'
                        ? this.parkingForm.get('gate').patchValue(false)
                        : this.parkingForm.get('gate').patchValue(true);

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
                        ? this.parkingForm
                              .get('securityCamera')
                              .patchValue(false)
                        : this.parkingForm
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
                this.selectedTab = event.id;
                let dotAnimation = document.querySelector(
                    '.animation-two-tabs'
                );

                this.animationObject = {
                    value: this.selectedTab,
                    params: {
                        height: `${dotAnimation.getClientRects()[0].height}px`,
                    },
                };

                break;
            }
        }
    }

    public onModalAction(data: { action: string; bool: boolean }): void {
        switch (data.action) {
            case 'close': {
                break;
            }
            case 'save': {
                if (this.parkingForm.invalid || !this.isFormDirty) {
                    this.inputService.markInvalid(this.parkingForm);
                    return;
                }
                if (this.editData?.type === 'edit') {
                    this.updateParking(this.editData.id);
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                } else {
                    this.addParking();
                    this.modalService.setModalSpinner({
                        action: null,
                        status: true,
                    });
                }
                break;
            }
            case 'delete': {
                this.deleteParkingById(this.editData.id);
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

    public onHandleAddress(event: {
        address: AddressEntity | any;
        valid: boolean;
    }): void {
        if (event.valid) this.selectedAddress = event.address;
    }

    public onSelectDropdown(event: any, action: string) {
        switch (action) {
            case 'pay-period': {
                this.selectedPayPeriod = event;
                this.parkingForm.get('monthlyDay').patchValue(null);
                this.parkingForm.get('weeklyDay').patchValue(null);
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

    private parkingSlot() {
        this.parkingForm
            .get('parkingSlot')
            .valueChanges.pipe(debounceTime(1000), takeUntil(this.destroy$))
            .subscribe((value) => {
                this.parkingSlots = [...this.parkingSlots];
                this.parkingSlots[0].value = calculateParkingSlot(
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
                this.parkingSlots[1].value = calculateParkingSlot(
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
                next: () => {
                    this.notificationService.success(
                        'Successfuly updated company parking',
                        'Success'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Can't update company parking",
                        'Error'
                    );
                },
            });
    }

    private addParking() {
        const { addressUnit, rent, ...form } = this.parkingForm.value;

        if (this.selectedAddress) {
            this.selectedAddress = {
                ...this.selectedAddress,
                addressUnit: addressUnit,
            };
        }

        const newData: CreateParkingCommand = {
            ...form,
            address: this.selectedAddress?.address
                ? this.selectedAddress
                : null,
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
                    this.notificationService.success(
                        'Successfuly added company parking',
                        'Success'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Can't add new company parking",
                        'Error'
                    );
                },
            });
    }

    private deleteParkingById(id: number) {
        this.settingsLocationService
            .deleteCompanyParkingById(id)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.notificationService.success(
                        'Successfuly delete company parking',
                        'Success'
                    );
                },
                error: () => {
                    this.notificationService.error(
                        "Can't delete company parking",
                        'Error'
                    );
                },
            });
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
                            ? convertNumberInThousandSep(res.rent)
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
                },
                error: () => {
                    this.notificationService.error(
                        "Can't load company parking.",
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
                    this.payPeriods = res.payPeriod;
                    this.monthlyDays = res.payPeriodMonthly;
                    this.weeklyDays = res.dayOfWeek;
                },
                error: () => {
                    this.notificationService.error(
                        "Can't load modal dropdowns.",
                        'Error'
                    );
                },
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
