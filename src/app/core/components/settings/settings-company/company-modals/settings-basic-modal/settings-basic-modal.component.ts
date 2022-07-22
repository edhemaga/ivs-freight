import { convertDateToBackend } from './../../../../../utils/methods.calculations';
import {
  accountBankRegex,
  bankRoutingValidator,
  daysValidRegex,
  emailRegex,
  mileValidation,
  monthsValidRegex,
  perStopValidation,
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
  CompanyResponse,
  CreateDivisionCompanyCommand,
  CreateResponse,
  UpdateCompanyCommand,
} from 'appcoretruckassist';
import { distinctUntilChanged } from 'rxjs';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Options } from '@angular-slider/ngx-slider';
import { TabSwitcherComponent } from 'src/app/core/components/switchers/tab-switcher/tab-switcher.component';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { DropZoneConfig } from 'src/app/core/components/shared/ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { FormService } from 'src/app/core/services/form/form.service';
import { SettingsStoreService } from '../../../state/settings.service';
import { convertDateFromBackend } from 'src/app/core/utils/methods.calculations';

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

  public tabsDivision: any[] = [
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

    if (['new-division', 'edit-division'].includes(this.editData.type)) {
      this.createDivisionForm();
    }

    if (this.editData?.type === 'payroll-tab') {
      const timeout = setTimeout(() => {
        this.selectedTab = 3;
        this.tabSwitcher.activeTab = this.selectedTab;
        clearTimeout(timeout);
      }, 10);
    }

    if (this.editData.type === 'new-division') {
    } else {
      if (this.editData.type === 'edit-company') {
        this.editCompany();
      } else {
        // Edit Division
        this.editCompanyDivision();
      }
    }
  }

  private createDivisionForm() {
    this.inputService.changeValidators(this.companyForm.get('starting'), false);
    this.inputService.changeValidators(this.companyForm.get('usDot'), false);
    this.inputService.changeValidators(this.companyForm.get('timeZone'), false);
    this.inputService.changeValidators(this.companyForm.get('currency'), false);
    this.inputService.changeValidators(
      this.companyForm.get('mvrMonths'),
      false
    );
    this.inputService.changeValidators(
      this.companyForm.get('truckInspectionMonths'),
      false
    );
    this.inputService.changeValidators(
      this.companyForm.get('trailerInspectionMonths'),
      false
    );
  }

  private createForm() {
    this.companyForm = this.formBuilder.group({
      //----------------- Basic Tab
      name: [null, Validators.required],
      usDot: [null, Validators.required],
      ein: [null, einNumberRegex],
      mc: [null, Validators.maxLength(8)],
      phone: [null, phoneRegex],
      email: [null, emailRegex],
      fax: [null],
      webUrl: [null],
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
      //------------------ Additional Tab
      departmentContacts: this.formBuilder.array([]),
      bankAccounts: this.formBuilder.array([]),
      bankCards: this.formBuilder.array([]),
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
      //------------------ Payroll Tab
      useACHPayout: [true],
      // Driver & Owner
      driveOwnerPayPeriod: ['Weekly', Validators.required],
      driverOwnerEndingIn: ['Monday', Validators.required],

      soloEmptyMile: [null, mileValidation],
      soloLoadedMile: [null, mileValidation],
      soloPerStop: [null, perStopValidation],

      teamEmptyMile: [null, mileValidation],
      teamLoadedMile: [null, mileValidation],
      teamPerStop: [null, perStopValidation],

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
        if (!this.editData.company?.divisions.length) {
          if (this.editData.type === 'new-division') {
            this.addCompanyDivision();
          } else {
            this.updateCompanyDivision(this.editData.id);
            this.modalService.setModalSpinner({ action: null, status: true });
          }
        } else {
          this.updateCompany();
          this.modalService.setModalSpinner({ action: null, status: true });
        }

        break;
      }
      case 'delete': {
        if (!this.editData.company?.divisions.length) {
          this.deleteCompanyDivisionById(this.editData.id);
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
    return this.companyForm.get('departmentContacts') as FormArray;
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
      case 'bankAccounts': {
        this.selectedBankAccountFormArray[index] = event;
        this.onBankSelected(index);
        break;
      }
      default: {
        break;
      }
    }
  }

  // bankAccounts FormArray
  public get bankAccounts(): FormArray {
    return this.companyForm.get('bankAccounts') as FormArray;
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
    return this.companyForm.get('bankCards') as FormArray;
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
    this.selectedAddress = event.address;
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

  public useACHPayout(event: any) {
    if (this.companyForm.get('useACHPayout').value) {
      event.preventDefault();
      event.stopPropagation();
      this.companyForm.get('useACHPayout').setValue(false);
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
          this.companyData = res.companyTypes;

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

  public addCompanyDivision() {
    const {
      address,
      addressUnit,
      timeZone,
      currency,
      companyType,
      dateOfIncorporation,
      departmentContacts,
      bankAccounts,
      driveOwnerPayPeriod,
      driverOwnerEndingIn,
      soloEmptyMile,
      soloLoadedMile,
      soloPerStop,
      teamEmptyMile,
      teamLoadedMile,
      teamPerStop,
      driverOwnerHasLoadedEmptyMiles,
      driverSoloDefaultCommission,
      driverTeamDefaultCommission,
      ownerDefaultCommission,
      // Accounting
      accountingPayPeriod,
      accountingEndingIn,
      accountingDefaultBase,
      // Company Owner
      companyOwnerPayPeriod,
      companyOwnerEndingIn,
      companyOwnerDefaultBase,
      // Dispatch
      dispatchPayPeriod,
      dispatchEndingIn,
      dispatchDefaultBase,
      dispatchDefaultCommission,
      // Manager
      managerPayPeriod,
      managerEndingIn,
      managerDefaultBase,
      managerDefaultCommission,
      // Recruiting
      recruitingPayPeriod,
      recruitingEndingIn,
      recruitingDefaultBase,
      // Repair
      repairPayPeriod,
      repairEndingIn,
      repairDefaultBase,
      // Safety
      safetyPayPeriod,
      safetyEndingIn,
      safetyDefaultBase,
      // Other
      otherPayPeriod,
      otherEndingIn,
      otherDefaultBase,

      ...form
    } = this.companyForm.value;
    console.log(this.selectedAddress);
    let newData: CreateDivisionCompanyCommand = {
      ...form,
      address: {
        ...this.selectedAddress,
        addressUnit: this.companyForm.get('addressUnit').value,
      },
      timeZone: this.selectedTimeZone ? this.selectedTimeZone.id : null,
      currency: this.selectedCurrency ? this.selectedCurrency.id : null,
    };

    for (let index = 0; index < departmentContacts; index++) {
      departmentContacts[index].departmentId =
        this.selectedDepartmentFormArray[index].id;
    }

    for (let index = 0; index < bankAccounts.length; index++) {
      bankAccounts[index].id = this.selectedBankAccountFormArray[index].id;
    }

    this.settingsService
      .addCompanyDivision(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CreateResponse) => {
          this.notificationService.success(
            'Successfully added company division',
            'Success'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Can't add company division", 'Error');
        },
      });
    console.log(newData);
  }

  private editCompanyDivision() {
    this.settingsService
      .getCompanyDivisionById(this.editData.company.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CompanyResponse) => {
          this.companyForm.patchValue({
            // -------------------- Basic Tab
            name: this.editData.company.name,
            usDot: this.editData.company.usDot,
            ein: this.editData.company.ein,
            mc: this.editData.company.mc,
            phone: this.editData.company.phone,
            email: this.editData.company.email,
            fax: this.editData.company.fax,
            webUrl: this.editData.company.webUrl,
            address: this.editData.company.address.address,
            addressUnit: this.editData.company.address.addressUnit,
            irp: this.editData.company.irp,
            ifta: this.editData.company.ifta,
            toll: this.editData.company.toll,
            scac: this.editData.company.scac,
            timeZone: this.editData.company.timeZone.name,
            currency: this.editData.company.currency.name,
            companyType: this.editData.company.companyType.name,
            dateOfIncorporation: this.editData.company.dateOfIncorporation
              ? convertDateFromBackend(
                  this.editData.company.dateOfIncorporation
                )
              : null,
            logo: this.editData.company.logo,
          });

          this.selectedAddress = this.editData.company.address;
          this.selectedTimeZone = this.editData.company.timeZone;
          this.selectedCompanyData = this.editData.company.companyType;
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
                  exp: card.expireDate
                    ? convertDateFromBackend(card.expireDate)
                    : null,
                })
              );
            }
          }
        },
        error: () => {
          this.notificationService.error(
            "Can't Load Division Company",
            'Error'
          );
        },
      });
  }

  public updateCompanyDivision(id: number) {}

  public deleteCompanyDivisionById(id: number) {
    this.settingsService
      .deleteCompanyDivisionById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully delete company division',
            'SUCCESS'
          );
        },
        error: () => {
          this.notificationService.error(
            "Can't delete company division",
            'Error'
          );
        },
      });
  }

  public updateCompany() {
    const {
      address,
      addressUnit,
      timeZone,
      currency,
      companyType,
      dateOfIncorporation,
      departmentContacts,
      bankAccounts,
      ...form
    } = this.companyForm.value;

    let newData: UpdateCompanyCommand = {
      ...form,
      address: {
        ...this.selectedAddress,
        addressUnit: this.companyForm.get('addressUnit').value,
      },
      timeZone: this.selectedTimeZone ? this.selectedTimeZone.id : null,
      currency: this.selectedCurrency ? this.selectedCurrency.id : null,
      companyType: this.selectedCompanyData
        ? this.selectedCompanyData.id
        : null,
      dateOfIncorporation: dateOfIncorporation
        ? convertDateToBackend(dateOfIncorporation)
        : null,
    };

    for (let index = 0; index < departmentContacts; index++) {
      departmentContacts[index].departmentId =
        this.selectedDepartmentFormArray[index].id;
    }

    for (let index = 0; index < bankAccounts.length; index++) {
      bankAccounts[index].id = this.selectedBankAccountFormArray[index].id;
    }

    const driverPayroll = {
      departmentId: null,
      payPeriod: this.companyForm.get('driveOwnerPayPeriod').value,
      endingIn: this.companyForm.get('driverOwnerEndingIn').value,
      soloEmptyMile: this.companyForm.get('soloEmptyMile').value,
      soloLoadedMile: this.companyForm.get('soloLoadedMile').value,
      soloPerStop: this.companyForm.get('soloPerStop').value,
      teamEmptyMile: this.companyForm.get('teamEmptyMile').value,
      teamLoadedMile: this.companyForm.get('teamLoadedMile').value,
      teamPerStop: this.companyForm.get('teamPerStop').value,
      defaultSoloDriverCommission: this.companyForm.get(
        'driverSoloDefaultCommission'
      ).value,
      defaultTeamDriverCommission: this.companyForm.get(
        'driverTeamDefaultCommission'
      ).value,
      defaultOwnerCommission: this.companyForm.get('ownerDefaultCommission')
        .value,
      loadedAndEmptySameRate: this.companyForm.get(
        'driverOwnerHasLoadedEmptyMiles'
      ).value,
    };

    const accountingPayroll = {
      departmentId: 1,
      payPeriod: this.companyForm.get('accountingPayPeriod').value,
      endingIn: this.companyForm.get('accountingEndingIn').value,
      defaultBase: this.companyForm.get('accountingDefaultBase').value,
    };

    const dispatchPayroll = {
      departmentId: 2,
      payPeriod: this.companyForm.get('dispatchPayPeriod').value,
      endingIn: this.companyForm.get('dispatchEndingIn').value,
      defaultBase: this.companyForm.get('dispatchDefaultBase').value,
      defaultCommission: this.companyForm.get('dispatchDefaultCommission')
        .value,
    };

    const recruitingPayroll = {
      departmentId: 3,
      payPeriod: this.companyForm.get('recruitingPayPeriod').value,
      endingIn: this.companyForm.get('recruitingEndingIn').value,
      defaultBase: this.companyForm.get('recruitingDefaultBase').value,
    };

    const repairPayroll = {
      departmentId: 4,
      payPeriod: this.companyForm.get('repairPayPeriod').value,
      endingIn: this.companyForm.get('repairEndingIn').value,
      defaultBase: this.companyForm.get('repairDefaultBase').value,
    };

    const safetyPayroll = {
      departmentId: 5,
      payPeriod: this.companyForm.get('safetyPayPeriod').value,
      endingIn: this.companyForm.get('safetyEndingIn').value,
      defaultBase: this.companyForm.get('safetyDefaultBase').value,
    };

    const companyOwnerPayroll = {
      // Company Owner
      departmentId: 6,
      payPeriod: this.companyForm.get('companyOwnerPayPeriod').value,
      endingIn: this.companyForm.get('companyOwnerEndingIn').value,
      defaultBase: this.companyForm.get('companyOwnerDefaultBase').value,
    };

    const managerPayroll = {
      departmentId: 7,
      payPeriod: this.companyForm.get('managerPayPeriod').value,
      endingIn: this.companyForm.get('managerEndingIn').value,
      defaultBase: this.companyForm.get('managerDefaultBase').value,
      defaultCommission: this.companyForm.get('managerDefaultCommission').value,
    };

    const otherPayroll = {
      departmentId: 9,
      payPeriod: this.companyForm.get('otherPayPeriod').value,
      endingIn: this.companyForm.get('otherEndingIn').value,
      defaultBase: this.companyForm.get('otherDefaultBase').value,
    };

    const payrolls: any = [
      driverPayroll,
      accountingPayroll,
      dispatchPayroll,
      recruitingPayroll,
      repairPayroll,
      safetyPayroll,
      companyOwnerPayroll,
      managerPayroll,
      otherPayroll,
    ];

    newData = {
      ...newData,
      bankAccounts,
      departmentContacts,
      payrolls,
    };

    console.log(newData);
  }

  private editCompany() {
    this.companyForm.patchValue({
      // -------------------- Basic Tab
      name: this.editData.company.name,
      usDot: this.editData.company.usDot,
      ein: this.editData.company.ein,
      mc: this.editData.company.mc,
      phone: this.editData.company.phone,
      email: this.editData.company.email,
      fax: this.editData.company.fax,
      webUrl: this.editData.company.webUrl,
      address: this.editData.company.address.address,
      addressUnit: this.editData.company.address.addressUnit,
      irp: this.editData.company.irp,
      ifta: this.editData.company.ifta,
      toll: this.editData.company.toll,
      scac: this.editData.company.scac,
      timeZone: this.editData.company.timeZone.name,
      currency: this.editData.company.currency.name,
      companyType: this.editData.company.companyType.name,
      dateOfIncorporation: this.editData.company.dateOfIncorporation
        ? convertDateFromBackend(this.editData.company.dateOfIncorporation)
        : null,
      logo: this.editData.company.logo,
      //-------------------- Additional Tab
      departmentContacts: [],
      bankAccounts: [],
      bankCards: [],
      prefix: this.editData.company.additionalInfo.prefix,
      starting: this.editData.company.additionalInfo.starting,
      sufix: this.editData.company.additionalInfo.sufix,
      autoInvoicing: this.editData.company.additionalInfo.autoInvoicing,
      preferredLoadType: this.editData.company.additionalInfo.preferredLoadType,
      factorByDefault: this.editData.company.additionalInfo.factorByDefault,
      customerPayTerm: this.editData.company.additionalInfo.customerPayTerm,
      customerCredit: this.editData.company.additionalInfo.customerCredit,
      mvrMonths: this.editData.company.additionalInfo.mvrMonths,
      truckInspectionMonths:
        this.editData.company.additionalInfo.truckInspectionMonths,
      trailerInspectionMonths:
        this.editData.company.additionalInfo.trailerInspectionMonths,
      //-------------------- Payroll Tab
      useACHPayout: this.editData.company.useACHPayout,
    });

    this.selectedAddress = this.editData.company.address;
    this.selectedTimeZone = this.editData.company.timeZone;
    this.selectedCompanyData = this.editData.company.companyType;
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
            exp: card.expireDate
              ? convertDateFromBackend(card.expireDate)
              : null,
          })
        );
      }
    }

    if (this.editData.company.companyPayrolls.length) {
      for (const payroll of this.editData.company.companyPayrolls) {
        switch (payroll.department.id) {
          case 1: {
            // Accounting
            this.companyForm
              .get('accountingPayPeriod')
              .patchValue(payroll.payPeriod.name);
            this.companyForm
              .get('accountingEndingIn')
              .patchValue(payroll.endingIn.name);
            this.companyForm
              .get('accountingDefaultBase')
              .patchValue(payroll.defaultBase);
            break;
          }
          case 2: {
            // Dispatcher
            this.companyForm
              .get('dispatchPayPeriod')
              .patchValue(payroll.payPeriod.name);
            this.companyForm
              .get('dispatchEndingIn')
              .patchValue(payroll.endingIn.name);
            this.companyForm
              .get('dispatchDefaultBase')
              .patchValue(payroll.defaultBase);
            this.companyForm
              .get('dispatchDefaultCommission')
              .patchValue(payroll.defaultCommission);
            break;
          }
          case 3: {
            // Recruiting
            this.companyForm
              .get('recruitingPayPeriod')
              .patchValue(payroll.payPeriod.name);
            this.companyForm
              .get('recruitingEndingIn')
              .patchValue(payroll.endingIn.name);
            this.companyForm
              .get('recruitingDefaultBase')
              .patchValue(payroll.defaultBase);
            break;
          }
          case 4: {
            // Repair
            this.companyForm
              .get('repairPayPeriod')
              .patchValue(payroll.payPeriod.name);
            this.companyForm
              .get('repairEndingIn')
              .patchValue(payroll.endingIn.name);
            this.companyForm
              .get('repairDefaultBase')
              .patchValue(payroll.defaultBase);
            break;
          }
          case 5: {
            // Safety
            this.companyForm
              .get('safetyPayPeriod')
              .patchValue(payroll.payPeriod.name);
            this.companyForm
              .get('safetyEndingIn')
              .patchValue(payroll.endingIn.name);
            this.companyForm
              .get('safetyDefaultBase')
              .patchValue(payroll.defaultBase);
            break;
          }
          case 7: {
            // Manager
            this.companyForm
              .get('managerPayPeriod')
              .patchValue(payroll.payPeriod.name);
            this.companyForm
              .get('managerEndingIn')
              .patchValue(payroll.endingIn.name);
            this.companyForm
              .get('managerDefaultBase')
              .patchValue(payroll.defaultBase);
            this.companyForm
              .get('managerDefaultCommission')
              .patchValue(payroll.defaultCommission);
            break;
            break;
          }
          case 8: {
            // Owner
            this.companyForm
              .get('companyOwnerPayPeriod')
              .patchValue(payroll.payPeriod.name);
            this.companyForm
              .get('companyOwnerEndingIn')
              .patchValue(payroll.endingIn.name);
            this.companyForm
              .get('companyOwnerDefaultBase')
              .patchValue(payroll.defaultBase);
            break;
            break;
          }
          case 9: {
            // Other
            this.companyForm
              .get('otherPayPeriod')
              .patchValue(payroll.payPeriod.name);
            this.companyForm
              .get('otherEndingIn')
              .patchValue(payroll.endingIn.name);
            this.companyForm
              .get('otherDefaultBase')
              .patchValue(payroll.defaultBase);
            break;
          }
          default: {
            break;
          }
        }
      }
    }
  }

  ngOnDestroy(): void {}
}
