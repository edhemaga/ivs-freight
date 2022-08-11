import {
  convertDateFromBackend,
  convertDateToBackend,
  convertThousanSepInNumber,
} from './../../../../../utils/methods.calculations';
import {
  daysValidRegex,
  emailRegex,
  mileValidation,
  monthsValidRegex,
  perStopValidation,
} from './../../../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
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
  CreateDivisionCompanyCommand,
  CreateResponse,
  UpdateCompanyCommand,
  UpdateDivisionCompanyCommand,
} from 'appcoretruckassist';
import { debounceTime, distinctUntilChanged } from 'rxjs';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Options } from '@angular-slider/ngx-slider';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { DropZoneConfig } from 'src/app/core/components/shared/ta-upload-files/ta-upload-dropzone/ta-upload-dropzone.component';
import { FormService } from 'src/app/core/services/form/form.service';
import { SettingsCompanyService } from '../../../state/company-state/settings-company.service';
import { convertNumberInThousandSep } from 'src/app/core/utils/methods.calculations';
import { BankVerificationService } from 'src/app/core/services/bank-verification/bankVerification.service';

@UntilDestroy()
@Component({
  selector: 'app-settings-basic-modal',
  templateUrl: './settings-basic-modal.component.html',
  styleUrls: ['./settings-basic-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  providers: [ModalService, FormService, BankVerificationService],
})
export class SettingsBasicModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public companyForm: FormGroup;

  public selectedTab: number = 1;
  public tabs: any[] = [
    {
      id: 1,
      name: 'Basic',
      checked: true,
    },
    {
      id: 2,
      name: 'Additional',
      checked: false,
    },
    {
      id: 3,
      name: 'Payroll',
      checked: false,
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

  public prefferedLoadBtns: any[] = [
    {
      id: 1,
      name: 'FTL',
      checked: true,
    },
    {
      id: 2,
      name: 'LTL',
      checked: false,
    },
  ];

  public fleetTypeBtns: any[] = [
    {
      id: 1,
      name: 'Solo',
      checked: true,
    },
    {
      id: 2,
      name: 'Team',
      checked: false,
    },
    { id: 3, name: 'Combined', checked: false },
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
  public isBankSelectedFormArray: boolean[] = [];

  // Payroll tab
  public truckAssistText: string = "Use Truck Assist's ACH Payout";

  public isDirty: boolean;

  // Dropdowns
  public banks: any[] = [];
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

  public selectedFleetType: string = null;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private formService: FormService,
    private settingsCompanyService: SettingsCompanyService,
    private bankVerificationService: BankVerificationService
  ) {}

  ngOnInit(): void {
    this.checkForCompany();
    this.onPrefferedLoadCheck({ name: 'FTL' });
    this.onFleetTypeCheck({ id: 1 });
    this.getModalDropdowns();
    this.validateMiles();
    this.onSamePerMileCheck();
  }

  private checkForCompany() {
    this.createForm();
    if (['new-division', 'edit-division'].includes(this.editData.type)) {
      this.createDivisionForm();

      if (this.editData.type === 'edit-division') {
        this.editCompanyDivision();
      }
    }

    if (this.editData.type === 'edit-company') {
      const timeout = setTimeout(() => {
        this.editCompany();
        clearTimeout(timeout);
      }, 150);
    }

    if (this.editData?.type === 'payroll-tab') {
      this.tabChange({ id: 3 });
      const timeout = setTimeout(() => {
        this.editCompany();
        clearTimeout(timeout);
      }, 150);
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
      fleetType: ['Solo'],
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
      perMileSolo: [null, mileValidation],

      teamEmptyMile: [null, mileValidation],
      teamLoadedMile: [null, mileValidation],
      teamPerStop: [null, perStopValidation],
      perMileTeam: [null, mileValidation],

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

    // this.formService.checkFormChange(this.companyForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
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
            this.modalService.setModalSpinner({ action: null, status: true });
          } else {
            this.updateCompanyDivision(this.editData.company.id);
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

    this.tabs = this.tabs.map((item) => {
      return {
        ...item,
        checked: item.id === event.id,
      };
    });
  }

  // Department FormArray
  public get departmentContacts(): FormArray {
    return this.companyForm.get('departmentContacts') as FormArray;
  }

  private createDepartmentContacts(data?: {
    id: any;
    departmentId: any;
    phone: any;
    extensionPhone: any;
    email: any;
  }): FormGroup {
    return this.formBuilder.group({
      id: [data?.id ? data.id : 0],
      departmentId: [
        data?.departmentId ? data?.departmentId : null,
        Validators.required,
      ],
      phone: [
        data?.phone ? data?.phone : null,
        [Validators.required, phoneRegex],
      ],
      extensionPhone: [data?.extensionPhone ? data?.extensionPhone : null],
      email: [
        data?.email ? data?.email : null,
        [Validators.required, emailRegex],
      ],
    });
  }

  public addDepartmentContacts(event: { check: boolean; action: string }) {
    if (event.check) {
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
        this.isBankSelectedFormArray[index] = true;
        this.onBankSelected(index);
        break;
      }
      default: {
        break;
      }
    }
  }

  public onSaveNewBank(bank: any, index: number) {
    this.selectedBankAccountFormArray[index] = event;
    this.isBankSelectedFormArray[index] = true;
    this.onBankSelected(index);

    this.bankVerificationService
      .createBank({ name: bank.name })
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CreateResponse) => {
          this.notificationService.success(
            'Successfuly add new bank',
            'Success'
          );
          this.selectedBankAccountFormArray[index] = {
            id: res.id,
            name: bank.name,
          };
        },
        error: (err) => {
          this.notificationService.error("Can't add new bank", 'Error');
        },
      });
  }

  // bankAccounts FormArray
  public get bankAccounts(): FormArray {
    return this.companyForm.get('bankAccounts') as FormArray;
  }

  private createBankAccount(data?: {
    id: any;
    bankId: any;
    routing: any;
    account: any;
  }): FormGroup {
    return this.formBuilder.group({
      id: [data?.id ? data.id : 0],
      bankId: [data?.bankId ? data.bankId : null],
      routing: [data?.routing ? data.routing : null],
      account: [data?.account ? data.account : null],
    });
  }

  public addBankAccount(event: { check: boolean; action: string }) {
    if (event.check) {
      this.bankAccounts.push(this.createBankAccount());
    }
  }

  public removeBankAccount(id: number) {
    this.bankAccounts.removeAt(id);
    this.selectedBankAccountFormArray.splice(id, 1);
    this.isBankSelectedFormArray.splice(id, 1);
  }

  private onBankSelected(index: number): void {
    this.bankAccounts
      .at(index)
      .valueChanges.pipe(
        debounceTime(150),
        distinctUntilChanged(),
        untilDestroyed(this)
      )
      .subscribe((value) => {
        this.isBankSelectedFormArray[index] =
          this.bankVerificationService.onSelectBank(
            value,
            this.bankAccounts.at(index).get('routing'),
            this.bankAccounts.at(index).get('account')
          );
      });
  }

  // Bank Card Form Array
  public get bankCards(): FormArray {
    return this.companyForm.get('bankCards') as FormArray;
  }

  private createBankCard(data?: {
    id: any;
    nickname: any;
    card: any;
    cvc: any;
    expireDate: any;
  }): FormGroup {
    return this.formBuilder.group({
      id: [data?.id ? data.id : 0],
      nickname: [data?.nickname ? data.nickname : null],
      card: [
        data?.card ? data.card : null,
        [Validators.minLength(16), Validators.maxLength(16)],
      ],
      cvc: [
        data?.cvc ? data.cvc : null,
        [Validators.minLength(3), Validators.maxLength(3)],
      ],
      expireDate: [data?.expireDate ? data.expireDate : null],
    });
  }

  public addBankCard(event: { check: boolean; action: string }) {
    if (event.check) {
      this.bankCards.push(this.createBankCard());
    }
  }

  public removeBankCard(id: number) {
    this.bankCards.removeAt(id);
  }

  public onHandleAddress(event: {
    address: AddressEntity | any;
    valid: boolean;
  }) {
    if (event.valid) this.selectedAddress = event.address;
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

  public onUploadImage(event: any) {
    this.companyForm.get('logo').patchValue(event);
    this.companyForm.get('logo').setErrors(null);
  }

  public onImageValidation(event: boolean) {
    if (!event) {
      this.companyForm.get('logo').setErrors({ invalid: true });
    } else {
      this.inputService.changeValidators(this.companyForm.get('logo'), false);
    }
  }

  public onPrefferedLoadCheck(event: any) {
    this.prefferedLoadBtns = this.prefferedLoadBtns.map((item) => {
      if (item.name === event.name) {
        this.companyForm.get('preferredLoadType').patchValue(item.name);
      }
      return {
        ...item,
        checked: item.id === event.id,
      };
    });
  }

  public onFleetTypeCheck(event: any) {
    this.fleetTypeBtns = this.fleetTypeBtns.map((item) => {
      if (item.id === event.id) {
        this.companyForm.get('fleetType').patchValue(item.name);
      }
      if (item.id === event.id) {
        this.selectedFleetType = item.name;
      }
      return {
        ...item,
        checked: item.id === event.id,
      };
    });
  }

  public onSamePerMileCheck() {
    this.companyForm
      .get('driverOwnerHasLoadedEmptyMiles')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((val) => {
        if (val) {
          if (this.selectedFleetType === 'Solo') {
            if (this.companyForm.get('soloEmptyMile').value) {
              this.companyForm
                .get('perMileSolo')
                .patchValue(this.companyForm.get('soloEmptyMile').value);
              this.companyForm.get('soloEmptyMile').patchValue(null);
              this.companyForm.get('soloLoadedMile').patchValue(null);
            } else {
              this.companyForm.get('perMileSolo').patchValue(null);
            }
          } else if (this.selectedFleetType === 'Team') {
            if (this.companyForm.get('teamEmptyMile').value) {
              this.companyForm
                .get('perMileTeam')
                .patchValue(this.companyForm.get('teamEmptyMile').value);
              this.companyForm.get('teamEmptyMile').patchValue(null);
              this.companyForm.get('teamLoadedMile').patchValue(null);
            } else {
              this.companyForm.get('perMileTeam').patchValue(null);
            }
          } else {
            if (this.companyForm.get('soloEmptyMile').value) {
              this.companyForm
                .get('perMileSolo')
                .patchValue(this.companyForm.get('soloEmptyMile').value);
              this.companyForm.get('soloEmptyMile').patchValue(null);
              this.companyForm.get('soloLoadedMile').patchValue(null);
            } else {
              this.companyForm.get('perMileSolo').patchValue(null);
            }

            if (this.companyForm.get('teamEmptyMile').value) {
              this.companyForm
                .get('perMileTeam')
                .patchValue(this.companyForm.get('teamEmptyMile').value);
              this.companyForm.get('teamEmptyMile').patchValue(null);
              this.companyForm.get('teamLoadedMile').patchValue(null);
            } else {
              this.companyForm.get('perMileTeam').patchValue(null);
            }
          }
        } else {
          this.companyForm.get('soloEmptyMile').patchValue(null);
          this.companyForm.get('soloLoadedMile').patchValue(null);
          this.companyForm.get('perMileSolo').patchValue(null);

          this.companyForm.get('teamEmptyMile').patchValue(null);
          this.companyForm.get('teamLoadedMile').patchValue(null);
          this.companyForm.get('perMileTeam').patchValue(null);
        }
      });
  }

  private getModalDropdowns() {
    this.settingsCompanyService
      .getCompanyModal()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CompanyModalResponse) => {
          this.banks = res.banks;
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
      addressUnit,
      timeZone,
      currency,
      departmentContacts,
      bankAccounts,
      bankCards,
      //----- Exclude Properties From Company Division -----
      companyType,
      dateOfIncorporation,
      prefix,
      starting,
      sufix,
      customerPayTerm,
      customerCredit,
      mvrMonths,
      trailerInspectionMonths,
      truckInspectionMonths,
      preferredLoadType,
      autoInvoicing,
      factorByDefault,
      //----- Whole Payroll tab
      useACHPayout,
      // Driver & Owner
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

    let newData: CreateDivisionCompanyCommand = {
      ...form,
      address: {
        ...this.selectedAddress,
        addressUnit: addressUnit,
      },
      timeZone: this.selectedTimeZone ? this.selectedTimeZone.id : null,
      currency: this.selectedCurrency ? this.selectedCurrency.id : null,
    };

    for (let index = 0; index < departmentContacts.length; index++) {
      departmentContacts[index].departmentId =
        this.selectedDepartmentFormArray[index].id;
    }

    for (let index = 0; index < bankAccounts.length; index++) {
      bankAccounts[index].bankId = this.selectedBankAccountFormArray[index].id;
    }

    for (let index = 0; index < bankCards.length; index++) {
      bankCards[index].expireDate = convertDateToBackend(
        bankCards[index].expireDate
      );
    }

    newData = {
      ...newData,
      departmentContacts,
      bankAccounts,
      bankCards,
    };

    this.settingsCompanyService
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
  }

  private editCompanyDivision() {
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
      timeZone: this.editData.company.timeZone.name
        ? this.editData.company.timeZone.name
        : null,
      currency: this.editData.company.currency.name
        ? this.editData.company.currency.name
        : null,
      logo: this.editData.company.logo,
    });

    this.selectedAddress = this.editData.company.address;

    this.selectedTimeZone =
      this.editData.company.timeZone.id !== 0
        ? this.editData.company.timeZone
        : null;

    this.selectedCurrency =
      this.editData.company.currency.id !== 0
        ? this.editData.company.currency
        : null;

    if (this.editData.company.departmentContacts.length) {
      for (const department of this.editData.company.departmentContacts) {
        this.departmentContacts.push(
          this.createDepartmentContacts({
            id: department.id,
            departmentId: department.department.name,
            phone: department.phone,
            extensionPhone: department.extensionPhone,
            email: department.email,
          })
        );
        this.selectedDepartmentFormArray.push(department);
      }
    }

    if (this.editData.company.bankAccounts.length) {
      for (
        let index = 0;
        index < this.editData.company.bankAccounts.length;
        index++
      ) {
        this.bankAccounts.push(
          this.createBankAccount({
            id: this.editData.company.bankAccounts[index].id,
            bankId: this.editData.company.bankAccounts[index].bank.name,
            routing: this.editData.company.bankAccounts[index].routing,
            account: this.editData.company.bankAccounts[index].account,
          })
        );
        this.selectedBankAccountFormArray.push(
          this.editData.company.bankAccounts[index]
        );
        this.isBankSelectedFormArray.push(
          this.editData.company.bankAccounts[index].id ? true : false
        );
        this.onBankSelected(index);
      }
    }

    if (this.editData.company.bankCards.length) {
      for (const card of this.editData.company.bankCards) {
        this.bankCards.push(
          this.createBankCard({
            id: card.id,
            nickname: card.nickname,
            card: card.card,
            cvc: card.cvc,
            expireDate: card.expireDate
              ? convertDateFromBackend(card.expireDate)
              : null,
          })
        );
      }
    }
  }

  public updateCompanyDivision(id: number) {
    const {
      addressUnit,
      timeZone,
      currency,
      departmentContacts,
      bankAccounts,
      bankCards,
      //----- Exclude Properties From Company Division -----
      companyType,
      dateOfIncorporation,
      prefix,
      starting,
      sufix,
      customerPayTerm,
      customerCredit,
      mvrMonths,
      trailerInspectionMonths,
      truckInspectionMonths,
      preferredLoadType,
      autoInvoicing,
      factorByDefault,
      //----- Whole Payroll tab
      useACHPayout,
      // Driver & Owner
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

    let newData: UpdateDivisionCompanyCommand = {
      id: id,
      ...form,
      address: {
        ...this.selectedAddress,
        addressUnit: addressUnit,
      },
      timeZone: this.selectedTimeZone ? this.selectedTimeZone.id : null,
      currency: this.selectedCurrency ? this.selectedCurrency.id : null,
    };

    for (let index = 0; index < departmentContacts.length; index++) {
      departmentContacts[index].departmentId =
        this.selectedDepartmentFormArray[index].id;
    }

    for (let index = 0; index < bankAccounts.length; index++) {
      bankAccounts[index].bankId = this.selectedBankAccountFormArray[index].id;
    }

    for (let index = 0; index < bankCards.length; index++) {
      bankCards[index].expireDate = convertDateToBackend(
        bankCards[index].expireDate
      );
    }

    newData = {
      ...newData,
      departmentContacts,
      bankAccounts,
      bankCards,
    };

    this.settingsCompanyService
      .updateCompanyDivision(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully updated company division',
            'Success'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error(
            "Can't updated company division",
            'Error'
          );
        },
      });
  }

  public deleteCompanyDivisionById(id: number) {
    this.settingsCompanyService
      .deleteCompanyDivisionById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully delete company division',
            'Success'
          );
          this.modalService.setModalSpinner({
            action: 'delete',
            status: false,
          });
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
      email,
      ein,
      name,
      currency,
      companyType,
      dateOfIncorporation,
      departmentContacts,
      bankAccounts,
      bankCards,
      driveOwnerPayPeriod,
      driverOwnerEndingIn,
      soloEmptyMile,
      soloLoadedMile,
      soloPerStop,
      perMileSolo,
      teamEmptyMile,
      teamLoadedMile,
      teamPerStop,
      perMileTeam,
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

    let newData: UpdateCompanyCommand = {
      ...form,
      timeZone: this.selectedTimeZone ? this.selectedTimeZone.id : null,
      currency: this.selectedCurrency ? this.selectedCurrency.id : null,
      companyType: this.selectedCompanyData
        ? this.selectedCompanyData.id
        : null,
      dateOfIncorporation: dateOfIncorporation
        ? convertDateToBackend(dateOfIncorporation)
        : null,
      preferredLoadType:
        this.companyForm.get('preferredLoadType').value === 'FTL' ? 1 : 2,
    };

    for (let index = 0; index < departmentContacts.length; index++) {
      departmentContacts[index].departmentId =
        this.selectedDepartmentFormArray[index].id;
    }

    for (let index = 0; index < bankAccounts.length; index++) {
      bankAccounts[index].bankId = this.selectedBankAccountFormArray[index].id;
    }

    for (let index = 0; index < bankCards.length; index++) {
      bankCards[index].expireDate = convertDateToBackend(
        bankCards[index].expireDate
      );
    }

    const accountingPayroll = {
      departmentId: 1,
      payPeriod: this.selectedAccountingPayPeriod.id,
      endingIn: this.selectedAccountingEndingIn.id,
      defaultBase: this.companyForm.get('accountingDefaultBase').value
        ? convertThousanSepInNumber(
            this.companyForm.get('accountingDefaultBase').value
          )
        : null,
    };

    const dispatchPayroll = {
      departmentId: 2,
      payPeriod: this.selectedDispatchPayPeriod.id,
      endingIn: this.selectedDispatchEndingIn.id,
      defaultBase: this.companyForm.get('dispatchDefaultBase').value
        ? convertThousanSepInNumber(
            this.companyForm.get('dispatchDefaultBase').value
          )
        : null,
      defaultCommission: this.companyForm.get('dispatchDefaultCommission')
        .value,
    };

    const recruitingPayroll = {
      departmentId: 3,
      payPeriod: this.selectedRecPayPeriod.id,
      endingIn: this.selectedRecEndingIn.id,
      defaultBase: this.companyForm.get('recruitingDefaultBase').value
        ? convertThousanSepInNumber(
            this.companyForm.get('recruitingDefaultBase').value
          )
        : null,
    };

    const repairPayroll = {
      departmentId: 4,
      payPeriod: this.selectedRepairPayPeriod.id,
      endingIn: this.selectedRepairEndingIn.id,
      defaultBase: this.companyForm.get('repairDefaultBase').value
        ? convertThousanSepInNumber(
            this.companyForm.get('repairDefaultBase').value
          )
        : null,
    };

    const safetyPayroll = {
      departmentId: 5,
      payPeriod: this.selectedSafetyPayPeriod.id,
      endingIn: this.selectedSafetyEndingIn.id,
      defaultBase: this.companyForm.get('safetyDefaultBase').value
        ? convertThousanSepInNumber(
            this.companyForm.get('safetyDefaultBase').value
          )
        : null,
    };

    const managerPayroll = {
      departmentId: 7,
      payPeriod: this.selectedManagerPayPeriod.id,
      endingIn: this.selectedManagerEndingIn.id,
      defaultBase: this.companyForm.get('managerDefaultBase').value
        ? convertThousanSepInNumber(
            this.companyForm.get('managerDefaultBase').value
          )
        : null,
      defaultCommission: this.companyForm.get('managerDefaultCommission').value,
    };

    const companyOwnerPayroll = {
      // Company Owner
      departmentId: 8,
      payPeriod: this.selectedCompanyPayPeriod.id,
      endingIn: this.selectedCompanyEndingIn.id,
      defaultBase: this.companyForm.get('companyOwnerDefaultBase').value
        ? convertThousanSepInNumber(
            this.companyForm.get('companyOwnerDefaultBase').value
          )
        : null,
    };

    const otherPayroll = {
      departmentId: 9,
      payPeriod: this.selectedOtherPayPeriod.id,
      endingIn: this.selectedOtherEndingIn.id,
      defaultBase: this.companyForm.get('otherDefaultBase').value
        ? convertThousanSepInNumber(
            this.companyForm.get('otherDefaultBase').value
          )
        : null,
    };

    const driverOwnerPayroll = {
      departmentId: 10,
      payPeriod: this.selectedDriverPayPeriod.id,
      endingIn: this.selectedDriverEndingIn.id,
      soloEmptyMile: this.companyForm.get('driverOwnerHasLoadedEmptyMiles')
        .value
        ? ['Solo', 'Combined'].includes(this.selectedFleetType)
          ? this.companyForm.get('soloEmptyMile').value
          : null
        : null,
      soloLoadedMile: this.companyForm.get('driverOwnerHasLoadedEmptyMiles')
        .value
        ? ['Solo', 'Combined'].includes(this.selectedFleetType)
          ? this.companyForm.get('soloLoadedMile').value
          : null
        : null,
      soloPerStop: ['Solo', 'Combined'].includes(this.selectedFleetType)
        ? this.companyForm.get('soloPerStop').value
          ? convertThousanSepInNumber(this.companyForm.get('soloPerStop').value)
          : null
        : null,
      perMileSolo: this.companyForm.get('driverOwnerHasLoadedEmptyMiles').value
        ? perMileSolo
          ? convertThousanSepInNumber(perMileSolo)
          : null
        : null,
      teamEmptyMile: this.companyForm.get('driverOwnerHasLoadedEmptyMiles')
        .value
        ? ['Team', 'Combined'].includes(this.selectedFleetType)
          ? this.companyForm.get('teamEmptyMile').value
          : null
        : null,
      teamLoadedMile: this.companyForm.get('driverOwnerHasLoadedEmptyMiles')
        .value
        ? ['Team', 'Combined'].includes(this.selectedFleetType)
          ? this.companyForm.get('teamLoadedMile').value
          : null
        : null,
      teamPerStop: ['Team', 'Combined'].includes(this.selectedFleetType)
        ? this.companyForm.get('teamPerStop').value
          ? convertThousanSepInNumber(this.companyForm.get('teamPerStop').value)
          : null
        : null,
      perMileTeam: this.companyForm.get('driverOwnerHasLoadedEmptyMiles').value
        ? perMileTeam
          ? convertThousanSepInNumber(perMileTeam)
          : null
        : null,
      defaultSoloDriverCommission: ['Solo', 'Combined'].includes(
        this.selectedFleetType
      )
        ? this.companyForm.get('driverSoloDefaultCommission').value
        : null,
      defaultTeamDriverCommission: ['Team', 'Combined'].includes(
        this.selectedFleetType
      )
        ? this.companyForm.get('driverTeamDefaultCommission').value
        : null,
      defaultOwnerCommission: this.companyForm.get('ownerDefaultCommission')
        .value,
      loadedAndEmptySameRate: this.companyForm.get(
        'driverOwnerHasLoadedEmptyMiles'
      ).value,
    };

    const payrolls: any = [
      accountingPayroll,
      dispatchPayroll,
      recruitingPayroll,
      repairPayroll,
      safetyPayroll,
      managerPayroll,
      companyOwnerPayroll,
      otherPayroll,
      driverOwnerPayroll,
    ];

    newData = {
      ...newData,
      bankAccounts,
      departmentContacts,
      bankCards,
      payrolls,
    };

    this.settingsCompanyService
      .updateCompany(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Successfully update your main company',
            'Success'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Can't update main company!", 'Error');
        },
      });
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
      timeZone:
        this.editData.company.timeZone.id !== 0
          ? this.editData.company.timeZone.name
          : null,
      currency:
        this.editData.company.currency.id !== 0
          ? this.editData.company.currency.name
          : null,
      companyType:
        this.editData.company.companyType.id !== 0
          ? this.editData.company.companyType.name
          : null,
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
      useACHPayout: this.editData.company.useACHPayout ? true : false,
    });

    this.selectedAddress = this.editData.company.address;

    this.selectedTimeZone =
      this.editData.company.timeZone.id !== 0
        ? this.editData.company.timeZone
        : null;

    this.selectedCompanyData =
      this.editData.company.companyType.id !== 0
        ? this.editData.company.companyType
        : null;

    this.selectedCurrency =
      this.editData.company.currency.id !== 0
        ? this.editData.company.currency
        : null;

    this.onPrefferedLoadCheck({
      id:
        this.editData.company.additionalInfo.preferredLoadType === 'FTL'
          ? 1
          : 2,
      name: this.editData.company.additionalInfo.preferredLoadType,
    });

    this.selectedFleetType = this.editData.company.additionalInfo.fleetType;

    this.onFleetTypeCheck(
      this.fleetTypeBtns.find((item) => item.name === this.selectedFleetType)
    );

    if (this.editData.company.departmentContacts.length) {
      for (const department of this.editData.company.departmentContacts) {
        this.departmentContacts.push(
          this.createDepartmentContacts({
            id: department.id,
            departmentId: department.department.name,
            phone: department.phone,
            extensionPhone: department.extensionPhone,
            email: department.email,
          })
        );
        this.selectedDepartmentFormArray.push(department);
      }
    }

    if (this.editData.company.bankAccounts.length) {
      for (
        let index = 0;
        index < this.editData.company.bankAccounts.length;
        index++
      ) {
        this.bankAccounts.push(
          this.createBankAccount({
            id: this.editData.company.bankAccounts[index].id,
            bankId: this.editData.company.bankAccounts[index].bank.name,
            routing: this.editData.company.bankAccounts[index].routing,
            account: this.editData.company.bankAccounts[index].account,
          })
        );
        this.selectedBankAccountFormArray.push(
          this.editData.company.bankAccounts[index]
        );
        this.isBankSelectedFormArray.push(
          this.editData.company.bankAccounts[index].id ? true : false
        );
        this.onBankSelected(index);
      }
    }

    if (this.editData.company.bankCards.length) {
      for (const card of this.editData.company.bankCards) {
        this.bankCards.push(
          this.createBankCard({
            id: card.id,
            nickname: card.nickname,
            card: card.card,
            cvc: card.cvc,
            expireDate: card.expireDate
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
              .patchValue(
                payroll.defaultBase
                  ? convertNumberInThousandSep(payroll.defaultBase)
                  : null
              );

            this.selectedAccountingPayPeriod = payroll.payPeriod;
            this.selectedAccountingEndingIn = payroll.endingIn;
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
              .patchValue(
                payroll.defaultBase
                  ? convertNumberInThousandSep(payroll.defaultBase)
                  : null
              );
            this.companyForm
              .get('dispatchDefaultCommission')
              .patchValue(payroll.defaultCommission);

            this.selectedDispatchPayPeriod = payroll.payPeriod;
            this.selectedDispatchEndingIn = payroll.endingIn;
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
              .patchValue(
                payroll.defaultBase
                  ? convertNumberInThousandSep(payroll.defaultBase)
                  : null
              );

            this.selectedRecPayPeriod = payroll.payPeriod;
            this.selectedRecEndingIn = payroll.endingIn;
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
              .patchValue(
                payroll.defaultBase
                  ? convertNumberInThousandSep(payroll.defaultBase)
                  : null
              );
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
              .patchValue(
                payroll.defaultBase
                  ? convertNumberInThousandSep(payroll.defaultBase)
                  : null
              );

            this.selectedSafetyPayPeriod = payroll.payPeriod;
            this.selectedSafetyEndingIn = payroll.endingIn;
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
              .patchValue(
                payroll.defaultBase
                  ? convertNumberInThousandSep(payroll.defaultBase)
                  : null
              );
            this.companyForm
              .get('managerDefaultCommission')
              .patchValue(payroll.defaultCommission);

            this.selectedManagerPayPeriod = payroll.payPeriod;
            this.selectedManagerEndingIn = payroll.endingIn;
            break;
          }
          case 8: {
            // Company Owner
            this.companyForm
              .get('companyOwnerPayPeriod')
              .patchValue(payroll.payPeriod.name);
            this.companyForm
              .get('companyOwnerEndingIn')
              .patchValue(payroll.endingIn.name);
            this.companyForm
              .get('companyOwnerDefaultBase')
              .patchValue(
                payroll.defaultBase
                  ? convertNumberInThousandSep(payroll.defaultBase)
                  : null
              );

            this.selectedCompanyPayPeriod = payroll.payPeriod;
            this.selectedCompanyEndingIn = payroll.endingIn;
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
              .patchValue(
                payroll.defaultBase
                  ? convertNumberInThousandSep(payroll.defaultBase)
                  : null
              );

            this.selectedOtherPayPeriod = payroll.payPeriod;
            this.selectedOtherEndingIn = payroll.endingIn;
            break;
          }
          case 10: {
            this.companyForm
              .get('driveOwnerPayPeriod')
              .patchValue(payroll.payPeriod.name);
            this.companyForm
              .get('driverOwnerEndingIn')
              .patchValue(payroll.endingIn.name);

            this.companyForm
              .get('soloEmptyMile')
              .patchValue(payroll.soloEmptyMile);
            this.companyForm
              .get('soloLoadedMile')
              .patchValue(payroll.soloLoadedMile);
            this.companyForm
              .get('soloPerStop')
              .patchValue(
                payroll.soloPerStop
                  ? convertNumberInThousandSep(payroll.soloPerStop)
                  : null
              );
            this.companyForm
              .get('perMileSolo')
              .patchValue(
                payroll.perMileSolo
                  ? convertNumberInThousandSep(payroll.perMileSolo)
                  : null
              );

            this.companyForm
              .get('teamEmptyMile')
              .patchValue(payroll.teamEmptyMile);
            this.companyForm
              .get('teamLoadedMile')
              .patchValue(payroll.teamLoadedMile);
            this.companyForm
              .get('teamPerStop')
              .patchValue(
                payroll.teamPerStop
                  ? convertNumberInThousandSep(payroll.teamPerStop)
                  : null
              );
            this.companyForm
              .get('perMileTeam')
              .patchValue(
                payroll.perMileTeam
                  ? convertNumberInThousandSep(payroll.perMileTeam)
                  : null
              );
            this.companyForm
              .get('driverOwnerHasLoadedEmptyMiles')
              .patchValue(payroll.loadedAndEmptySameRate);

            this.companyForm
              .get('driverSoloDefaultCommission')
              .patchValue(payroll.defaultSoloDriverCommission);
            this.companyForm
              .get('driverTeamDefaultCommission')
              .patchValue(payroll.defaultTeamDriverCommission);

            this.companyForm
              .get('ownerDefaultCommission')
              .patchValue(payroll.defaultOwnerCommission);

            this.selectedDriverPayPeriod = payroll.payPeriod;
            this.selectedDriverEndingIn = payroll.endingIn;
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
