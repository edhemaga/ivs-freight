import {
  daysValidRegex,
  emailRegex,
  monthsValidRegex,
} from './../../../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { tab_modal_animation } from 'src/app/core/components/shared/animations/tabs-modal.animation';
import {
  einNumberRegex,
  phoneRegex,
} from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { Address } from 'src/app/core/components/shared/model/address';
import { AddressEntity } from 'appcoretruckassist';

@Component({
  selector: 'app-settings-basic-modal',
  templateUrl: './settings-basic-modal.component.html',
  styleUrls: ['./settings-basic-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
})
export class SettingsBasicModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public companyForm: FormGroup;

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
    {
      id: 3,
      name: 'Payroll',
    },
  ];

  public prefferedLoadBtns = [
    {
      id: 1,
      label: 'FTL',
      value: 'FTL',
      name: 'credit',
      checked: true,
    },
    {
      id: 2,
      label: 'LTL',
      value: 'LTL',
      name: 'credit',
      checked: false,
    },
  ];

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public selectedAddress: Address | AddressEntity;
  public selectedTimezone: any = null;
  public selectedCurrency: any = null;

  public selectedDepartmentFormArray: any[] = [];
  public selectedBankAccountFormArray: any[] = [];

  public isLogoDropZoneVisibile: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm() {
    this.companyForm = this.formBuilder.group({
      // Basic Tab
      companyName: [null, Validators.required],
      usdot: [null, Validators.required],
      ein: [null, einNumberRegex],
      mcNumber: [null, Validators.maxLength(8)],
      phone: [null, phoneRegex],
      email: [null, emailRegex],
      fax: [null],
      url: [null],
      address: [null],
      addressUnit: [null],
      irp: [null],
      ifta: [null],
      toll: [null],
      scac: [null],
      timeZone: [null, Validators.required],
      currency: [null, Validators.required],
      avatar: [null],
      // Additional Tab
      departmentContact: this.formBuilder.array([]),
      bankAccount: this.formBuilder.array([]),
      bankCard: this.formBuilder.group([]),
      prefix: [null],
      startingNo: [null, Validators.required],
      suffix: [null],
      preferredLoadType: ['FTL'],
      autoInvoicing: [false],
      factorByDefault: [false],
      customerPayTerm: [null, daysValidRegex],
      customerCredit: [null],
      mvr: [null, [Validators.required, monthsValidRegex]],
      truckInspection: [null, [Validators.required, monthsValidRegex]],
      trailerInspection: [null, [Validators.required, monthsValidRegex]],
    });
  }

  public onModalAction(event) {}

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    let dotAnimation = document.querySelector('.animation-three-tabs');
    this.animationObject = {
      value: this.selectedTab,
      params: { height: `${dotAnimation.getClientRects()[0].height}px` },
    };
  }

  // Department FormArray
  public get departmentContacts(): FormArray {
    return this.companyForm.get('departmentContact') as FormArray;
  }

  private createDepartmentContacts(): FormGroup {
    return this.formBuilder.group({
      departmentId: [null],
      phone: [null],
      extensionPhone: [null],
      email: [null],
    });
  }

  public addDepartmentContacts(event: any) {
    if (event) {
      this.departmentContacts.push(this.createDepartmentContacts());
    }
  }

  public removeDepartmentContacts(id: number) {
    this.departmentContacts.removeAt(id);
    this.selectedDepartmentFormArray.splice(id, 1);
  }

  public onSelectFakeTableData(event: any, index: number, action: string) {
    switch(action) {
      case 'department': {
        this.selectedDepartmentFormArray[index] = event;
        break;
      }
      case 'bank': {
        this.selectedBankAccountFormArray[index] = event;
        break;
      }
      default: {
        break;
      }
    }
  
  }

  // BankAccount FormArray

  public get bankAccounts(): FormArray {
    return this.companyForm.get('bankAccount') as FormArray;
  }

  private createBankAccount(): FormGroup {
    return this.formBuilder.group({
      bankId: [null],
      routing: [null],
      account: [null],
    });
  }

  public addBankAccount(event: any) {
    if (event) {
      this.bankAccounts.push(this.createBankAccount());
    }
  }

  public removeBankAccount(id: number) {
    this.bankAccounts.removeAt(id);
    this.selectedDepartmentFormArray.splice(id, 1);
  }

  public onSelectBankAccount(event: any, index: number) {
    this.selectedBankAccountFormArray[index] = event;
  }


  public onHandleAddress(event: any) {
    this.selectedAddress = event;
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'timezone': {
        this.selectedTimezone = event;
        break;
      }
      case 'currency': {
        this.selectedCurrency = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onUploadImage(event: any) {
    this.companyForm.get('avatar').patchValue(event);
  }

  public onPrefferedLoadCheck(event: any) {
    this.prefferedLoadBtns = [...event];
    this.prefferedLoadBtns.forEach((item) => {
      if (item.checked) {
        this.companyForm.get('preferredLoadType').patchValue(item.label);
      }
    });
  }

  ngOnDestroy(): void {}
}
