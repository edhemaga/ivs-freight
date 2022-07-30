import { emailRegex } from './../../../../shared/ta-input/ta-input.regex-validations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Address } from 'src/app/core/components/shared/model/address';
import { AddressEntity } from 'appcoretruckassist';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { phoneRegex } from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';
import { tab_modal_animation } from 'src/app/core/components/shared/animations/tabs-modal.animation';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { calculateParkingSlot } from 'src/app/core/utils/methods.calculations';
import { debounceTime } from 'rxjs';
import { FormService } from 'src/app/core/services/form/form.service';

@Component({
  selector: 'app-settings-terminal-modal',
  templateUrl: './settings-terminal-modal.component.html',
  styleUrls: ['./settings-terminal-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  providers: [ModalService, FormService],
})
export class SettingsTerminalModalComponent implements OnInit, OnDestroy {
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
      label: 'Yes',
      value: 'yes',
      name: 'gate',
      checked: false,
    },
    {
      id: 522,
      label: 'No',
      value: 'no',
      name: 'gate',
      checked: false,
    },
  ];

  public cameraBtns = [
    {
      id: 533,
      label: 'Yes',
      value: 'yes',
      name: 'camera',
      checked: false,
    },
    {
      id: 544,
      label: 'No',
      value: 'no',
      name: 'camera',
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
  public selectedPayPeriod: any = null;
  public selectedDay: any = null;

  public isTerminalPhoneExtExist: boolean = false;
  public isOfficePhoneExtExist: boolean = false;
  public isParkingPhoneExtExist: boolean = false;
  public isWarehousePhoneExtExist: boolean = false;
  public isFuelStationPhoneExtExist: boolean = false;

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();
    this.parkingSlot();
    this.fullParkingSlot();
  }

  private createForm() {
    this.terminalForm = this.formBuilder.group({
      // Terminal
      companyOwned: [false],
      terminalName: [null, Validators.required],
      address: [null, Validators.required],
      addressUnit: [null, Validators.maxLength(6)],
      terminalPhone: [null, [Validators.required, phoneRegex]],
      terminalPhoneExtension: [null],
      terminalEmail: [null, emailRegex],
      // Office
      office: [true],
      officePhone: [null, [Validators.required, phoneRegex]],
      officePhoneExtension: [null],
      officeEmail: [null, emailRegex],
      // Parking
      parking: [true],
      parkingPhone: [null, [Validators.required, phoneRegex]],
      parkingPhoneExtension: [null],
      parkingEmail: [null, emailRegex],
      parkingSlot: [null],
      fullParkingSlot: [null],
      gate: [false],
      securityCamera: [false],
      // Warehouse
      warehouse: [true],
      warehousePhone: [null, [Validators.required, phoneRegex]],
      warehousePhoneExtension: [null],
      warehouseEmail: [null, emailRegex],
      // Fuel stattion
      fuelStation: [true],
      fuelStationPhone: [null, [Validators.required, phoneRegex]],
      fuelStationPhoneExtension: [null],
      fuelStationEmail: [null, emailRegex],
      // Additional tab
      rent: [null],
      payPeriod: [null],
      day: [null],
    });

    // this.formService.checkFormChange(this.terminalForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
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
        this.terminalForm.reset();
        break;
      }
      case 'save': {
        if (this.terminalForm.invalid) {
          this.inputService.markInvalid(this.terminalForm);
          return;
        }
        if (this.editData) {
          this.updateTerminal(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addTerminal();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      case 'delete': {
        this.deleteTerminalById(this.editData.id);
        this.modalService.setModalSpinner({ action: 'delete', status: true });
        break;
      }
      default: {
        break;
      }
    }
  }

  public openCloseCheckboxCard(event: any, action: string) {
    switch (action) {
      case 'companyOwned': {
        if (this.terminalForm.get('companyOwned').value) {
          event.preventDefault();
          event.stopPropagation();
          this.terminalForm.get('companyOwned').setValue(false);
        }
        this.isCheckedCompanyOwned();
        break;
      }
      case 'office': {
        if (this.terminalForm.get('office').value) {
          event.preventDefault();
          event.stopPropagation();
          this.terminalForm.get('office').setValue(false);
        }
        this.isCheckedOffice();
        break;
      }
      case 'parking': {
        if (this.terminalForm.get('parking').value) {
          event.preventDefault();
          event.stopPropagation();
          this.terminalForm.get('parking').setValue(false);
        }
        this.isCheckedParking();
        break;
      }
      case 'warehouse': {
        if (this.terminalForm.get('warehouse').value) {
          event.preventDefault();
          event.stopPropagation();
          this.terminalForm.get('warehouse').setValue(false);
        }
        this.isCheckedWarehouse();
        break;
      }
      case 'fuelStation': {
        if (this.terminalForm.get('fuelStation').value) {
          event.preventDefault();
          event.stopPropagation();
          this.terminalForm.get('fuelStation').setValue(false);
        }
        this.isCheckedFuelStation();
        break;
      }
      default: {
        break;
      }
    }
  }

  public isCheckedCompanyOwned() {
    this.terminalForm
      .get('companyOwned')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(
            this.terminalForm.get('terminalName')
          );
          this.inputService.changeValidators(this.terminalForm.get('address'));
          this.inputService.changeValidators(
            this.terminalForm.get('terminalPhone'),
            true,
            [phoneRegex]
          );
        } else {
          this.inputService.changeValidators(
            this.terminalForm.get('terminalName'),
            false
          );
          this.inputService.changeValidators(
            this.terminalForm.get('address'),
            false
          );
          this.inputService.changeValidators(
            this.terminalForm.get('terminalPhone'),
            false
          );
        }
      });
  }

  public isCheckedOffice() {
    this.terminalForm
      .get('office')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(
            this.terminalForm.get('officePhone'),
            true,
            [phoneRegex]
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
      .get('parking')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(
            this.terminalForm.get('parkingPhone'),
            true,
            [phoneRegex]
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
      .get('warehouse')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(
            this.terminalForm.get('warehousePhone'),
            true,
            [phoneRegex]
          );
        } else {
          this.inputService.changeValidators(
            this.terminalForm.get('warehousePhone'),
            false
          );
        }
      });
  }

  public isCheckedFuelStation() {
    this.terminalForm
      .get('fuelStation')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(
            this.terminalForm.get('fuelStationPhone'),
            true,
            [phoneRegex]
          );
        } else {
          this.inputService.changeValidators(
            this.terminalForm.get('fuelStationPhone'),
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
        this.gateBtns = [...event];
        this.gateBtns.forEach((item) => {
          if (item.checked) {
            this.terminalForm.get('gate').patchValue(item.label);
          }
        });
        break;
      }
      case 'camera': {
        this.cameraBtns = [...event];
        this.cameraBtns.forEach((item) => {
          if (item.checked) {
            this.terminalForm.get('securityCamera').patchValue(item.label);
          }
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
      .get('parkingSlot')
      .valueChanges.pipe(debounceTime(1000), untilDestroyed(this))
      .subscribe((value) => {
        this.parkingSlots = [...this.parkingSlots];
        this.parkingSlots[0].value = calculateParkingSlot(
          value,
          this.terminalForm.get('parkingSlot')
        );
      });
  }

  private fullParkingSlot() {
    this.terminalForm
      .get('fullParkingSlot')
      .valueChanges.pipe(debounceTime(1000), untilDestroyed(this))
      .subscribe((value) => {
        this.parkingSlots = [...this.parkingSlots];
        this.parkingSlots[1].value = calculateParkingSlot(
          value,
          this.terminalForm.get('fullParkingSlot')
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

  private updateTerminal(id: number) {}

  private addTerminal() {}

  private deleteTerminalById(id: number) {}

  ngOnDestroy() {}
}
