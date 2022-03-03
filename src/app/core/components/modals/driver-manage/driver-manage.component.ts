import {
  Component,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {DatePipe} from "@angular/common";
import {AbstractControl, FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Address} from "../../../model/address";
import {environment} from "../../../../../environments/environment";
import {forkJoin, Subject, takeUntil} from "rxjs";
import {BankData, DriverData, DriverOwnerData} from "../../../model/driver";
import {FormatSettings} from '@progress/kendo-angular-dateinputs';
import {Options} from '@angular-slider/ngx-slider';
import {SharedService} from "../../../services/shared/shared.service";
import {SpinnerService} from "../../../services/spinner/spinner.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {NotificationService} from "../../../services/notification/notification.service";
import {CustomModalService} from "../../../services/modals/custom-modal.service";
import {HttpErrorResponse} from "@angular/common/http";
import {DriverService} from "../../../services/driver/driver.service";
import {checkSelectedText, emailCheck, pasteCheck} from "../../../utils/methods.globals";
import {v4 as uuidv4} from 'uuid';
import {MetaDataService} from "../../../services/shared/meta-data.service";

@Component({
  selector: 'app-driver-manage',
  templateUrl: './driver-manage.component.html',
  styleUrls: ['./driver-manage.component.scss'],
  providers: [DatePipe],
  encapsulation: ViewEncapsulation.None
})
export class DriverManageComponent implements OnInit, OnDestroy  {

  @ViewChild('note') note: ElementRef;
  @Input() inputData: any;
  toggle = false;
  bankData: BankData[];
  driver: DriverData;
  works: any = {};
  driverForm: FormGroup;
  lang = 'en';
  showAnotherPhone = false;
  showEmploymentEndDate = false;
  bankInfoRequired: boolean;
  itemList: FormArray;
  showNote = false;
  textRows = 1;
  modalTitle: string;
  ownerFieldsRequired = false;
  isUserOwner = false;
  isTwicChecked = false;
  soleActive = true;
  selectedTab = 1;
  public driverName: any;
  options = {
    types: ['address'],
    componentRestrictions: {country: ['US', 'CA']},
  };
  newBank = '';
  newBankVisible = false;
  notifications = [
    {
      id: 'email',
      name: 'Email',
      checked: false,
    },
    {
      id: 'phone_call',
      name: 'Phone call',
      checked: false,
    },
    {
      id: 'sms',
      name: 'SMS',
      checked: false,
    },
  ];
  ownerSwitchData = [
    {
      id: 'sole_proprietor',
      name: 'Sole Proprietor',
      checked: true,
    },
    {
      id: 'company',
      name: 'Company',
      checked: false,
    },
  ];
  paymentTypes = [
    {
      id: 'mile',
      name: 'Per mile',
    },
    {
      id: 'commission',
      name: 'Commission %',
    },
  ];
  tabs = [
    {
      id: 1,
      name: 'Basic',
    },
    {
      id: 2,
      name: 'Additional',
    },
  ];
  address: Address = null;
  sliderOptions: Options = {
    floor: 10,
    ceil: 50,
  };
  sliderOptionsOwner: Options = {
    floor: 2,
    ceil: 25,
  };
  bankSearchItems = 0;
  linkCompany = false;
  format: FormatSettings = environment.dateFormat;
  loaded = false;
  public formatType: any;
  public numOfSpaces = 0;
  private destroy$: Subject<void> = new Subject<void>();
  public placeholder: any = {
    year: 'YY', month: 'MM', day: 'DD'
  };
  inputText: false;

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverService,
    private sharedService: SharedService,
    public activeModal: NgbActiveModal,
    private spinner: SpinnerService,
    private notification: NotificationService,
    private metaDataService: MetaDataService,
    private shared: SharedService,
    private customModalService: CustomModalService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.createForm();
    if (this.inputData.data.type === 'edit') {
      this.modalTitle = 'Edit Driver';
      this.getDriverData();
    } else if (this.inputData.data.type === 'new') {
      this.loaded = true;
      this.modalTitle = 'Add Driver';
      this.getBanks(false);
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  getBanks(loadNewBank: boolean) {
    this.sharedService
      .getBankList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result: BankData[]) => {
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
            this.driverForm.controls.bankData.setValue(result[result.length - 1]);
          }
        },
        (error: HttpErrorResponse) => {
          error ? this.sharedService.handleError(error) : null;
        }
      );
  }

  checkIsOwner() {
    this.driverForm.controls.isOwner.setValue(this.isUserOwner);

    if (!this.isUserOwner) {
      this.driverForm.controls.isBusinessOwner.setValue(this.isUserOwner);
      this.changeBusinessOwner();
    }
  }

  checkTwic() {
    this.setTwicFieldValidation(this.isTwicChecked);
  }

  switchOwner(data: any) {
    this.driverForm.controls.isBusinessOwner.setValue(data[1].checked);
    this.changeBusinessOwner();
  }

  createForm() {
    this.driverForm = this.formBuilder.group({
      type: ['single'],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      phone: ['', Validators.required],
      address: [null, Validators.required],
      addressUnit: [''],
      email: [
        '',
        [Validators.required, Validators.email],
      ],
      note: [null],
      status: [true, Validators.required],
      ssn: [null, Validators.required],
      dateOfBirth: [null, Validators.required],
      expirationDate: [null],
      fuelCard: [null],
      notifications: [null],
      bankData: [null],
      accountNumber: [null, [Validators.minLength(4), Validators.maxLength(17)]],
      routingNumber: [null],
      // owner fields
      isOwner: false,
      businessName: [null],
      taxId: [null],
      paymentType: [null],
      emptyMiles: [null],
      loadedMiles: [null],
      commission: [10],
      commissionOwner: [2],
      isBusinessOwner: false,
    });
    this.driverForm.controls.businessName.disable();
    this.itemList = this.driverForm.get('phones') as FormArray;
    this.setOwnerFieldsValidation(false);
    this.setTwicFieldValidation(false);
    this.requiredBankInfo(false);
    setTimeout(() => {
      this.transformInputData();
    });
  }

  setOwnerFieldsValidation(state: boolean) {
    if (state) {
      this.driverForm.controls.businessName.setValidators(Validators.required);
      this.driverForm.controls.taxId.setValidators(Validators.required);
    } else {
      this.driverForm.controls.businessName.clearValidators();
      this.driverForm.controls.taxId.clearValidators();
    }
    this.ownerFieldsRequired = state;
    this.driverForm.controls.businessName.updateValueAndValidity();
    this.driverForm.controls.taxId.updateValueAndValidity();
  }

  setTwicFieldValidation(state: boolean) {
    if (state) {
      this.driverForm.controls.expirationDate.enable();
      this.driverForm.controls.expirationDate.setValidators(Validators.required);
    } else {
      this.driverForm.controls.expirationDate.setValidators(null);
      this.driverForm.controls.expirationDate.clearValidators();
      this.driverForm.controls.expirationDate.disable();
    }
    this.driverForm.controls.expirationDate.updateValueAndValidity();
  }

  changeBusinessOwner() {
    this.setOwnerFieldsValidation(this.driverForm.controls.isBusinessOwner.value);
  }

  isOwner(event: any) {
    this.driverForm.controls.isOwner.setValue(event);
  }

  getDriverData() {
    const bankList$ = this.sharedService.getBankList();
    const driver$ = this.driverService.getDriverData(this.inputData.data.id, 'all');

    forkJoin([bankList$, driver$])
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        ([bankData, driver]: [BankData[], DriverData]) => {
          this.driver = driver;
          this.loaded = true;
          bankData.push({
            bankLogo: null,
            bankLogoWide: null,
            bankName: 'Add new',
            companyId: null,
            id: 0,
          });
          bankData.sort((a, b) => (a.id > b.id ? 1 : b.id > a.id ? -1 : 0));
          this.bankData = bankData;

          const additionalData =
            this.driver && this.driver.doc && this.driver.doc.additionalData
              ? this.driver.doc.additionalData
              : null;

          this.driverForm.patchValue({
            firstName: this.driver.firstName,
            lastName: this.driver.lastName,
            address: additionalData.address ? additionalData.address.address : null,
            addressUnit: additionalData.address ? additionalData.address.addressUnit : null,
            phone: additionalData.phone,
            email: additionalData.email,
            note:
              additionalData.note !== null
                ? additionalData.note.replace(/<\/?[^>]+(>|$)/g, '')
                : '',
            status: this.driver.status,
            ssn: this.driver.ssn,
            bankData:
              additionalData.bankData.bankName !== null ? additionalData.bankData : undefined,
            accountNumber: additionalData.bankData.accountNumber,
            dateOfBirth: this.driver.dateOfBirth ? new Date(this.driver.dateOfBirth) : null,
            expirationDate:
              this.driver.expirationDate !== null ? new Date(this.driver.expirationDate) : null,
            fuelCard:
              this.driver.fuelCards &&
              this.driver.fuelCards[0] &&
              this.driver.fuelCards[0].fuelCardNumber,
            routingNumber: additionalData.bankData.routingNumber,
            isOwner: additionalData.businessData.isOwner,
            businessName: additionalData.businessData.businessName,
            taxId: additionalData.businessData.taxId,
            paymentType: additionalData.paymentType,
            emptyMiles: this.driver.emptyMiles,
            loadedMiles: this.driver.loadedMiles,
            commission: this.driver.commission !== undefined ? this.driver.commission : null,
            commissionOwner:
              this.driver.commissionOwner !== undefined ? this.driver.commissionOwner : null,
            isBusinessOwner: additionalData.businessData.isBusinessOwner,
          });

          this.address = additionalData.address ? additionalData.address : null;
          this.isTwicChecked = this.driver.twic === 1;

          this.sharedService.touchFormFields(this.driverForm);
          this.setTwicFieldValidation(this.isTwicChecked);

          if (
            additionalData.businessData.taxId !== null &&
            additionalData.businessData.taxId !== undefined &&
            additionalData.businessData.taxId !== ''
          ) {
            this.driverForm.controls.businessName.enable();
          } else {
            this.driverForm.controls.businessName.disable();
          }

          this.isUserOwner = this.driver.doc && this.driver.doc.additionalData.businessData.isOwner === 1;

          if (this.driver.doc && this.driver.doc.additionalData.businessData.isBusinessOwner) {
            this.ownerSwitchData[0].checked = false;
            this.ownerSwitchData[1].checked = true;
          } else {
            this.ownerSwitchData[0].checked = true;
            this.ownerSwitchData[1].checked = false;
          }
          if (
            this.driver.doc &&
            this.driver.doc.additionalData.bankData &&
            this.driver.doc.additionalData.bankData.id
          ) {
            this.requiredBankInfo(true);
          } else {
            this.requiredBankInfo(false);
          }

          this.setNotifications(
            this.driver.doc ? this.driver.doc.additionalData.notifications : []
          );

          if (
            this.driver.doc &&
            this.driver.doc.additionalData.note &&
            this.driver.doc.additionalData.note.length > 0
          ) {
            this.showNote = true;
            this.handleHeight(this.driver.doc.additionalData.note);
          }
        },
        (error: any) => {
          error ? this.shared.handleServerError() : null;
        }
      );
  }

  isRequiredField(formField: any) {
    if (!formField.validator) {
      return false;
    }

    const validator = formField.validator({} as AbstractControl);
    return validator && validator.required;
  }

  public tabChange(event: any) {
    this.selectedTab = event.id;
  }

  saveDriver() {
    console.log(this.driverForm.getRawValue());
    if (!this.shared.markInvalid(this.driverForm)) {
      return false;
    }
    const driverFormData = this.driverForm.getRawValue();

    if (this.address) {
      this.address.addressUnit = driverFormData.addressUnit ? driverFormData.addressUnit : null;
    }

    if (this.inputData.data.type === 'new') {
      // Add new Driver
      const saveData: DriverData = {
        firstName: driverFormData.firstName ? driverFormData.firstName : null,
        lastName: driverFormData.lastName ? driverFormData.lastName : null,
        ssn: driverFormData.ssn ? driverFormData.ssn.toString().replace('-', '') : null,
        linkCompany: this.linkCompany ? 1 : 0,
        status: driverFormData.status ? 1 : 0,
        bankId: driverFormData.bankData ? driverFormData.bankData.id : null,
        accountNumber: driverFormData.accountNumber ? driverFormData.accountNumber : null,
        routingNumber: driverFormData.routingNumber ? driverFormData.routingNumber : null,
        isOwner: driverFormData.isOwner ? 1 : 0,
        taxNumber: driverFormData.taxId && driverFormData.isBusinessOwner && driverFormData.isOwner
          ? driverFormData.taxId
          : null,
        businessName: driverFormData.businessName && driverFormData.isBusinessOwner && driverFormData.isOwner
          ? driverFormData.businessName
          : null,
        paymentType: driverFormData.paymentType && driverFormData.paymentType.id
          ? driverFormData.paymentType.id
          : null,
        emptyMiles: driverFormData.emptyMiles,
        loadedMiles: driverFormData.loadedMiles,
        commission: driverFormData.commission,
        commissionOwner: driverFormData.commissionOwner,
        twic: this.isTwicChecked ? 1 : 0,
        expirationDate: driverFormData.expirationDate,
        dateOfBirth: driverFormData.dateOfBirth ? driverFormData.dateOfBirth : null,
        fuelCards: [
          {
            fuelCardNumber: driverFormData.fuelCard ? driverFormData.fuelCard : "",
            cardBrand: ' ',
          },
        ],
        doc: {
          additionalData: {
            phone: driverFormData.phone ? driverFormData.phone : null,
            email: driverFormData.email ? driverFormData.email : null,
            address: this.address ? this.address : null,
            type: driverFormData.type ? driverFormData.type : null,
            birthDateShort: this.datePipe.transform(
              this.driverForm.controls.dateOfBirth.value,
              'shortDate'
            ),
            note: driverFormData.note ? driverFormData.note : null,
            notifications: this.getNotifications(),
            bankData: {
              id: driverFormData.bankData ? driverFormData.bankData.id : null,
              bankLogo: driverFormData.bankData ? driverFormData.bankData.bankLogo : null,
              bankLogoWide: driverFormData.bankData ? driverFormData.bankData.bankLogoWide : null,
              bankName: driverFormData.bankData ? driverFormData.bankData.bankName : null,
              accountNumber: driverFormData.accountNumber
                ? driverFormData.accountNumber.toString()
                : null,
              routingNumber: driverFormData.routingNumber
                ? driverFormData.routingNumber.toString()
                : null,
            },
            businessData: {
              isOwner: driverFormData.isOwner ? 1 : 0,
              isBusinessOwner: driverFormData.isBusinessOwner ? 1 : 0,
              taxId: driverFormData.taxId && driverFormData.isBusinessOwner && driverFormData.isOwner
                ? driverFormData.taxId
                : null,
              businessName: driverFormData.businessName &&
              driverFormData.isBusinessOwner &&
              driverFormData.isOwner
                ? driverFormData.businessName
                : null,
            },
            paymentType: driverFormData.paymentType,
          },
          licenseData: [],
          testData: [],
          medicalData: [],
          mvrData: [],
          workData: [
            {
              id: uuidv4(),
              startDate: new Date(),
              startDateShort: this.datePipe.transform(new Date(), 'shortDate'),
              endDate: null,
              endDateShort: null,
            },
          ],
        },
        driverData: undefined
      };
      saveData.additionalData = saveData.doc?.additionalData;
      saveData.licenseData = saveData.doc?.licenseData;
      saveData.testData = saveData.doc?.testData;
      saveData.medicalData = saveData.doc?.medicalData;
      saveData.workData = saveData.doc?.workData;
      saveData.mvrData = saveData.doc?.mvrData;
      this.driverService
        .addDriver(saveData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (driverData: DriverData) => {
            this.notification.success(
              `Driver ${driverData.firstName + ' ' + driverData.lastName} has been added.`,
              'Success:'
            );
            // this.driverForm.reset();
            // this.showEmploymentEndDate = false;
            // this.showAnotherPhone = false;
            this.closeDriverEdit();
            this.spinner.show(false);
          },
          (error: HttpErrorResponse) => {
            this.shared.handleError(error);
          }
        );
    } else {
      // Update Driver Data
      const saveData: DriverData = {
        firstName: driverFormData.firstName ? driverFormData.firstName : null,
        lastName: driverFormData.lastName ? driverFormData.lastName : null,
        ssn: driverFormData.ssn ? driverFormData.ssn.toString().replace('-', '') : null,
        linkCompany: 0,
        status: driverFormData.status ? driverFormData.status : null,
        bankId: driverFormData.bankData ? driverFormData.bankData.id : null,
        accountNumber: driverFormData.accountNumber ? driverFormData.accountNumber : null,
        routingNumber: driverFormData.routingNumber ? driverFormData.routingNumber : null,
        isOwner: driverFormData.isOwner ? 1 : 0,
        taxNumber: driverFormData.taxId && driverFormData.isBusinessOwner && driverFormData.isOwner
          ? driverFormData.taxId
          : null,
        businessName: driverFormData.businessName && driverFormData.isBusinessOwner && driverFormData.isOwner
          ? driverFormData.businessName
          : null,
        paymentType: driverFormData.paymentType && driverFormData.paymentType
          ? driverFormData.paymentType.id
          : null,
        emptyMiles: driverFormData.emptyMiles,
        loadedMiles: driverFormData.loadedMiles,
        commission: driverFormData.commission,
        commissionOwner: driverFormData.commissionOwner,
        twic: this.isTwicChecked ? 1 : 0,
        expirationDate: driverFormData.expirationDate,
        dateOfBirth: driverFormData.dateOfBirth ? driverFormData.dateOfBirth : null,
        fuelCards: [
          {
            fuelCardNumber: driverFormData.fuelCard ? driverFormData.fuelCard : "",
            cardBrand: ' ',
          },
        ],
        doc: {
          additionalData: {
            avatar: this.driver && this.driver.doc && this.driver.doc.additionalData
              ? this.driver.doc.additionalData.avatar
              : null,
            phone: driverFormData.phone ? driverFormData.phone : null,
            email: driverFormData.email ? driverFormData.email : null,
            address: this.address ? this.address : null,
            type: driverFormData.type ? driverFormData.type : null,
            note: driverFormData.note ? driverFormData.note : null,
            notifications: this.getNotifications(),
            birthDateShort: this.datePipe.transform(
              this.driverForm.controls.dateOfBirth.value,
              'shortDate'
            ),
            bankData: {
              id: driverFormData.bankData ? driverFormData.bankData.id : null,
              bankLogo: driverFormData.bankData ? driverFormData.bankData.bankLogo : null,
              bankLogoWide: driverFormData.bankData ? driverFormData.bankData.bankLogoWide : null,
              bankName: driverFormData.bankData ? driverFormData.bankData.bankName : null,
              accountNumber: driverFormData.accountNumber
                ? driverFormData.accountNumber.toString()
                : null,
              routingNumber: driverFormData.routingNumber
                ? driverFormData.routingNumber.toString()
                : null,
            },
            businessData: {
              isOwner: driverFormData.isOwner ? 1 : 0,
              isBusinessOwner: driverFormData.isBusinessOwner ? 1 : 0,
              taxId: driverFormData.taxId && driverFormData.isBusinessOwner && driverFormData.isOwner
                ? driverFormData.taxId
                : null,
              businessName: driverFormData.businessName &&
              driverFormData.isBusinessOwner &&
              driverFormData.isOwner
                ? driverFormData.businessName
                : null,
            },
            paymentType: driverFormData.paymentType && driverFormData.paymentType.id
              ? driverFormData.paymentType
              : null,
          },
          licenseData: this.driver && this.driver.doc && this.driver.doc.licenseData
            ? this.driver.doc.licenseData
            : [],
          medicalData: this.driver && this.driver.doc && this.driver.doc.medicalData
            ? this.driver.doc.medicalData
            : [],
          mvrData: this.driver && this.driver.doc && this.driver.doc.mvrData
            ? this.driver.doc.mvrData
            : [],
          testData: this.driver && this.driver.doc && this.driver.doc.testData
            ? this.driver.doc.testData
            : [],
          workData: this.driver && this.driver.doc && this.driver.doc.workData
            ? this.driver.doc.workData
            : [],
        },
        driverData: undefined
      };
      saveData.additionalData = saveData.doc?.additionalData;
      saveData.licenseData = saveData.doc?.licenseData;
      saveData.testData = saveData.doc?.testData;
      saveData.medicalData = saveData.doc?.medicalData;
      saveData.workData = saveData.doc?.workData;
      saveData.mvrData = saveData.doc?.mvrData;
      this.driverService
        .updateDriverData(saveData, this.inputData.data.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (driverData: DriverData) => {
            this.notification.success(
              `Driver ${driverData.firstName + ' ' + driverData.lastName} has been updated.`,
              'Success:'
            );
            this.closeDriverEdit();
            this.spinner.show(false);
            this.showAnotherPhone = false;
          },
          (error: HttpErrorResponse) => {
            this.shared.handleError(error);
          }
        );
    }
  }

  employmentEndDate() {
    this.showEmploymentEndDate = !this.showEmploymentEndDate;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openNote() {
    if (this.showNote === true) {
      this.showNote = false;
    } else {
      this.showNote = true;
      setTimeout(() => {
        this.note.nativeElement.focus();
      }, 250);
    }
  }

  handleHeight(val: string) {
    const lines = val.split(/\r|\r\n|\n/);
    const count = lines.length;
    this.textRows = count >= 4 ? 4 : count;
  }

  closeDriverEdit() {
    this.activeModal.close();
  }

  onBankChange(event: any) {
    this.requiredBankInfo(event !== undefined);
    if (event !== undefined && event.id === 0) {
      this.driverForm.controls.bankData.reset();
      this.newBankVisible = true;
      setTimeout(() => {
        document.getElementById('newBank').focus();
      }, 250);
    }
  }

  requiredBankInfo(state: boolean) {
    if (state) {
      this.driverForm.controls.accountNumber.enable();
      this.driverForm.controls.routingNumber.enable();
      this.driverForm.controls.accountNumber.setValidators(Validators.required);
      this.driverForm.controls.routingNumber.setValidators([
        Validators.required,
        Validators.minLength(9),
      ]);
      this.bankInfoRequired = true;
    } else {
      this.driverForm.controls.accountNumber.reset();
      this.driverForm.controls.routingNumber.reset();
      this.driverForm.controls.accountNumber.disable();
      this.driverForm.controls.routingNumber.disable();
      this.driverForm.controls.accountNumber.clearValidators();
      this.driverForm.controls.routingNumber.clearValidators();
      this.bankInfoRequired = false;
    }
    this.driverForm.controls.routingNumber.updateValueAndValidity();
    this.driverForm.controls.accountNumber.updateValueAndValidity();
  }

  getNotifications() {
    const tempArr = [];
    this.notifications.forEach((element) => {
      if (element.checked) {
        tempArr.push(element.id);
      }
    });
    return tempArr;
  }

  setNotifications(notifications: any) {
    notifications.forEach((n) => {
      this.notifications.forEach((m) => {
        if (m.id === n) {
          m.checked = true;
        }
      });
    });
  }

  public handleAddressChange(address: any) {
    this.address = this.shared.selectAddress(this.driverForm, address);
  }

  keyDownFunction(event: any) {
    if (
      event.keyCode === 13 &&
      event.target.localName !== 'textarea' &&
      event.target.id !== 'newBank' &&
      event.path !== undefined &&
      event.path !== null &&
      event.path[3].className !== 'ng-select-container ng-has-value'
    ) {
      this.saveDriver();
    }
  }

  /* Form Validation on paste and word validation */
  onPaste(event: any, inputID: string, index?: number) {
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

    this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
    event.preventDefault();
    if (inputID === 'ssn' || inputID === 'taxId') {
      this.formatType = /^[!@#$%^&*()_+\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else if (inputID === 'email') {
      this.formatType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else if (inputID === 'accountNumber' || inputID === 'routingNumber') {
      this.formatType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?A-Za-z]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.formatType,
        false
      );
    }

    this.driverForm.controls[inputID].patchValue(
      (document.getElementById(inputID) as HTMLInputElement).value
    );
  }

  onNameTyping(event) {
    let k;
    k = event.charCode;
    if (k === 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }

    if (this.numOfSpaces < 2) {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k < 123) ||
        k === 8 ||
        k === 32 ||
        (k >= 48 && k <= 57) ||
        k === 46 ||
        k === 44 ||
        k === 45
      );
    } else {
      event.preventDefault();
    }
  }

  onCheckBackSpace(event) {
    if (event.keyCode === 8) {
      this.numOfSpaces = 0;
    }
  }

  onEmailTyping(event) {
    return emailCheck(event);
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
        (error: HttpErrorResponse) => {
          this.shared.handleError(error);
        }
      );
  }

  closeNewBank() {
    this.newBankVisible = false;
    this.newBank = '';
  }

  onBankKeyPress(event: any) {
    if (event.charCode === 13) {
      this.saveNewBank();
    }
  }

  deleteBank(id: number) {
    this.metaDataService.deleteBank(id).subscribe(
      (resp: any) => {
        if (resp) {
          this.getBanks(false);
        }
      },
      (error: HttpErrorResponse) => {
        this.shared.handleError(error);
      }
    );
    setTimeout(() => {
      this.driverForm.controls.bankData.reset();
    });
  }

  manageInputValidation(formElement: any) {
    return this.shared.manageInputValidation(formElement);
  }

  customSearch(term: string, item: any) {
    term = term.toLocaleLowerCase();
    return item.bankName.toLocaleLowerCase().indexOf(term) > -1 || item.id === 0;
  }

  onSearch(event: any) {
    this.bankSearchItems = event.items.length;
  }

  onClose() {
    this.bankSearchItems = 0;
  }

  getBusinessName() {
    if (this.driverForm.controls.taxId.value && this.driverForm.controls.taxId.value.length === 9) {
      this.spinner.showInputLoading(true);
      this.driverForm.controls.businessName.enable();
      this.sharedService
        .getDriverOwnerData(Number(this.driverForm.controls.taxId.value))
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (driverOwnerData: DriverOwnerData) => {
            if (driverOwnerData.owner && driverOwnerData.owner.businessName) {
              this.linkCompany = true;
              this.driverForm.controls.businessName.setValue(driverOwnerData.owner.businessName);
            } else {
              this.driverForm.controls.businessName.setValue('');
              this.linkCompany = false;
            }
            this.spinner.showInputLoading(false);
          },
          (error: HttpErrorResponse) => {
            this.shared.handleError(error);
          }
        );
    } else {
      this.driverForm.controls.businessName.disable();
    }
  }

  private transformInputData() {
    const data = {
      firstName: 'capitalize',
      lastName: 'capitalize',
      businessName: 'upper',
      email: 'lower',
      addressUnit: 'upper',
    };

    this.shared.handleInputValues(this.driverForm, data);
  }

  clearInput(x) {
    this.driverForm.controls[x.currentTarget.offsetParent.firstChild.id].reset();
    this.inputText = false;
  }

  public onKeyUpMethod(x) {
    this.inputText = x.key;
    x.key === 'Backspace' && !this.driverForm.get(x.currentTarget.id).value ? this.inputText = false : this.inputText = x.key;
  }

}
