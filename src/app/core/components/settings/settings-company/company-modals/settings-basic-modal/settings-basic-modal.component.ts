import {
  accountBankRegex,
  bankRoutingValidator,
  daysValidRegex,
  emailRegex,
  monthsValidRegex,
  routingBankRegex,
} from './../../../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tab_modal_animation } from 'src/app/core/components/shared/animations/tabs-modal.animation';
import {
  einNumberRegex,
  phoneRegex,
} from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { AddressEntity } from 'appcoretruckassist';
import { distinctUntilChanged } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Options } from '@angular-slider/ngx-slider';
import { TabSwitcherComponent } from 'src/app/core/components/switchers/tab-switcher/tab-switcher.component';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';

@Component({
  selector: 'app-settings-basic-modal',
  templateUrl: './settings-basic-modal.component.html',
  styleUrls: ['./settings-basic-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
})
export class SettingsBasicModalComponent implements OnInit, OnDestroy {
  @ViewChild(TabSwitcherComponent) tabSwitcher: any;
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
      id: 322,
      label: 'FTL',
      value: 'FTL',
      name: 'credit',
      checked: true,
    },
    {
      id: 323,
      label: 'LTL',
      value: 'LTL',
      name: 'credit',
      checked: false,
    },
  ];

  public driverCommissionOptions: Options = {
    floor: 5,
    ceil: 50,
    step: 1,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  public ownerCommissionOptions: Options = {
    floor: 2,
    ceil: 30,
    step: 0.5,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  public commonOptions: Options = {
    floor: 2,
    ceil: 30,
    step: 0.5,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  public dispatcherOptions: Options = {
    floor: 0.1,
    ceil: 10,
    step: 0.1,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  public managerOptions: Options = {
    floor: 0.1,
    ceil: 5,
    step: 0.05,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public isLogoDropZoneVisibile: boolean = false;

  // Basic Tab
  public selectedAddress: AddressEntity;
  public selectedTimezone: any = null;
  public selectedCurrency: any = null;

  // Additional Tab
  public selectedDepartmentFormArray: any[] = [];
  public selectedBankAccountFormArray: any[] = [];
  public isBankFormArraySelected: any[] = [];
  public selectedBankCardFormArray: any[] = [];

  // Payroll tab
  public truckAssistText: string = "Use Truck Assist's ACH Payout";

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.validateMiles();
    if (this.editData?.type === 'payroll-tab') {
      const timeout = setTimeout(() => {
        this.selectedTab = 3;
        this.tabSwitcher.activeTab = this.selectedTab;
        clearTimeout(timeout);
      }, 10);
    }
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
      address: [null, Validators.required],
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
      bankCard: this.formBuilder.array([]),
      prefix: [null],
      startingNo: [null, Validators.required],
      suffix: [null],
      preferredLoadType: ['FTL'],
      autoInvoicing: [false],
      factorByDefault: [false],
      customerPayTerm: [null, daysValidRegex],
      customerCredit: [null],
      mvr: [12, [Validators.required, monthsValidRegex]],
      truckInspection: [12, [Validators.required, monthsValidRegex]],
      trailerInspection: [12, [Validators.required, monthsValidRegex]],
      // Payroll Tab
      useTruckAssist: [true],
      // Driver & Owner
      driveOwnerPayPeriod: ['Weekly', Validators.required],
      driverOwnerEndingIn: ['Monday', Validators.required],
      driverEmptyMile: [null],
      driverLoadedMile: [null],
      driverOwnerHasLoadedEmptyMiles: [false],
      driverDefaultCommission: [25],
      ownerDefaultCommission: [15],
      // Accounting
      accountingPayPeriod: ['Weekly', Validators.required],
      accountingEndingIn: ['Monday', Validators.required],
      accountingDefaultBase: [null],
      // Company Owner
      companyOwnerPayPeriod: ['Weekly', Validators.required],
      companyOwnerEndingIn: ['Monday', Validators.required],
      companyOwnerDefaultBase: [null],
      // Dispatch
      dispatchPayPeriod: ['Weekly', Validators.required],
      dispatchEndingIn: ['Monday', Validators.required],
      dispatchDefaultBase: [null],
      dispatchDefaultCommission: [5],
      // Manager
      managerPayPeriod: ['Weekly', Validators.required],
      managerEndingIn: ['Monday', Validators.required],
      managerDefaultBase: [null],
      managerDefaultCommission: [2.5],
      // Recruiting
      recruitingPayPeriod: ['Weekly', Validators.required],
      recruitingEndingIn: ['Monday', Validators.required],
      recruitingDefaultBase: [null],
      // Repair
      repairPayPeriod: ['Weekly', Validators.required],
      repairEndingIn: ['Monday', Validators.required],
      repairDefaultBase: [null],
      // Safety
      safetyPayPeriod: ['Weekly', Validators.required],
      safetyEndingIn: ['Monday', Validators.required],
      safetyDefaultBase: [null],
      // Other
      otherPayPeriod: ['Weekly', Validators.required],
      otherEndingIn: ['Monday', Validators.required],
      otherDefaultBase: [null],
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
      phone: [null, phoneRegex],
      extensionPhone: [null],
      email: [null, emailRegex],
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
    switch (action) {
      case 'department': {
        this.selectedDepartmentFormArray[index] = event;
        break;
      }
      case 'bankaccount': {
        this.selectedBankAccountFormArray[index] = event;
        this.onBankSelected(index);
        break;
      }
      case 'bankcard': {
        this.selectedBankCardFormArray[index] = event;
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
      routing: [null, routingBankRegex],
      account: [null, accountBankRegex],
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

  private onBankSelected(index: number): void {
    this.bankAccounts
      .at(index)
      .get('bankId')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.isBankFormArraySelected[index] = true;
          this.inputService.changeValidators(
            this.bankAccounts.at(index).get('routing'),
            true,
            routingBankRegex
          );
          this.routingNumberTyping(index);
          this.inputService.changeValidators(
            this.bankAccounts.at(index).get('account'),
            true,
            accountBankRegex
          );
        } else {
          this.isBankFormArraySelected[index] = false;
          this.inputService.changeValidators(
            this.bankAccounts.get('routing'),
            false
          );
          this.inputService.changeValidators(
            this.bankAccounts.at(index).get('account'),
            false
          );
        }
      });
  }

  private routingNumberTyping(index: number) {
    this.bankAccounts
      .at(index)
      .get('routing')
      .valueChanges.pipe(distinctUntilChanged(), untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          if (bankRoutingValidator(value)) {
            this.bankAccounts.at(index).get('routing').setErrors(null);
          } else {
            this.bankAccounts
              .at(index)
              .get('routing')
              .setErrors({ invalid: true });
          }
        }
      });
  }

  // Bank Card Form Array
  public get bankCards(): FormArray {
    return this.companyForm.get('bankCard') as FormArray;
  }

  private createBankCard(): FormGroup {
    return this.formBuilder.group({
      nickname: [null],
      cardNumber: [null, [Validators.minLength(16), Validators.maxLength(16)]],
      cvc: [null, [Validators.minLength(3), Validators.maxLength(3)]],
      exp: [null],
    });
  }

  public addBankCard(event: any) {
    if (event) {
      this.bankCards.push(this.createBankCard());
    }
  }

  public removeBankCard(id: number) {
    this.bankCards.removeAt(id);
    this.selectedBankCardFormArray.splice(id, 1);
  }

  public onHandleAddress(event: {
    address: AddressEntity | any;
    valid: boolean;
  }) {
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

  private validateMiles() {
    this.companyForm
      .get('driverLoadedMile')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value > 10) {
          this.companyForm.get('driverLoadedMile').setErrors({ invalid: true });
        } else {
          this.companyForm.get('driverLoadedMile').setErrors(null);
        }
      });

    this.companyForm
      .get('driverEmptyMile')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value > 10) {
          this.companyForm.get('driverEmptyMile').setErrors({ invalid: true });
        } else {
          this.companyForm.get('driverEmptyMile').setErrors(null);
        }
      });
  }

  public useTruckAssist(event: any) {
    if (this.companyForm.get('useTruckAssist').value) {
      event.preventDefault();
      event.stopPropagation();
      this.companyForm.get('useTruckAssist').setValue(false);
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
