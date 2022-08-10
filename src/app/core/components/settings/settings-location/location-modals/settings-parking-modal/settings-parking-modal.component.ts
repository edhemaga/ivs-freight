import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  AddressEntity,
  CompanyOfficeModalResponse,
  CreateParkingCommand,
  ParkingResponse,
  UpdateParkingCommand,
} from 'appcoretruckassist';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { debounceTime } from 'rxjs';
import { tab_modal_animation } from 'src/app/core/components/shared/animations/tabs-modal.animation';
import {
  emailRegex,
  phoneRegex,
} from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import {
  calculateParkingSlot,
  convertNumberInThousandSep,
  convertThousanSepInNumber,
} from 'src/app/core/utils/methods.calculations';
import { SettingsLocationService } from '../../../state/location-state/settings-location.service';

@UntilDestroy()
@Component({
  selector: 'app-settings-parking-modal',
  templateUrl: './settings-parking-modal.component.html',
  styleUrls: ['./settings-parking-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  providers: [ModalService, FormService],
})
export class SettingsParkingModalComponent implements OnInit, OnDestroy {
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

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private formService: FormService,
    private settingsLocationService: SettingsLocationService
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
      isOwner: [false],
      name: [null, Validators.required],
      address: [null, Validators.required],
      addressUnit: [null, Validators.maxLength(6)],
      phone: [null, phoneRegex],
      extensionPhone: [null],
      email: [null, emailRegex],
      parkingSlot: [null],
      fullParkingSlot: [null],
      gate: [true],
      securityCamera: [true],
      rent: [null],
      payPeriod: [null],
      monthlyDay: [null],
      weeklyDay: [null],
    });

    // this.formService.checkFormChange(this.parkingForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
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
            ? this.parkingForm.get('securityCamera').patchValue(false)
            : this.parkingForm.get('securityCamera').patchValue(true);

          return {
            ...item,
            checked: item.id === event.id,
          };
        });
        break;
      }
      default: {
        this.selectedTab = event.id;
        let dotAnimation = document.querySelector('.animation-two-tabs');
        this.animationObject = {
          value: this.selectedTab,
          params: { height: `${dotAnimation.getClientRects()[0].height}px` },
        };
        break;
      }
    }
  }

  public onModalAction(data: { action: string; bool: boolean }): void {
    switch (data.action) {
      case 'close': {
        this.parkingForm.reset();
        break;
      }
      case 'save': {
        if (this.parkingForm.invalid) {
          this.inputService.markInvalid(this.parkingForm);
          return;
        }
        if (this.editData?.type === 'edit') {
          this.updateParking(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addParking();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        this.deleteParkingById(this.editData.id);
        this.modalService.setModalSpinner({ action: 'delete', status: true });

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
      .valueChanges.pipe(debounceTime(1000), untilDestroyed(this))
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
      .valueChanges.pipe(debounceTime(1000), untilDestroyed(this))
      .subscribe((value) => {
        this.parkingSlots = [...this.parkingSlots];
        this.parkingSlots[1].value = calculateParkingSlot(
          value,
          this.parkingForm.get('fullParkingSlot')
        );
      });
  }

  private updateParking(id: number) {
    const { address, addressUnit, rent, ...form } = this.parkingForm.value;

    if (this.selectedAddress) {
      this.selectedAddress = {
        ...this.selectedAddress,
        addressUnit: addressUnit,
      };
    }

    const newData: UpdateParkingCommand = {
      id: id,
      ...form,
      address: this.selectedAddress?.address ? this.selectedAddress : null,
      rent: rent ? convertThousanSepInNumber(rent) : null,
      payPeriod: this.selectedPayPeriod ? this.selectedPayPeriod.id : null,
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
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfuly updated company parking',
            'Success'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
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
    const { address, addressUnit, rent, ...form } = this.parkingForm.value;

    if (this.selectedAddress) {
      this.selectedAddress = {
        ...this.selectedAddress,
        addressUnit: addressUnit,
      };
    }

    const newData: CreateParkingCommand = {
      ...form,
      address: this.selectedAddress?.address ? this.selectedAddress : null,
      rent: rent ? convertThousanSepInNumber(rent) : null,
      payPeriod: this.selectedPayPeriod ? this.selectedPayPeriod.id : null,
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
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfuly added company parking',
            'Success'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
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
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfuly delete company parking',
            'Success'
          );
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
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
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: ParkingResponse) => {
          this.parkingForm.patchValue({
            isOwner: res.isOwner,
            name: res.name,
            address: res.address.address,
            addressUnit: res.address.addressUnit,
            phone: res.phone,
            extensionPhone: '131',
            email: res.email,
            parkingSlot: res.parkingSlot,
            fullParkingSlot: res.fullParkingSlot,
            gate: res.gate,
            securityCamera: res.securityCamera,
            rent: res.rent ? convertNumberInThousandSep(res.rent) : null,
            payPeriod: res.payPeriod ? res.payPeriod.name : null,
            monthlyDay: res.payPeriod?.name
              ? res.payPeriod.name === 'Monthly'
                ? res.monthlyDay.name
                : res.weeklyDay.name
              : null,
          });

          this.selectedAddress = res.address;
          this.selectedPayPeriod = res.payPeriod;

          this.selectedDay = res.payPeriod
            ? res.payPeriod.name === 'Monthly'
              ? res.monthlyDay
              : res.weeklyDay
            : null;

          this.parkingSlots[0] = { id: 1, value: res.parkingSlot };
          this.parkingSlots[1] = { id: 2, value: res.fullParkingSlot };

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
      .pipe(untilDestroyed(this))
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

  ngOnDestroy(): void {}
}
