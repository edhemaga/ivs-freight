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
import {
  AddressEntity,
  CompanyModalResponse,
  UpdateCompanyCommand,
} from 'appcoretruckassist';
import { distinctUntilChanged } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Options } from '@angular-slider/ngx-slider';
import { TabSwitcherComponent } from 'src/app/core/components/switchers/tab-switcher/tab-switcher.component';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { DropZoneConfig } from 'src/app/core/components/shared/ta-modal-upload/ta-upload-dropzone/ta-upload-dropzone.component';
import { FormService } from 'src/app/core/services/form/form.service';
import { SettingsStoreService } from '../../../state/settings.service';

@Component({
  selector: 'app-settings-basic-modal',
  templateUrl: './settings-basic-modal.component.html',
  styleUrls: ['./settings-basic-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  providers: [ModalService, FormService],
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

  public tabsDevision: any[] = [
    {
      id: 1,
      name: 'Basic',
    },
    {
      id: 2,
      name: 'Additional',
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

  public dropZoneConfig: DropZoneConfig = {
    dropZoneType: 'image',
    dropZoneAvailableFiles: 'image/gif, image/jpeg, image/jpg, image/png',
    dropZoneSvg: 'assets/svg/common/ic_image_dropzone.svg',
    multiple: false,
    globalDropZone: true,
  };

  public isLogoDropZoneVisibile: boolean = false;

  // Basic Tab
  public selectedAddress: AddressEntity;
  public selectedTimeZone: any = null;
  public selectedCurrency: any = null;

  // Additional Tab
  public selectedDepartmentFormArray: any[] = [];
  public selectedBankAccountFormArray: any[] = [];
  public isBankFormArraySelected: any[] = [];
  public selectedBankCardFormArray: any[] = [];

  // Payroll tab
  public truckAssistText: string = "Use Truck Assist's ACH Payout";

  public isDirty: boolean;

  // Dropdowns

  public payPeriods: any[] = [];
  public endingIns: any[] = [];
  public timeZones: any[] = [];
  public currencies: any[] = [];
  public departments: any[] = [];
  public companyData: any[] = [];

  public selectedCompanyData: any = null;

  public selectedDriverPayPeriod: any = null;
  public selectedDriverEndingIn: any = null;
  public selectedAccountingPayPeriod: any = null;
  public selectedAccountingEndingIn: any = null;
  public selectedCompanyPayPeriod: any = null;
  public selectedCompanyEndingIn: any = null;
  public selectedDispatchPayPeriod: any = null;
  public selectedDispatchEndingIn: any = null;
  public selectedManagerPayPeriod: any = null;
  public selectedManagerEndingIn: any = null;
  public selectedRecPayPeriod: any = null;
  public selectedRecEndingIn: any = null;
  public selectedRepairPayPeriod: any = null;
  public selectedRepairEndingIn: any = null;
  public selectedSafetyPayPeriod: any = null;
  public selectedSafetyEndingIn: any = null;
  public selectedOtherPayPeriod: any = null;
  public selectedOtherEndingIn: any = null;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private formService: FormService,
    private settingsService: SettingsStoreService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getModalDropdowns();
    this.validateMiles();

    if (this.editData?.type === 'payroll-tab') {
      const timeout = setTimeout(() => {
        this.selectedTab = 3;
        this.tabSwitcher.activeTab = this.selectedTab;
        clearTimeout(timeout);
      }, 10);
    }

    if (this.editData.type === 'new-division') {
    } else {
      if (this.editData.company.divisions.length) {
        this.companyForm.patchValue({
          // -------------------- Basic Tab
          name: this.editData.company.name,
          usdot: this.editData.company.usdot,
          ein: this.editData.company.ein,
          mc: this.editData.company.mc,
          phone: this.editData.company.phone,
          email: this.editData.company.email,
          fax: this.editData.company.fax,
          webURL: this.editData.company.webURL,
          address: this.editData.company.address.address,
          addressUnit: this.editData.company.address.addressUnit,
          irp: this.editData.company.irp,
          ifta: this.editData.company.ifta,
          toll: this.editData.company.toll,
          scac: this.editData.company.scac,
          timeZone: this.editData.company.timeZone.name,
          currency: this.editData.company.currency.name,
          logo: this.editData.company.logo,
          //-------------------- Additional Tab
          departmentContact: [],
          bankAccount: [],
          bankCard: [],
          prefix: this.editData.company.additionalInfo.prefix,
          starting: this.editData.company.additionalInfo.starting,
          sufix: this.editData.company.additionalInfo.sufix,
          autoInvoicing: this.editData.company.additionalInfo.autoInvoicing,
          preferredLoadType:
            this.editData.company.additionalInfo.preferredLoadType,
          factorByDefault: this.editData.company.additionalInfo.factorByDefault,
          customerPayTerm: this.editData.company.additionalInfo.customerPayTerm,
          customerCredit: this.editData.company.additionalInfo.customerCredit,
          mvrMonths: this.editData.company.additionalInfo.mvrMonths,
          truckInspectionMonths:
            this.editData.company.additionalInfo.truckInspectionMonths,
          trailerInspectionMonths:
            this.editData.company.additionalInfo.trailerInspectionMonths,
          //-------------------- Payroll Tab
          useTruckAssist: this.editData.company.useACHPayout,
        });

        this.selectedAddress = this.editData.company.address;
        this.selectedTimeZone = this.editData.company.timeZone;
        this.selectedCurrency = this.editData.company.currency;

        if (this.editData.company.departmentContacts.length) {
          for (const department of this.editData.company.departmentContacts) {
            this.departments.push(
              this.formBuilder.group({
                departmentId: department.id,
                phone: department.phone,
                extensionPhone: department.extensionPhone,
                email: department.email,
              })
            );
          }
        }

        if (this.editData.company.bankAccounts.length) {
          for (const bank of this.editData.company.bankAccounts) {
            this.bankAccounts.push(
              this.formBuilder.group({
                bankId: bank.id,
                routing: bank.routing,
                account: bank.account,
              })
            );
          }
        }

        if (this.editData.company.bankCards.length) {
          for (const card of this.editData.company.bankCards) {
            this.bankCards.push(
              this.formBuilder.group({
                nickname: card.nickname,
                cardNumber: card.cardType,
                cvc: card.cvc,
                exp: card.expireDate,
              })
            );
          }
        }
      }
    }
  }

  private createForm() {
    this.companyForm = this.formBuilder.group({
      // Basic Tab
      name: [null, Validators.required],
      usdot: [null, Validators.required],
      ein: [null, einNumberRegex],
      mc: [null, Validators.maxLength(8)],
      phone: [null, phoneRegex],
      email: [null, emailRegex],
      fax: [null],
      webURL: [null],
      address: [null, Validators.required],
      addressUnit: [null, Validators.maxLength(6)],
      irp: [null],
      ifta: [null],
      toll: [null],
      scac: [null],
      timeZone: [null, Validators.required],
      currency: [null, Validators.required],
      companyType: [null],
      dateOfIncorporation: [null],
      logo: [null],
      // Additional Tab
      departmentContact: this.formBuilder.array([]),
      bankAccount: this.formBuilder.array([]),
      bankCard: this.formBuilder.array([]),
      prefix: [null],
      starting: [null, Validators.required],
      sufix: [null],
      autoInvoicing: [false],
      preferredLoadType: ['FTL'],
      factorByDefault: [false],
      customerPayTerm: [null, daysValidRegex],
      customerCredit: [null],
      mvrMonths: [12, [Validators.required, monthsValidRegex]],
      truckInspectionMonths: [12, [Validators.required, monthsValidRegex]],
      trailerInspectionMonths: [12, [Validators.required, monthsValidRegex]],
      // Payroll Tab
      useTruckAssist: [true],
      // Driver & Owner
      driveOwnerPayPeriod: ['Weekly', Validators.required],
      driverOwnerEndingIn: ['Monday', Validators.required],

      soloEmptyMile: [null],
      soloLoadedMile: [null],
      soloPerStop: [null],

      teamEmptyMile: [null],
      teamLoadedMile: [null],
      teamPerStop: [null],

      driverOwnerHasLoadedEmptyMiles: [false],
      driverSoloDefaultCommission: [25],
      driverTeamDefaultCommission: [25],
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

    this.formService.checkFormChange(this.companyForm);

    this.formService.formValueChange$
      .pipe(untilDestroyed(this))
      .subscribe((isFormChange: boolean) => {
        isFormChange ? (this.isDirty = false) : (this.isDirty = true);
      });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.companyForm.reset();
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.companyForm.invalid) {
          this.inputService.markInvalid(this.companyForm);
          return;
        }
        if (this.editData.company.divisions) {
          this.updateCompanyDevision(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.updateCompany();
          this.modalService.setModalSpinner({ action: null, status: true });
        }

        break;
      }
      case 'delete': {
        if (this.editData.company.divisions) {
          this.deleteCompanyDevisionById(this.editData.id);
          this.modalService.setModalSpinner({ action: 'delete', status: true });
        }
        break;
      }
      default: {
        break;
      }
    }
  }

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
        this.selectedTimeZone = event;
        break;
      }
      case 'currency': {
        this.selectedCurrency = event;
        break;
      }
      case 'driver-pay-period': {
        this.selectedDriverPayPeriod = event;
        break;
      }
      case 'driver-ending-in': {
        this.selectedDriverEndingIn = event;
        break;
      }
      case 'accounting-pay-period': {
        this.selectedAccountingPayPeriod = event;
      }
      case 'accounting-ending-in': {
        this.selectedAccountingEndingIn = event;
        break;
      }
      case 'companyOwner-pay-period': {
        this.selectedCompanyPayPeriod = event;
        break;
      }
      case 'companyOwner-ending-in': {
        this.selectedCompanyEndingIn = event;
        break;
      }
      case 'dispatch-pay-period': {
        this.selectedDispatchPayPeriod = event;
        break;
      }
      case 'dispatch-ending-in': {
        this.selectedDispatchEndingIn = event;
        break;
      }
      case 'manager-pay-period': {
        this.selectedManagerPayPeriod = event;
        break;
      }
      case 'manager-ending-in': {
        this.selectedManagerEndingIn = event;
        break;
      }
      case 'recruiting-pay-period': {
        this.selectedRecPayPeriod = event;
        break;
      }
      case 'recruiting-ending-in': {
        this.selectedRecEndingIn = event;
        break;
      }
      case 'repair-pay-period': {
        this.selectedRepairPayPeriod = event;
        break;
      }
      case 'repair-ending-in': {
        this.selectedRepairEndingIn = event;
        break;
      }
      case 'safety-pay-period': {
        this.selectedSafetyPayPeriod = event;
        break;
      }
      case 'safety-ending-in': {
        this.selectedSafetyEndingIn = event;
        break;
      }
      case 'other-pay-period': {
        this.selectedOtherPayPeriod = event;
        break;
      }
      case 'other-ending-in': {
        this.selectedOtherEndingIn = event;
        break;
      }
      case 'company-data': {
        this.selectedCompanyData = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  private validateMiles() {
    this.companyForm
      .get('soloEmptyMile')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value > 10) {
          this.companyForm.get('soloEmptyMile').setErrors({ invalid: true });
        } else {
          this.companyForm.get('soloEmptyMile').setErrors(null);
        }
      });

    this.companyForm
      .get('soloLoadedMile')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value > 10) {
          this.companyForm.get('soloLoadedMile').setErrors({ invalid: true });
        } else {
          this.companyForm.get('soloLoadedMile').setErrors(null);
        }
      });

    this.companyForm
      .get('soloPerStop')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value > 10) {
          this.companyForm.get('soloPerStop').setErrors({ invalid: true });
        } else {
          this.companyForm.get('soloPerStop').setErrors(null);
        }
      });

    this.companyForm
      .get('teamEmptyMile')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value > 10) {
          this.companyForm.get('teamEmptyMile').setErrors({ invalid: true });
        } else {
          this.companyForm.get('teamEmptyMile').setErrors(null);
        }
      });

    this.companyForm
      .get('teamLoadedMile')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value > 10) {
          this.companyForm.get('teamLoadedMile').setErrors({ invalid: true });
        } else {
          this.companyForm.get('teamLoadedMile').setErrors(null);
        }
      });

    this.companyForm
      .get('teamPerStop')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value > 10) {
          this.companyForm.get('teamPerStop').setErrors({ invalid: true });
        } else {
          this.companyForm.get('teamPerStop').setErrors(null);
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
    this.companyForm.get('logo').patchValue(event);
  }

  public onPrefferedLoadCheck(event: any) {
    this.prefferedLoadBtns = [...event];
    this.prefferedLoadBtns.forEach((item) => {
      if (item.checked) {
        this.companyForm.get('preferredLoadType').patchValue(item.label);
      }
    });
  }

  private getModalDropdowns() {
    this.settingsService
      .getCompanyModal()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CompanyModalResponse) => {
          this.payPeriods = res.payPeriods;
          this.endingIns = res.endingIns;
          this.timeZones = res.timeZones;
          this.currencies = res.currencies;
          this.departments = res.departments;

          this.selectedDriverPayPeriod = res.payPeriods[0];
          this.selectedDriverEndingIn = res.endingIns[0];
          this.selectedAccountingPayPeriod = res.payPeriods[0];
          this.selectedAccountingEndingIn = res.endingIns[0];
          this.selectedCompanyPayPeriod = res.payPeriods[0];
          this.selectedCompanyEndingIn = res.endingIns[0];
          this.selectedDispatchPayPeriod = res.payPeriods[0];
          this.selectedDispatchEndingIn = res.endingIns[0];
          this.selectedManagerPayPeriod = res.payPeriods[0];
          this.selectedManagerEndingIn = res.endingIns[0];
          this.selectedRecPayPeriod = res.payPeriods[0];
          this.selectedRecEndingIn = res.endingIns[0];
          this.selectedRepairPayPeriod = res.payPeriods[0];
          this.selectedRepairEndingIn = res.endingIns[0];
          this.selectedSafetyPayPeriod = res.payPeriods[0];
          this.selectedSafetyEndingIn = res.endingIns[0];
          this.selectedOtherPayPeriod = res.payPeriods[0];
          this.selectedOtherEndingIn = res.endingIns[0];
        },
        error: () => {
          this.notificationService.error(
            "Can't Load Settings Basic Dropdowns",
            'Error'
          );
        },
      });
  }

  public updateCompanyDevision(id: number) {}

  public updateCompany() {
    const { ...form } = this.companyForm.value;
    const newData: UpdateCompanyCommand = {
      ...form,
    };
  }

  public deleteCompanyDevisionById(id: number) {}

  ngOnDestroy(): void {}
}
