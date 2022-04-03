import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {GooglePlaceDirective} from 'ngx-google-places-autocomplete';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Address} from "../../../model/address";
import {RepairShop} from "../../../model/shared/repair-shop";
import {Subject, takeUntil} from "rxjs";
import {SpinnerService} from "../../../services/spinner/spinner.service";
import {NotificationService} from "../../../services/notification/notification.service";
import {NgbActiveModal} from "@ng-bootstrap/ng-bootstrap";
import {SharedService} from "../../../services/shared/shared.service";
import {getRepairModalTypesData} from "./repair-shop-data/rs-manage-data";
import {checkSelectedText, pasteCheck} from "../../../utils/methods.globals";
import {emailChack} from "../../../../../assets/utils/methods-global";
import {MaintenanceService} from "../../../services/maintenance-service/maintenance.service";

@Component({
  selector: 'app-repair-shop-manage',
  templateUrl: './repair-shop-manage.component.html',
  styleUrls: ['./repair-shop-manage.component.scss']
})
export class RepairShopManageComponent implements OnInit {

  @ViewChild('placesRef') placesRef: GooglePlaceDirective;
  @ViewChild('addressInput') addressInput: ElementRef;
  @Input() inputData: any;
  loaded = false;
  repairShop: RepairShop;
  repairShopForm: FormGroup;
  isValidAddress = false;
  address: Address;
  repairShopTypes = getRepairModalTypesData();
  zipCodes = [];
  options = {
    componentRestrictions: {country: ['US', 'CA']},
  };
  modalTitle: string;
  public fomratType = /^[!@#$%^&*()_+\=\[\]{};':"\\|<>\/?]*$/;
  public numOfSpaces = 0;
  private destroy$: Subject<void> = new Subject<void>();
  inputText: false;

  constructor(
    private formBuilder: FormBuilder,
    private spinner: SpinnerService,
    public activeModal: NgbActiveModal,
    private notification: NotificationService,
    private sharedService: SharedService,
    private repairShopService: MaintenanceService
  ) {
    this.createForm();
  }

  ngOnInit() {
    if (this.inputData.data.type === 'new') {
      this.modalTitle = 'New repair shop';
      setTimeout(() => {
        this.loaded = true;
      });
    } else if (this.inputData.data.type === 'edit') {
      this.setForm(this.inputData.data.shop);
      this.modalTitle = 'Edit repair shop';
    }
  }

  setForm(data: any) {
    if (data.doc.address !== null && data.doc.address.address !== '') {
      this.isValidAddress = true;
    }
    this.loaded = true;
    this.repairShopForm.patchValue({
      name: data.name,
      phone: data.doc.phone,
      address: data.doc.address.address,
      address_unit: data.doc.addressUnit,
      types: data.doc.types,
      email: data.doc.email,
      zip: data.doc.address.zip,
      pinned: data.pinned,
      latitude: data.latitude,
      longitude: data.longitude,
    });

    this.repairShopTypes = data.doc.types !== undefined ? data.doc.types : this.repairShopTypes;

    this.address = data.doc.address;

    this.sharedService.touchFormFields(this.repairShopForm);
  }

  public handleAddressChange(address: any) {
    this.isValidAddress = true;
    this.address = this.sharedService.selectAddress(this.repairShopForm, address);
    this.repairShopForm.get('latitude').setValue(address.geometry.location.lat());
    this.repairShopForm.get('longitude').setValue(address.geometry.location.lng());
    this.repairShopForm.get('address').setValue(address.formatted_address);
  }

  addressKeyDown(event: any) {
    this.isValidAddress = false;
    this.address = null;
  }

  manageRepairShop() {
    this.repairShopService.newShopOrEdit = true;
    this.repairShopService.reloadAddRepair = true;
    if (!this.sharedService.markInvalid(this.repairShopForm)) {
      return false;
    }
    if (this.isValidAddress == false) {
      this.notification.warning('Address needs to be valid.', 'Warning:');
      this.addressInput.nativeElement.focus();
      return;
    }

    const repairShop = this.repairShopForm.value;

    repairShop.types = this.repairShopTypes;

    const saveData = {
      name: repairShop.name.toUpperCase(),
      status: 1,
      pinned: repairShop.pinned,
      latitude: repairShop.latitude.toString(),
      longitude: repairShop.longitude.toString(),
      doc: {
        phone: repairShop.phone,
        email: repairShop.email,
        address: this.address,
        addressUnit: repairShop.address_unit,
        types: this.repairShopTypes,
      },
    };

    this.spinner.show(true);

    if (this.inputData.data.type == 'new') {
      this.sharedService.addRepairShop(saveData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (response: any) => {
            this.closeRepairShopEdit();
            this.repairShopForm.reset();
            this.notification.success('Repair shop added successfully.', ' ');
            this.repairShopService.sendShopData(response);
            this.spinner.show(false);
          },
          () => {
            this.sharedService.handleServerError();
          }
        );
    } else {
      this.sharedService.updateRepairShop(saveData, this.inputData.data.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (resp: any) => {
            this.closeRepairShopEdit();
            this.spinner.show(false);
            this.repairShopService.sendShopData(resp);
            this.notification.success('Repair shop edited successfully.', ' ');
          },
          () => {
            this.sharedService.handleServerError();
          }
        );
    }
  }

  createForm() {
    this.repairShopForm = this.formBuilder.group({
      name: [null, Validators.required],
      phone: [null, Validators.required],
      address: [null, Validators.required],
      address_unit: '',
      zip: [null],
      types: [null],
      email: ['', Validators.email],
      pinned: ['0'],
      latitude: [null],
      longitude: [null],
    });
    this.transformInputData();
  }

  clearList(event: any) {
    if (!event) {
      this.zipCodes = [];
    }
  }

  keyDownFunction(event: any) {
    if (event.keyCode == 13 && event.target.localName !== 'textarea') {
      this.manageRepairShop();
    }
  }

  closeRepairShopEdit() {
    this.activeModal.close();
  }

  /* Form Validation on paste and word validation */
  onPaste(event: any, inputID: string, index?: number) {
    event.preventDefault();

    if (index !== undefined) {
      (document.getElementById(inputID + index) as HTMLInputElement).value = checkSelectedText(inputID, index);
    } else {
      (document.getElementById(inputID) as HTMLInputElement).value = checkSelectedText(inputID, index);
    }

    this.numOfSpaces = 0;

    if (inputID === 'email') {
      this.fomratType = /^[!#$%^&*()_+\=\[\]{};':"\\|,<>\/?]*$/;
      (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
        event.clipboardData.getData('Text'),
        this.fomratType,
        false
      );
    }
    (document.getElementById(inputID) as HTMLInputElement).value += pasteCheck(
      event.clipboardData.getData('Text'),
      this.fomratType,
      true
    );

    this.repairShopForm.controls[inputID].patchValue((document.getElementById(inputID) as HTMLInputElement).value);
  }

  onShopNameTyping(event) {
    let k;
    k = event.charCode;
    if (k == 32) {
      this.numOfSpaces++;
    } else {
      this.numOfSpaces = 0;
    }
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
        k == 8 ||
        k == 32 ||
        (k >= 42 && k <= 46) ||
        k === 64 ||
        k === 61 ||
        (k >= 35 && k <= 38)
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
    return emailChack(event);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  manageInputValidation(formElement: any) {
    return this.sharedService.manageInputValidation(formElement);
  }

  private transformInputData() {
    const data = {
      name: 'capitalize',
      email: 'lower',
      address_unit: 'upper',
    };

    this.sharedService.handleInputValues(this.repairShopForm, data);
  }

  clearInput(x) {
    this.repairShopForm.controls[x.currentTarget.offsetParent.firstChild.id].reset();
  }

  public onKeyUpMethod(x) {
    this.inputText = x.key;
    x.key === 'Backspace' && !this.repairShopForm.get(x.currentTarget.id).value ? this.inputText = false : this.inputText = x.key;
  }

}
