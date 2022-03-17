import {Component, Input, OnInit} from '@angular/core';
import {OwnerData} from "../../../model/owner";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Enums} from "../../../model/enums";
import {Address} from "../../../model/address";
import {Subject, takeUntil} from "rxjs";
import {SharedService} from "../../../services/shared/shared.service";
import {CustomModalService} from "../../../services/modals/custom-modal.service";
import {MetaDataService} from "../../../services/shared/meta-data.service";
import {SpinnerService} from "../../../services/spinner/spinner.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {checkNumberOfSpaces, checkSelectedText, emailCheck, pasteCheck} from "../../../utils/methods.globals";
import {HttpErrorResponse} from "@angular/common/http";

@Component({
  selector: 'app-owner-manage',
  templateUrl: './owner-manage.component.html',
  styleUrls: ['./owner-manage.component.scss']
})
export class OwnerManageComponent implements OnInit {

  @Input() inputData: any;
  public lang = 'en';
  public phoneList: any;
  public owner: OwnerData;
  public ownerForm: FormGroup;
  public bankData: any;
  public countries: Enums[];
  public states: Enums[];
  public ownerShipTypeName: string;
  public itemList: FormArray;
  public bankInfoRequired: boolean;
  public options = {
    componentRestrictions: {country: ['US', 'CA']},
  };
  public modalTitle: string;
  public tab = {
    id: 1,
    name: 'Company',
  };
  address: Address;
  overflowX;
  newBank = '';
  newBankVisible = false;
  bankSearchItems = 0;
  tabs = [
    {
      id: 1,
      name: 'Company',
    },
    {
      id: 2,
      name: 'Sole proprietor',
    },
  ];
  loaded = false;
  public isBusiness = true;
  public firstWords: boolean;
  public formatType = /^[!@#$%^&*()_+\[\]{};':"\\|,.<>\/?A-Za-z ]*$/;
  public numOfSpaces = 0;
  private destroy$: Subject<void> = new Subject<void>();
  inputText: false;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private customModalService: CustomModalService,
    private metaDataService: MetaDataService,
    private spinner: SpinnerService,
    private notification: NotificationService,
    public  activeModal: NgbActiveModal,
    //private ownerService: AppSharedService
  ) {
    this.initForm();
  }

  get phoneFormGroup() {
    return this.ownerForm.get('phones') as FormArray;
  }

  get itemFormGroup() {
    return this.ownerForm.get('phones') as FormArray;
  }

  ngOnInit() {
    if (this.inputData.data.type === 'new') {
      this.ownerForm.get('type').setValue(this.tab.name);
      this.modalTitle = 'New owner';
      this.tabChange(this.tab);
      this.loaded = true;
    } else if (this.inputData.data.type === 'edit') {
      this.getOwnerEdit();
      this.modalTitle = 'Edit owner';
    }
    this.getBanks(false);
    this.setCustomFormValidation();
  }

  /**
   * Tab change function
   *
   * @param event Any
   */
  public tabChange(event: any) {
    let data = {};
    this.tab = event;
    if (this.tab.name === 'Company') {
      this.ownerForm.get('type').setValue('Company');
      data = {
        name: 'upper',
        lastName: 'capitalize',
        email: 'lower',
      };
    } else {
      data = {
        name: 'capitalize',
        lastName: 'capitalize',
        email: 'lower',
      };
      this.ownerForm.get('type').setValue('Proprietor');
    }
    setTimeout(() => {
      this.sharedService.handleInputValues(this.ownerForm, data);
    });
  }

  /**
   * Get owner edit function
   */
  public getOwnerEdit() {
    this.sharedService
      .editOwner(this.inputData.data.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: any) => {
          this.setForm(result);
          this.loaded = true;
          this.tab.name = result.category;
          this.owner = result.data;

          if (result.doc.additionalData.bankData.id !== null) {
            this.requiredBankInfo(true);
          } else {
            this.requiredBankInfo(false);
          }
        },
        (error: any) => {
          error ? this.sharedService.handleServerError() : null;
        }
      );
  }

  /* Get banks function */
  public getBanks(loadNewBank: boolean) {
    this.sharedService
      .getBankList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: any) => {
          result.push({
            bankLogo: null,
            bankLogoWide: null,
            bankName: 'Add new',
            companyId: null,
            id: 0,
          });
          result.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
          this.bankData = result;
          if (loadNewBank) {
            this.ownerForm.controls.bank.setValue(result[result.length - 1]);
          }
        },
        (error: any) => {
          error ? this.sharedService.handleServerError() : null;
        }
      );
  }

  saveNewBank() {
    const data = {
      domain: 'bank',
      key: 'name',
      value: this.newBank,
      protected: 0,
    };

    this.metaDataService
      .createMetadata(data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          if(resp) {
            this.closeNewBank();
            this.getBanks(true);
          }
        },
        (error: any) => {
          error ? this.sharedService.handleServerError() : null;
        }
      );
  }

  closeNewBank() {
    this.newBankVisible = false;
    this.newBank = '';
  }

  onBankKeyPress(event: any) {
    if (event.charCode == 13) {
      this.saveNewBank();
    }
  }

  /* Manage owner function */
  public manageOwner() {
    // this.ownerService.reloadOwner = true;
    if (!this.sharedService.markInvalid(this.ownerForm)) {
      return false;
    }
    const owner = this.ownerForm.getRawValue();

    this.address.addressUnit = owner.addressUnit ? owner.addressUnit : '';
    const ownerShipData: OwnerData = {
      category: owner.type,
      businessName: owner.businessName,
      taxNumber: owner.taxId || owner.ssn,
      firstName: owner.firstName,
      lastName: owner.lastName,
      ssn: owner.ssn,
      bankId: owner.bank ? owner.bank.id : '',
      accountNumber: owner.accountNumber ? owner.accountNumber : '',
      routingNumber: owner.routingNumber ? owner.routingNumber : '',
      status: 1,
      doc: {
        additionalData: {
          email: owner.email,
          phone: owner.phone,
          address: this.address,
          bankData: {
            id: owner.bank ? owner.bank.id : null,
            bankLogo: owner.bank ? owner.bank.bankLogo : null,
            bankLogoWide: owner.bank ? owner.bank.bankLogoWide : null,
            bankName: owner.bank ? owner.bank.bankName : null,
            accountNumber: owner.accountNumber ? owner.accountNumber : null,
            routingNumber: owner.routingNumber ? owner.routingNumber : null,
          },
        },
      },
    };

    this.spinner.show(true);
    if (this.inputData.data.type === 'new') {
      this.sharedService
        .addOwner(ownerShipData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response: any) => {
            if (response.message === 'already_exists') {
              this.notification.error('Owner already exists.', 'Error:');
            } else {
              this.notification.success(`Owner ${owner.name} added.`, 'Success:');
              this.closeOwnerAddModal();
              this.ownerForm.reset();
              this.spinner.show(false);
              //this.sharedService.emitOwnerAdd.emit(true);
            }
          },
          (error: any) => {
            error ? this.sharedService.handleServerError() : null;
            this.closeOwnerAddModal();
          }
        );
    } else if (this.inputData.data.type === 'edit') {
      const ownerShipDataUpdate = {
        category: owner.type,
        businessName: owner.businessName,
        taxNumber: owner.taxId || owner.ssn,

        firstName: owner.firstName,
        lastName: owner.lastName,
        ssn: owner.ssn,

        bankId: owner.bank ? owner.bank.id : null,
        accountNumber: owner.accountNumber ? owner.accountNumber : '',
        routingNumber: owner.routingNumber ? owner.routingNumber : '',
        status: 1,
        doc: {
          additionalData: {
            email: owner.email,
            phone: owner.phone,
            address: this.address,
            bankData: {
              id: owner.bank ? owner.bank.id : null,
              bankLogo: owner.bank ? owner.bank.bankLogo : null,
              bankLogoWide: owner.bank ? owner.bank.bankLogoWide : null,
              bankName: owner.bank ? owner.bank.bankName : null,
              accountNumber: owner.accountNumber ? owner.accountNumber : null,
              routingNumber: owner.routingNumber ? owner.routingNumber : null,
            },
          },
        },
        meta: [],
      };
      this.sharedService
        .updateOwner(ownerShipDataUpdate, this.inputData.data.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp: any) => {
            if (resp) {
              this.closeOwnerAddModal();
              this.notification.success(`${owner.businessName} updated.`, 'Success:');
              this.spinner.show(false);
              // this.sharedService.emitOwnerAdd.emit(true);
            }
          },
          (error: any) => {
            this.closeOwnerAddModal();
            error ? this.sharedService.handleServerError() : null;
          }
        );
    }
  }

  /* Create item function */
  public createItem() {
    return this.formBuilder.group({
      type: ['Mobile'],
      number: [null, Validators.required],
    });
  }

  /* Add new item function */
  public addNewItem() {
    this.itemList.push(this.createItem());
  }

  /* Add new phone function */
  public addNewPhone() {
    this.phoneList.push(this.createPhones());
  }

  /* Select property function */
  public selectedProperty(event: any) {
    if (event.id === 'company') {
      this.ownerShipTypeName = 'Company';
    } else if (event.id === 'sole_proprietor') {
      this.ownerShipTypeName = 'Name';
    }
  }

  /* On bank change function */
  public onBankChange(event: any) {
    this.requiredBankInfo(event !== undefined);
    if (event !== undefined && event.id == 0) {
      this.ownerForm.controls.bank.reset();
      this.newBankVisible = true;
      setTimeout(() => {
        document.getElementById('newBank').focus();
      }, 250);
    }
  }

  /* Required bank info function */
  public requiredBankInfo(state: boolean) {
    if (state) {
      this.ownerForm.controls.accountNumber.enable();
      this.ownerForm.controls.routingNumber.enable();
      this.ownerForm.controls.accountNumber.setValidators(Validators.required);
      this.ownerForm.controls.routingNumber.setValidators(Validators.required);
      this.bankInfoRequired = true;
    } else {
      this.ownerForm.controls.accountNumber.reset();
      this.ownerForm.controls.routingNumber.reset();
      this.ownerForm.controls.accountNumber.disable();
      this.ownerForm.controls.routingNumber.disable();
      this.ownerForm.controls.accountNumber.clearValidators();
      this.ownerForm.controls.routingNumber.clearValidators();
      this.bankInfoRequired = false;
    }
    this.ownerForm.controls.routingNumber.updateValueAndValidity();
    this.ownerForm.controls.accountNumber.updateValueAndValidity();
  }

  /* Key down function */
  public keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.getOwnerEdit();
    }
  }

  /* Close owner add modal */
  public closeOwnerAddModal() {
    this.activeModal.close();
  }

  /*  Handle address change function */
  public handleAddressChange(address: any) {
    // this.ownerForm.get('street').setValue(address.formatted_address);
    this.address = this.sharedService.selectAddress(this.ownerForm, address);
  }

  /*  Open bank modal function */
  public openBankModal() {
    // this.customModalService.openModal(AppBankAddComponent);
  }

  /* Set phones function */
  public setPhones(test: any): FormArray {
    const formArray = new FormArray([]);
    if (test) {
      test.forEach((s: any) => {
        formArray.push(
          this.formBuilder.group({
            type: s.type,
            number: s.number,
          })
        );
      });
    }
    this.phoneList = formArray;
    return formArray;
  }

  // NEW
  initForm() {
    this.ownerForm = this.formBuilder.group({
      type: ['Company'],
      // company
      businessName: [null, Validators.required],
      taxId: [null, Validators.required],
      // solo proprietor
      firstName: [''],
      lastName: [''],
      ssn: [''],
      bank: [null],
      accountNumber: [null, [Validators.minLength(4), Validators.maxLength(17)]],
      routingNumber: [null],
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      phone: [null],
      address: [null, Validators.required],
      addressUnit: '',
    });
    this.requiredBankInfo(false);
    setTimeout(() => {
      this.transformInputData();
    });
  }

  public setForm(data: any) {
    this.ownerForm.setValue({
      type: data.category,
      businessName: data.businessName,
      taxId: data.taxNumber,
      firstName: data.businessName.split(' ')[0],
      lastName: data.businessName.split(' ')[1] || '',
      ssn: data.taxNumber || '',
      bank:
        data.doc && data.doc.additionalData && data.doc.additionalData.bankData.bankName
          ? data.doc.additionalData.bankData
          : null,
      accountNumber: data.accountNumber,
      routingNumber: data.routingNumber,
      email: data.doc.additionalData.email,
      phone: data.doc.additionalData.phone,
      addressUnit: data.doc.additionalData?.address.addressUnit
        ? data.doc.additionalData?.address.addressUnit
        : '',
      address: data.doc.additionalData.address.address
        ? data.doc.additionalData.address.address
        : '',
    });
    this.address = data.doc.additionalData.address;
    this.sharedService.touchFormFields(this.ownerForm);
  }

  setCustomFormValidation() {
    const businessName = this.ownerForm.get('businessName');
    const taxId = this.ownerForm.get('taxId');
    const firstName = this.ownerForm.get('firstName');
    const lastName = this.ownerForm.get('lastName');
    const ssn = this.ownerForm.get('ssn');

    this.ownerForm
      .get('type')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((type) => {
        if (type === 'Company') {
          businessName.setValidators([Validators.required]);
          taxId.setValidators([Validators.required]);
          firstName.setValidators(null);
          lastName.setValidators(null);
          ssn.setValidators(null);
        }
        if (type === 'Proprietor') {
          businessName.setValidators(null);
          taxId.setValidators(null);
          firstName.setValidators([Validators.required]);
          lastName.setValidators([Validators.required]);
          ssn.setValidators([Validators.required]);
        }
        businessName.updateValueAndValidity();
        taxId.updateValueAndValidity();
        firstName.updateValueAndValidity();
        lastName.updateValueAndValidity();
        ssn.updateValueAndValidity();
      });
  }

  typeSsn(event) {
    if (event?.length === 9) {
      this.pingSSN(event);
    }
  }

  pingSSN(ssn) {
    this.sharedService
      .pingSsn(ssn)
      .pipe(takeUntil(this.destroy$))
      .subscribe((resp: any) => {
        if (resp.driver) {
          console.log('pingSSN response', resp);
          this.ssnSetForm(resp);
        }
      });
  }

  ssnSetForm(pingData) {
    this.ownerForm.patchValue({
      phone: pingData.driver.doc.additionalData.phone,
      email: pingData.driver.doc.additionalData.email,
      firstName: pingData.driver.firstName,
      lastName: pingData.driver.lastName,
      address: pingData.driver.doc.additionalData.address.address,
      bank: pingData.driver.bankId,
      accountNumber: pingData.driver.accountNumber,
      routingNumber: pingData.driver.routingNumber,
    });
  }

  /* Form Validation on paste and word validation */
  onPaste(event: any, inputID: string, limitOfCuructers?: number, index?: number) {
    event.preventDefault();

    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value = checkSelectedText(
        inputID,
        index
      );
    }

    this.numOfSpaces = 0;

    if (inputID === 'businessName') {
      this.formatType = /^[!@#$%^&*()_+\[\]{};':"\\|<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        true,
        this.isBusiness,
        this.firstWords
      );
    } else if (inputID === 'addressUnit') {
      this.formatType = /^[!@#$%^&*()_+\[\]{};':"\\|,.<>\/? ]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        true
      );
    } else if (inputID === 'firstName' || inputID === 'lastName') {
      this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        true
      );
    } else if (inputID === 'taxId') {
      this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z ]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        true,
        false,
        false,
        limitOfCuructers
      );
    } else if (inputID === 'accountNumber' || inputID === 'routingNumber') {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        true,
        false,
        false,
        limitOfCuructers
      );
    } else if (inputID === 'email') {
      console.log('Uslo ovde');
      this.formatType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        true
      );
    }

    this.ownerForm.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  onAccountAndRoutingTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    if (this.numOfSpaces < 2) {
      return k == 8 || k == 32 || (k >= 48 && k <= 57) || k == 45;
    } else {
      event.preventDefault();
    }
  }

  onUnitTyping(event) {
    let k;
    k = event.charCode;
    console.log(k);
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k == 8 || k == 32 || (k >= 48 && k <= 57);
  }

  onBusinessTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }

    /* For first input restriction */
    if ((document.getElementById('businessName') as HTMLInputElement).value === '') {
      if (
        event.key === '*' ||
        event.key === '=' ||
        event.key === '+' ||
        event.key === '#' ||
        event.key === '%' ||
        event.key === ' '
      ) {
        event.preventDefault();
      }
    }
    // TODO check if method checkNumberOfSpaces works correctly
    checkNumberOfSpaces(k, this.numOfSpaces);
  }

  onCheckBackSpace(event) {
    if (event.keyCode === 8) {
      this.numOfSpaces = 0;
    }
  }

  onEmailTyping(event) {
    return emailCheck(event);
  }

  deleteBank(id: number) {
    this.metaDataService
      .deleteBank(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (resp: any) => {
          if (resp) {
            this.getBanks(false);
          }
        },
        (error: HttpErrorResponse) => {
          this.sharedService.handleError(error);
        }
      );
    setTimeout(() => {
      this.ownerForm.controls.bank.reset();
    });
  }

  manageInputValidation(formElement: any) {
    return this.sharedService.manageInputValidation(formElement);
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.bankName.toLocaleLowerCase().indexOf(term) > -1 || item.id === 0;
  }

  onSearch(event: any) {
    this.bankSearchItems = event.items.length;
  }

  onClose(event: any) {
    this.bankSearchItems = 0;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private transformInputData() {
    const data = {
      firstName: 'capitalize',
      lastName: 'capitalize',
      email: 'lower',
      businessName: 'upper',
      addressUnit: 'upper',
    };

    this.sharedService.handleInputValues(this.ownerForm, data);
  }

  private createPhones() {
    return this.formBuilder.group({
      type: ['Mobile'],
      number: [null, Validators.required],
    });
  }

  clearInput(x) {
    this.ownerForm.controls[x.currentTarget.offsetParent.firstChild.id].reset();
  }

  public onKeyUpMethod(x) {
    this.inputText = x.key;
    x.key === 'Backspace' && !this.ownerForm.get(x.currentTarget.id).value ? this.inputText = false : this.inputText = x.key;
  }
}
