import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import {
  checkSelectedText,
  emailChack,
  pasteCheck,
} from 'src/assets/utils/methods-global';
import {Options} from '@angular-slider/ngx-slider';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-settings-basic-modal',
  templateUrl: './settings-basic-modal.component.html',
  styleUrls: ['./settings-basic-modal.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingsBasicModalComponent implements OnInit {
  @ViewChild('dropZone') dropZoneRef: ElementRef;

  public modalTitle: string = 'Company';
  public selectedTab: number = 1;
  inputText: false;
  public tabs: {}[] = [
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

  public timeZones = [
    {
      id: 1,
      name: '(UTC-10) Hawaii Standard Time',
      offset: -10,
    },
    {
      id: 2,
      name: '(UTC-9) Alaska Standard Time',
      offset: -9,
    },
    {
      id: 3,
      name: '(UTC-8) Pacific Standard Time',
      offset: -8,
    },
    {
      id: 4,
      name: '(UTC-7) Mountain Standard Time',
      offset: -7,
    },
    {
      id: 5,
      name: '(UTC-6) Central Standard Time',
      offset: -6,
    },
    {
      id: 6,
      name: '(UTC-5) Eastern Standard Time',
      offset: -5,
    },
  ];

  public currencies = [
    {
      id: 1,
      code: 'usd',
      symbol: '$',
      name: 'US Dollar ($)',
    },
    {
      id: 1,
      code: 'cad',
      symbol: 'C$',
      name: 'CA Dollar (C$)',
    },
  ];

  public departments = [
    {
      id: 1,
      name: 'Accounting',
    },
    {
      id: 2,
      name: 'Dispatch',
    },
    {
      id: 3,
      name: 'Manager',
    },
    {
      id: 4,
      name: 'Recruiting',
    },
    {
      id: 5,
      name: 'Repair',
    },
    {
      id: 6,
      name: 'Safety',
    },
    {
      id: 7,
      name: 'Other',
    },
  ];

  public pay_period = [
    {
      id: 'weekly',
      name: 'Weekly',
    },
    {
      id: 'bi-weekly',
      name: 'Bi-weekly',
    },
    {
      id: 'semi-monthly',
      name: 'Semi Monthly',
    },
    {
      id: 'monthly',
      name: 'Monthly',
    },
  ];

  public days = [
    {
      id: 'monday',
      name: 'Monday',
    },
    {
      id: 'tuesday',
      name: 'Tuesday',
    },
    {
      id: 'wednesday',
      name: 'Wednesday',
    },
    {
      id: 'thursday',
      name: 'Thursday',
    },
    {
      id: 'friday',
      name: 'Friday',
    },
    {
      id: 'saturday',
      name: 'Saturday',
    },
    {
      id: 'sunday',
      name: 'Sunday',
    },
  ];

  // COMPANY FORM
  public companyForm: FormGroup;

  // Additional Custom Forms
  public departmentAdditionalForm: FormGroup;
  public bankAccountadditionalForm: FormGroup;

  // Address
  public addressOptions = {
    componentRestrictions: { country: ['US', 'CA'] },
  };

  // Drop Zone Logo
  public showDropZone: boolean = true;

  // Department Contact
  public departmentContactZone: boolean = true;
  public departmentContactFields: boolean = false;
  public showDepartmentCards: boolean = false;
  public isEditModeDepartmentCardIndex: number = -1;

  // BankAccount
  public bankAccountZone: boolean = true;
  public bankAccountFields: boolean = false;
  public showBankAccountsCards: boolean = false;
  public isEditModeBankAccountCardIndex: number = -1;
  public bankAccountStatus = [
    {
      id: 1,
      name: 'unverified',
      svg: 'assets/img/svgs/settings-company/settings-bank-unverified.svg',
    },
    {
      id: 2,
      name: 'verified',
      svg: 'assets/img/svgs/settings-company/settings-bank-verified.svg',
    },
    {
      id: 3,
      name: 'pending',
      svg: 'assets/img/svgs/settings-company/settings-bank-pending.svg',
    },
    {
      id: 4,
      name: 'declinded',
      svg: 'assets/img/svgs/settings-company/settings-bank-declined.svg',
    },
  ];

  // Load Format and Customer Billing
  public loadFormatCustomerBillingZone: boolean = false;

  // Expiration
  public expirationZone: boolean = false;

  // Driver & Owner
  public driverOwnerZone: boolean = true;
  // Sliders for Driver and Owner and Dispatch and Manager
  public driverSliderOptions: Options = {
    floor: 5.0,
    ceil: 50.0,
    step: 1,
    showSelectionBar: true,
    hideLimitLabels: true,
  };
  public ownerSliderOptions: Options = {
    floor: 2.0,
    ceil: 30.0,
    step: 0.5,
    showSelectionBar: true,
    hideLimitLabels: true,
  };
  public dispatchSliderOptions: Options = {
    floor: 0.1,
    ceil: 10.0,
    step: 0.1,
    showSelectionBar: true,
    hideLimitLabels: true,
  };
  public managerSliderOptions: Options = {
    floor: 0.1,
    ceil: 5.0,
    step: 0.1,
    showSelectionBar: true,
    hideLimitLabels: true,
  };

  // Accounting, Company Owner, Recruiting, Repair, Safety, Owner
  public accountingZone: boolean = true;
  public companyOwnerZone: boolean = false;
  public dispatchZone: boolean = false;
  public managerZone: boolean = false;
  public recruitingZone: boolean = false;
  public repairZone: boolean = false;
  public safetyZone: boolean = false;
  public otherZone: boolean = false;

  // Input Validation
  public formatType = /^[!^()_\\[\]{};':"\\|<>\/?]*$/; // default format Type
  public numberOfSpaces = 0;

  constructor(
    public activeModal: NgbActiveModal,
    private formBuilder: FormBuilder,
    private sharedService: SharedService
  ) {}

  ngOnInit() {
    this.createForm();
    this.createDepartmentAdditionalForm();
    this.createBankAccountadditionalForm();
  }

  private createForm() {
    this.companyForm = this.formBuilder.group({
      name: [null],
      usdot: [null],
      ein: [null],
      mc: [null],
      phone: [null],
      email: [null, Validators.email],
      fax: [null],
      webUrl: [null],
      address: [null, Validators.required],
      addressUnit: [null],
      irp: [null],
      ifta: [null],
      toll: [null],
      scac: [null],
      timeZone: [null],
      currency: [null],
      companyLogo: [null],
      departmentContacts: this.formBuilder.array([]),
      bankAccounts: this.formBuilder.array([]),
      loadPrefix: [null],
      loadStarting: [100],
      loadSuffix: [null],
      autoIvoicing: [false],
      prefferedLoadType: ["FTL"],
      factorByDefault: [false],
      customerPayTerm: [null],
      customerCredit: [null],
      expirationMvr: [12],
      expirationTruckInspection: [12],
      expirationTrailerInspection: [12],
      // -------------------- Payroll -------------------------------------
      // Driver & Owner
      driverOwnerPayPeriod: ["Weekly", [Validators.required]],
      driverOwnerEndingIn: ["Monday", [Validators.required]],
      driverOwnerDefaultEmptyMile: [null],
      driverOwnerDefaultLoadedMile: [null],
      sameRateForLoadedAndEmptyMiles: [false],
      driverCommission: [25.0],
      ownerCommision: [15.0],
      // Accounting
      accountingPayPeriod: ["Weekly", [Validators.required]],
      accountingEndingIn: ["Monday", [Validators.required]],
      accountingDefaultBase: [null],
      // Company Owner
      companyOwnerPayPeriod: ["Weekly", [Validators.required]],
      companyOwnerEndingIn: ["Monday", [Validators.required]],
      companyOwnerDefaultBase: [null],
      // Dispatch
      dispatchPayPeriod: ["Weekly", [Validators.required]],
      dispatchEndingIn: ["Monday", [Validators.required]],
      dispatchDefaultBase: [null],
      dispatchDefaultCommission: [5.0],
      // Manager
      managerPayPeriod: ["Weekly", [Validators.required]],
      managerEndingIn: ["Monday", [Validators.required]],
      managerDefaultBase: [null],
      managerDefaultCommission: [2.5],
      // Recruiting
      recruitingPayPeriod: ["Weekly", [Validators.required]],
      recruitingEndingIn: ["Monday", [Validators.required]],
      recruitingDefaultBase: [null],
      // Repair
      repairPayPeriod: ["Weekly", [Validators.required]],
      repairEndingIn: ["Monday", [Validators.required]],
      repairDefaultBase: [null],
      // Safety
      safetyPayPeriod: ["Weekly", [Validators.required]],
      safetyEndingIn: ["Monday", [Validators.required]],
      safetyDefaultBase: [null],
      // Payroll Other
      otherPayPeriod: ["Weekly", [Validators.required]],
      otherEndingIn: ["Monday", [Validators.required]],
      otherDefaultBase: [null],
    });
  }

  // ------ ------ ------ ------ DEPARTMENT ADDITIONAL CUSTOM FORM METHODS
  public createDepartmentAdditionalForm() {
    this.departmentAdditionalForm = this.formBuilder.group({
      departmentName: [null, [Validators.required]],
      departmentPhone: [null, [Validators.required]],
      departmentEmail: [null, [Validators.required, Validators.email]],
    });
  }

  public addDepartmentContacts(department: FormGroup) {
    if (this.isEditModeDepartmentCardIndex === -1) {
      this.getDepartmentContacts.push(
        this.formBuilder.group({
          departmentName: [department.value.departmentName],
          departmentPhone: [department.value.departmentPhone],
          departmentEmail: [department.value.departmentEmail],
        })
      );

      if (this.getDepartmentContacts.length === 1) {
        this.showDepartmentCards = true;
      }
    } else {
      this.getDepartmentContacts
        .at(this.isEditModeDepartmentCardIndex)
        .patchValue({
          departmentName: [department.value.departmentName],
          departmentPhone: [department.value.departmentPhone],
          departmentEmail: [department.value.departmentEmail],
        });
    }
    this.isEditModeDepartmentCardIndex = -1;
    this.departmentAdditionalForm.reset();
  }

  public editDepartmentContact(department: FormGroup, index: number) {
    this.departmentAdditionalForm.setValue({
      departmentName: department.value.departmentName,
      departmentPhone: department.value.departmentPhone,
      departmentEmail: department.value.departmentEmail,
    });
    this.isEditModeDepartmentCardIndex = index;
  }

  public deleteDepartmentContact(index: number) {
    this.getDepartmentContacts.removeAt(index);
    if(this.isEditModeBankAccountCardIndex !== -1) {
      this.departmentAdditionalForm.reset()
    }
  }

  get getDepartmentContacts(): FormArray {
    return this.companyForm.get('departmentContacts') as FormArray;
  }

  public identifyDepartment(index, item) {
    return item.value.departmentEmail;
  }

  public cancelDepartmentContacts() {
    this.departmentAdditionalForm.reset();
  }

  // ------ ------ ------ ------ Bank Account CUSTOM FORM METHODS
  public createBankAccountadditionalForm() {
    this.bankAccountadditionalForm = this.formBuilder.group({
      bankName: [null, [Validators.required]],
      routing: [null, [Validators.required]],
      account: [null, [Validators.required]],
    });
  }

  public addBankAccount(bankAccount: FormGroup) {
    if (this.isEditModeBankAccountCardIndex === -1) {
      this.getBankAccounts.push(
        this.formBuilder.group({
          bankName: [bankAccount.value.bankName],
          routing: [bankAccount.value.routing],
          account: [bankAccount.value.account],
        })
      );

      if (this.getBankAccounts.length === 1) {
        this.showBankAccountsCards = true;
      }
    } else {
      this.getBankAccounts.at(this.isEditModeBankAccountCardIndex).patchValue({
        bankName: [bankAccount.value.bankName],
        routing: [bankAccount.value.routing],
        account: [bankAccount.value.account],
      });
    }
    this.isEditModeBankAccountCardIndex = -1;
    this.bankAccountadditionalForm.reset();
  }

  public cancelBankAccount() {
    this.bankAccountadditionalForm.reset();
  }

  public editBankAccount(bankAccount: FormGroup, index: number) {
    this.bankAccountadditionalForm.setValue({
      bankName: bankAccount.value.bankName,
      routing: bankAccount.value.routing,
      account: bankAccount.value.account,
    });
    this.isEditModeBankAccountCardIndex = index;
  }

  public deleteBankAccount(index: number) {
    this.getBankAccounts.removeAt(index);
    if(this.isEditModeBankAccountCardIndex !== -1) {
      this.bankAccountadditionalForm.reset()
    }
  }

  get getBankAccounts(): FormArray {
    return this.companyForm.get('bankAccounts') as FormArray;
  }

  public identifyBankAccount(index, item) {
    return item.value.bankName;
  }

  //  ------ ------ ------ ------ ------ END

  public addFormArray(formControl: string) {
    switch (formControl) {
      case 'departmnet-contact': {
        this.departmentContactFields = !this.departmentContactFields;
        break;
      }
      case 'bankaccount': {
        this.bankAccountFields = !this.bankAccountFields;
        break;
      }
      default:
        break;
    }
  }

  public tabChange(event: any) {
    this.selectedTab = event.id;
  }

  public saveCompany() {
    // TODO: WAIT BACKEND
    // if (!this.sharedService.markInvalid(this.companyForm)) {
    //   return false;
    // }
    console.log(this.companyForm.value)
  }

  public closeCompanyModal() {
    this.companyForm.reset();
    this.activeModal.close();
  }

  public saveFormOnKeyboardEnter(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.saveCompany();
    } else if (event.keyCode === 8) {
      this.numberOfSpaces = 0;
    }
  }

  public clearInput(formControl: string) {
      this.companyForm.get(formControl).setValue(null);
  }

  //-------------- ZONE PART (OPEN / CLOSE)
  public openZone(typeZone: string) {
    switch (typeZone) {
      case 'department-contact': {
        this.departmentContactZone = !this.departmentContactZone;
        break;
      }
      case 'bankaccount': {
        this.bankAccountZone = !this.bankAccountZone;
        break;
      }
      case 'loadFormatCustomerBillingZone': {
        this.loadFormatCustomerBillingZone =
          !this.loadFormatCustomerBillingZone;

        break;
      }
      case 'expirationZone': {
        this.expirationZone = !this.expirationZone;
        break;
      }
      case 'driver-owner': {
        this.driverOwnerZone = !this.driverOwnerZone;
        break;
      }
      case 'accounting': {
        this.accountingZone = !this.accountingZone;
        break;
      }
      case 'company-owner': {
        this.companyOwnerZone = !this.companyOwnerZone;
        break;
      }
      case 'dispatch': {
        this.dispatchZone = !this.dispatchZone;
        break;
      }
      case 'manager': {
        this.managerZone = !this.managerZone;
        break;
      }
      case 'recruiting': {
        this.recruitingZone = !this.recruitingZone;
        break;
      }
      case 'repair': {
        this.repairZone = !this.repairZone;
        break;
      }
      case 'safety': {
        this.safetyZone = !this.safetyZone;
        break;
      }
      case 'payroll-other': {
        this.otherZone = !this.otherZone;
        break;
      }

      default: {
        break;
      }
    }
  }


  //-------------- Address
  public handleAddressChange(address: any) {
    this.companyForm
      .get('address')
      .setValue(this.sharedService.selectAddress(this.companyForm, address));
  }

  //-------------- DROP ZONE FOR LOGO
  public openDropZone() {
    this.showDropZone = !this.showDropZone;
    if (this.showDropZone) {
      const timeout = setTimeout(() => {
        this.dropZoneRef.nativeElement.focus();
        clearTimeout(timeout);
      }, 250);
    }
  }

  public saveLogoCompany(logoImage: string) {
    this.companyForm.get('companyLogo').setValue({
      id: uuidv4(),
      src: logoImage,
    });
  }

  //------------- INPUT VALIDATIONS METHODS

  public manageInputValidation(formElement: any) {
    return this.sharedService.manageInputValidation(formElement);
  }

  public onEmailTyping(event) {
    return emailChack(event);
  }

  /**
   * @param keyboardEvent - on user typing;  .key (signs), .keyCode (number of signs)
   * @param elementId - get input reference
   */
  public keyPress(
    keyboardEvent: KeyboardEvent,
    elementId: string,
    typeOfInput: any
  ) {
    // Prevent User to start with below characters
    if ((document.getElementById(elementId) as HTMLInputElement).value === '') {
      if (
        keyboardEvent.key === '*' ||
        keyboardEvent.key === '=' ||
        keyboardEvent.key === '+' ||
        keyboardEvent.key === '#' ||
        keyboardEvent.key === '%' ||
        keyboardEvent.key === '?' ||
        keyboardEvent.key === '!' ||
        keyboardEvent.key === '&' ||
        keyboardEvent.key === ' '
      ) {
        keyboardEvent.preventDefault();
        return false;
      }
    }
    if (typeOfInput === 'text') {
      // Prevent User to make two spaces
      if (keyboardEvent.keyCode === 32 && this.numberOfSpaces === 0) {
        this.numberOfSpaces++;
      } else if (this.numberOfSpaces === 1 && keyboardEvent.keyCode === 32) {
        keyboardEvent.preventDefault();
        return false;
      } else if (keyboardEvent.keyCode !== 32) {
        this.numberOfSpaces = 0;
      }
    }

    if (typeOfInput === 'number' && elementId !== 'addressUnit') {
      return keyboardEvent.keyCode >= 48 && keyboardEvent.keyCode <= 57;
    }

    if (typeOfInput === 'number' && elementId === 'addressUnit') {
      return (
        (keyboardEvent.keyCode > 64 && keyboardEvent.keyCode < 91) ||
        (keyboardEvent.keyCode > 96 && keyboardEvent.keyCode < 123) ||
        keyboardEvent.keyCode == 8 ||
        keyboardEvent.keyCode == 32 ||
        (keyboardEvent.keyCode >= 48 && keyboardEvent.keyCode <= 57)
      );
    }
  }

  /**
   * @param keyboardEvent - on user event
   * @param inputID
   * @param limitCharacters - limit user input
   * @param index - if formArray or any[] index
   */
  onPaste(
    event: any,
    inputID: string,
    limitCharacters?: number,
    index?: number
  ) {
    // Check if input has index from array
    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value =
        checkSelectedText(inputID, index);
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value =
        checkSelectedText(inputID, index);
    }

    this.numberOfSpaces = 0;
    this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;

    if (['mc', 'usdot', 'ein'].includes(inputID)) {
      this.formatType = /^[!@#$%`^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
      (<HTMLInputElement>document.getElementById(inputID)).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false,
        false,
        false,
        limitCharacters
      );
    } else if (inputID === 'account' || inputID === 'routing' || inputID === 'customerPayTerm') {
      this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value +=
        pasteCheck(event.clipboardData.getData('Text'), this.formatType, false);
    } else {
      (<HTMLInputElement>document.getElementById(inputID)).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        true
      );
    }
  }
  public onKeyUpMethod(x) {
    this.inputText = x.key;
    x.key === 'Backspace' && !this.companyForm.get(x.currentTarget.id).value ? this.inputText = false : this.inputText = x.key;
  }
}
