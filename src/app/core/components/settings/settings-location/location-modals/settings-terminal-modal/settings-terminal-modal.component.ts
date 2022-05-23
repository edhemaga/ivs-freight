import { emailRegex } from './../../../../shared/ta-input/ta-input.regex-validations';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';
import { Address } from 'src/app/core/components/shared/model/address';
import { AddressEntity } from 'appcoretruckassist';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { phoneRegex } from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';
import { tab_modal_animation } from 'src/app/core/components/shared/animations/tabs-modal.animation';

@Component({
  selector: 'app-settings-terminal-modal',
  templateUrl: './settings-terminal-modal.component.html',
  styleUrls: ['./settings-terminal-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
})
export class SettingsTerminalModalComponent implements OnInit {
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
      office: [false],
      officePhone: [null, [Validators.required, phoneRegex]],
      officePhoneExtension: [null],
      officeEmail: [null, emailRegex],
      // Parking
      parking: [false],
      parkingPhone: [null, [Validators.required, phoneRegex]],
      parkingPhoneExtension: [null],
      parkingEmail: [null, emailRegex],
      parkingSlot: [null],
      fullParkingSlot: [null],
      gate: [false],
      securityCamera: [false],
      // Warehouse
      warehouse: [false],
      warehousePhone: [null, [Validators.required, phoneRegex]],
      warehousePhoneExtension: [null],
      warehouseEmail: [null, emailRegex],
      // Fuel stattion
      fuelStation: [false],
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
        break;
      }
      case 'parking': {
        if (this.terminalForm.get('parking').value) {
          event.preventDefault();
          event.stopPropagation();
          this.terminalForm.get('parking').setValue(false);
        }
        break;
      }
      case 'warehouse': {
        if (this.terminalForm.get('warehouse').value) {
          event.preventDefault();
          event.stopPropagation();
          this.terminalForm.get('warehouse').setValue(false);
        }
        break;
      }
      case 'fuelStation': {
        if (this.terminalForm.get('fuelStation').value) {
          event.preventDefault();
          event.stopPropagation();
          this.terminalForm.get('fuelStation').setValue(false);
        }
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
}
