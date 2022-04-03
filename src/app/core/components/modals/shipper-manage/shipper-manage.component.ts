import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {emailChack} from "../../../../../assets/utils/methods-global";
import {checkSelectedText, pasteCheck} from "../../../utils/methods.globals";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Address} from "../../../model/address";
import {NotificationService} from "../../../services/notification/notification.service";
import {SpinnerService} from "../../../services/spinner/spinner.service";
import { SharedService } from 'src/app/core/services/shared/shared.service';
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import { CustomerService } from 'src/app/core/services/customer/customer.service';
import {GooglePlaceDirective} from "ngx-google-places-autocomplete";
import {Subscription} from "rxjs";
import {TabSwitcherComponent} from "../../switchers/tab-switcher/tab-switcher.component";

@Component({
  selector: 'app-shipper-manage',
  templateUrl: './shipper-manage.component.html',
  styleUrls: ['./shipper-manage.component.scss']
})
export class ShipperManageComponent implements OnInit {

  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @ViewChild('addressInput') addressInput: ElementRef;
  @ViewChild('note') note: ElementRef;
  @ViewChild(TabSwitcherComponent)
  tabSwitch: TabSwitcherComponent;

  @Input() inputData: any;
  isValidAddress = false;
  shipperForm: FormGroup;
  contactPersonsList: FormArray;
  subscription: Subscription[] = [];
  options = {
    types: ['address'],
    componentRestrictions: {country: ['US', 'CA']},
  };
  modalTitle: any;
  address: Address;
  loaded = false;
  isBusiness = true;
  firstWords: boolean;
  fomratType: any;
  numOfSpaces = 0;
  showNote: boolean;
  tab = 1;

  tabs = [
    {
      id: 1,
      name: 'Receiving hours',
    },
    {
      id: 2,
      name: 'Appointment',
    },
  ];
  inputText: false;

  constructor(
    private formBuilder: FormBuilder,
    private customerService: CustomerService,
    private sharedService: SharedService,
    private notification: NotificationService,
    private spinner: SpinnerService,
    public activeModal: NgbActiveModal
  ) {
    this.createForm();
  }

  get contactPersonsFormGroup() {
    return this.shipperForm.get('contactPersons') as FormArray;
  }

  ngOnInit() {
    if (this.inputData.data.type === 'new') {
      this.modalTitle = 'New Shipper/Consignee';
      this.loaded = true;
    } else if (this.inputData.data.type === 'edit') {
      this.setForm(this.inputData.data.shipper);
      this.removeValidatorsFromReceivingHours();
      this.modalTitle = 'Edit Shipper/Consignee';
    }
  }

  /**
   * Tab change function
   *
   * @param event Any
   */

  onSpecialChar(event) {
    let k;
    k = event.charCode;
    return (k > 64 && k < 91) || (k > 96 && k < 123) || k === 8 || k === 32;
  }

  // TODO add manage shipper interface
  setForm(data: any) {
    if (data.doc.address !== null && data.doc.address.address !== '') {
      this.isValidAddress = true;
    }
    this.shipperForm.patchValue({
      name: data.name,
      status: data.status,
      phone: data.doc.phone,
      address: data.doc.address?.address,
      addressUnit: data.doc.addressUnit,
      email: data.doc.email,
      appointments: data.doc.appointments,
      receivingHours: data.doc.receivingHours,
      fromReceivedHours: data.doc.fromReceivedHours,
      toReceivedHours: data.doc.toReceivedHours,
      mainNote: data.doc.mainNote,
    });
    this.loaded = true;
    setTimeout(() => {
      this.tabSwitch.activeTab = data.doc.hourOrAppointment === 'recHours' ? 1 : 2;
      this.tab = this.tabSwitch.activeTab;
    }, 500);

    //
    this.address = data.doc.address;
    this.shipperForm.setControl('contactPersons', this.setContactPersons(data.doc.contactPersons));
    this.sharedService.touchFormFields(this.shipperForm);
  }

  setContactPersons(contact: any): FormArray {
    const formArray = new FormArray([]);
    if (contact) {
      contact.forEach((person: any) => {
        formArray.push(
          this.formBuilder.group({
            id: person.id,
            name: person.name,
            phone: person.phone,
            email: person.email,
          })
        );
      });
    }
    this.contactPersonsList = formArray;
    return formArray;
  }

  addNewContactPerson() {
    if (this.contactPersonsList.controls.length < 2) {
      this.contactPersonsList.push(this.createContactPerson());
    }
  }

  removeContact(index: any) {
    this.contactPersonsList.removeAt(index);
  }

  manageShipper() {
    this.customerService.shipperEdited = true;
    if (!this.sharedService.markInvalid(this.shipperForm)) {
      return false;
    }
    if (this.isValidAddress === false) {
      this.notification.warning('Address needs to be valid.', 'Warning:');
      this.addressInput.nativeElement.focus();
      return;
    }
    const shipper = this.shipperForm.value;

    const saveData = {
      name: shipper.name,
      status: shipper.status ? 1 : 0,
      doc: {
        address: this.address,
        addressUnit: shipper.addressUnit,
        phone: shipper.phone,
        email: shipper.email,
        receivingHours: shipper.receivingHours,
        mainNote: shipper.mainNote,
        fromReceivedHours: shipper.fromReceivedHours,
        toReceivedHours: shipper.toReceivedHours,
        hourOrAppointment: this.tab === 1 ? 'recHours' : 'appointment',
        appointments: shipper.appointments ? 1 : 0,
        contactPersons: this.contactPersonsList.getRawValue(),
      },
    };

    this.spinner.show(true);

    if (this.inputData.data.type === 'new') {
      this.customerService.addShipper(saveData).subscribe(
        () => {
          this.closeShipperEdit();
          this.notification.success(`Shipper ${saveData.name} added successfully.`, 'Success:');
          this.sharedService.emitShipperChange.emit();
        },
        (error: any) => {
          error ? this.sharedService.handleServerError() : null;
        }
      );
    } else if (this.inputData.data.type === 'edit') {
      this.customerService
        .updateShipper(saveData, this.inputData.data.id, this.inputData.data.isMapEdit)
        .subscribe(
          () => {
            this.closeShipperEdit();
            this.notification.success(`Shipper ${saveData.name} updated successfully.`, 'Success:');
          },
          (error: any) => {
            error ? this.sharedService.handleServerError() : null;
          }
        );
    }
  }

  createForm() {
    this.shipperForm = this.formBuilder.group({
      name: [null, Validators.required],
      status: [1],
      phone: [null],
      address: [null, Validators.required],
      addressUnit: '',
      /*  Validators.required, */
      email: ['', Validators.email],
      appointments: [1],
      fromReceivedHours: ['', Validators.required],
      toReceivedHours: ['', Validators.required],
      receivingHours: [''],
      mainNote: [''],
      contactPersons: this.formBuilder.array([]),
    });
    this.contactPersonsList = this.shipperForm.get('contactPersons') as FormArray;
    setTimeout(() => {
      this.transformInputData();
    });
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

  public tabChange(event: any) {
    this.tab = event.id;
    if (event.id === 1) {
      this.shipperForm.get('fromReceivedHours').setValidators(Validators.required);
      this.shipperForm.get('toReceivedHours').setValidators(Validators.required);
    } else {
      this.removeValidatorsFromReceivingHours();
    }
  }

  public removeValidatorsFromReceivingHours(): void {
    this.shipperForm.get('fromReceivedHours').setValue('');
    this.shipperForm.get('fromReceivedHours').clearValidators();
    this.shipperForm.get('fromReceivedHours').updateValueAndValidity();

    this.shipperForm.get('toReceivedHours').setValue('');
    this.shipperForm.get('toReceivedHours').clearValidators();
    this.shipperForm.get('toReceivedHours').updateValueAndValidity();
  }

  createContactPerson() {
    const fb = this.formBuilder.group({
      name: [''],
      email: ['', Validators.email],
      phone: [''],
    });
    const data = {
      email: 'lower',
    };
    this.sharedService.handleInputValues(fb, data);
    return fb;
  }

  closeShipperEdit() {
    this.sharedService.emitShipperClose.emit();
    this.activeModal.close();
  }

  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.sharedService.selectAddress(this.shipperForm, address);
  }

  addressKeyDown() {
    this.isValidAddress = false;
    this.address = null;
  }

  keyDownFunction(event: any) {
    if (event.keyCode === 13 && event.target.localName !== 'textarea') {
      this.manageShipper();
    }
  }

  retriveAddressComponents(addressArray: any, type: string, name: string) {
    const res = addressArray.find((addressComponents) => addressComponents.types[0] === type);
    if (res !== undefined) {
      return res[name];
    } else {
      return '';
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

    this.fomratType = /^[!@#$%^&*()_+\=\[\]{};':"\\|<>\/?]*$/;
    event.preventDefault();
    if (index !== undefined) {
      if (inputID === 'email') {
        this.fomratType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
        (document.getElementById(inputID + index) as HTMLInputElement).value += pasteCheck(
          event.clipboardData.getData('Text'),
          this.fomratType,
          false
        );
      } else {
        this.fomratType = /^[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?0-9]*$/;
        (document.getElementById(inputID + index) as HTMLInputElement).value += pasteCheck(
          event.clipboardData.getData('Text'),
          this.fomratType,
          true
        );
      }
    } else if (inputID === 'email') {
      this.fomratType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        false
      );
    } else if (inputID === 'name') {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        true,
        this.isBusiness,
        this.firstWords
      );
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        true
      );
    }

    if (inputID === 'name') {
      this.shipperForm.controls[inputID].patchValue(
        (document.getElementById(inputID) as HTMLInputElement).value
      );
    }
  }

  onBusinessName(event) {
    let k;
    k = event.charCode;
    if (k === 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    /* For first input restriction */
    if ((document.getElementById('name') as HTMLInputElement).value === '') {
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
    if (this.numOfSpaces < 2) {
      return (
        (k > 64 && k < 91) ||
        (k > 96 && k <= 121) ||
        (k >= 48 && k <= 57) ||
        k === 8 ||
        k === 32 ||
        (k >= 42 && k <= 46) ||
        k === 64 ||
        k === 61 ||
        (k >= 35 && k <= 38)
      );
    } else {
      event.preventDefault();
    }
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

  onContactNameTyping(event) {
    let k;
    k = event.charCode;
    if (k === 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
    if (this.numOfSpaces < 2) {
      return (k > 64 && k < 91) || (k > 96 && k < 123) || k === 32;
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
    return emailChack(event);
  }

  ngOnDestroy() {
    this.subscription.forEach((subscription) => subscription.unsubscribe());
  }

  manageInputValidation(formElement: any) {
    return this.sharedService.manageInputValidation(formElement);
  }

  private transformInputData() {
    const data = {
      name: 'upper',
      email: 'lower',
      addressUnit: 'upper',
    };

    this.sharedService.handleInputValues(this.shipperForm, data);
  }

  clearInput(x) {
    this.shipperForm.controls[x.currentTarget.offsetParent.firstChild.id].reset();
  }

  public onKeyUpMethod(x) {
    this.inputText = x.key;
    x.key === 'Backspace' && !this.shipperForm.get(x.currentTarget.id).value ? this.inputText = false : this.inputText = x.key;
  }

}
