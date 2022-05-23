import { emailRegex } from './../../../../shared/ta-input/ta-input.regex-validations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Address } from 'src/app/core/components/shared/model/address';
import { AddressEntity } from 'appcoretruckassist';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { phoneRegex } from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';
import { tab_modal_animation } from 'src/app/core/components/shared/animations/tabs-modal.animation';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-settings-terminal-modal',
  templateUrl: './settings-terminal-modal.component.html',
  styleUrls: ['./settings-terminal-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
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

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
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
    if (data.action === 'close') {
      this.terminalForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        if (this.terminalForm.invalid) {
          this.inputService.markInvalid(this.terminalForm);
          return;
        }
        if (this.editData) {
          this.updateTerminal(this.editData.id);
        } else {
          this.addTerminal();
        }
      }

      // Delete
      if (data.action === 'delete' && this.editData) {
        this.deleteTerminalById(this.editData.id);
      }

      this.ngbActiveModal.close();
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

  public changeGate(event: any) {
    this.gateBtns = [...event];
    this.gateBtns.forEach((item) => {
      if (item.checked) {
        this.terminalForm.get('gate').patchValue(item.label);
      }
    });
  }

  public changeCamera(event: any) {
    this.cameraBtns = [...event];
    this.cameraBtns.forEach((item) => {
      if (item.checked) {
        this.terminalForm.get('securityCamera').patchValue(item.label);
      }
    });
  }

  private updateTerminal(id: number) {}

  private addTerminal() {}

  private deleteTerminalById(id: number) {}

  ngOnDestroy() {}
}
