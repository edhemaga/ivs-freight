import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import {FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription } from 'rxjs';
import { Address } from 'src/app/core/model/address';

import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { SharedService } from 'src/app/core/services/shared/shared.service';
import { SpinnerService } from 'src/app/core/services/spinner/spinner.service';


@Component({
  selector: 'app-settings-insurance-policy-modal',
  templateUrl: './settings-insurance-policy-modal.component.html',
  styleUrls: ['./settings-insurance-policy-modal.component.scss']
})
export class SettingsInsurancePolicyModalComponent {
  @Input() inputData: any;
  modalTitle: string;
  subscription: Subscription[] = [];
  newItem = false;
  isValidAddress = false;
  textRows = 1;
  loaded = false;
  public fomratType = /^[!#$%^&*()_+\-=\[\]{};':"\\|,<>\/?]*$/;
  files = [];
  attachments: any = [];
  /* Office Variables */
  officeForm: FormGroup;
  /* Producer Details */
  openProductDetailsDropDown = true;
  @ViewChild('addressInput') addressInput: ElementRef;
  address: Address;
  optionsAddress = {
    componentRestrictions: {country: ['US', 'CA']},
  };
  insuranceDate: any;
  /* Policy Details */
  openPolicyDetailsDropDown = true;
  /* Note */
  showNote = false;
  @ViewChild('note') note: ElementRef;

  constructor(
    private formBuilder: FormBuilder,
    private sharedService: SharedService,
    private companyService: SharedService,
    private shared: SharedService,
    private spinner: SpinnerService,
    private activeModal: NgbActiveModal,
    private notification: NotificationService
  ) {
  }

  ngOnInit() {
    this.createForm();

    if (this.inputData.type === 'edit') {
      this.setForm(this.inputData.company.doc.insurancePolicy[this.inputData.id]);
    }
  }

  setForm(data: any) {
    this.modalTitle = 'Edit Insurance Policy';
    this.officeForm.patchValue({
      producer: data.producer,
      phone: data.phone,
      email: data.email,
      address: data.address && data.address.address ? data.address.address : '',
      addressUnit: data.addressUnit,
      startDate: new Date(data.startDate),
      endDate: new Date(data.endDate)
    });

    this.insuranceDate = data.insuranceType;

    this.shared.touchFormFields(this.officeForm);
  }

  /* Open Selected Modal */
  onOpenDropDown(dropName: string) {
    switch (dropName) {
      case 'Producer':
        this.openProductDetailsDropDown = !this.openProductDetailsDropDown;
        break;
      case 'Policy':
        this.openPolicyDetailsDropDown = !this.openPolicyDetailsDropDown;
        break;
    }
  }

  createForm() {
    this.modalTitle = 'Add Insurance Policy';

    this.officeForm = this.formBuilder.group({
      producer: ['', Validators.required],
      phone: null,
      email: ['', Validators.pattern(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/)],
      address: '',
      addressUnit: '',
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

    this.transformInputData();
  }

  onInsuranceCreated(insurance: any) {
    this.insuranceDate = insurance;
  }

  /* Save Office Data */
  saveInsurancePolicy() {
    if (!this.shared.markInvalid(this.officeForm)) {
      return false;
    }

    if (!this.insuranceDate?.length) {
      this.notification.warning('Insurance type must be added', 'Warning:');
      this.spinner.show(false);
      return false;
    }

    const officeData = this.officeForm.getRawValue();

    const saveData = {
      producer: officeData.producer,
      phone: officeData.phone,
      email: officeData.email,
      address: this.address,
      addressUnit: officeData.addressUnit,
      startDate: officeData.startDate,
      endDate: officeData.endDate,
      note: '',
      attachments: [],
      insuranceType: this.insuranceDate,
    };

    const dataOfCompany = {
      activeTrailerCount: this.inputData.company.activeTrailerCount,
      activeTruckCount: this.inputData.company.activeTruckCount,
      autoInvoiced: this.inputData.company.autoInvoiced,
      category: this.inputData.company.category,
      categoryId: this.inputData.company.categoryId,
      companyDivision: this.inputData.company.companyDivision,
      createdAt: this.inputData.company.createdAt,
      doc: {
        additional: this.inputData.company.doc.additional,
        factoringCompany: this.inputData.company.doc.factoringCompany,
        offices: this.inputData.company.doc.offices,
        insurancePolicy: this.inputData.company.doc.insurancePolicy ? this.inputData.company.doc.insurancePolicy : []
      },
      factoringCompany: this.inputData.company.factoringCompany,
      offices: this.inputData.company.offices,
      driverCommission: this.inputData.company.driverCommission,
      driverEmptyMilePrice: this.inputData.company.driverEmptyMilePrice,
      driverLoadedMilePrice: this.inputData.company.driverLoadedMilePrice,
      endingIn: this.inputData.company.endingIn,
      endingInId: this.inputData.company.endingInId,
      guid: this.inputData.company.guid,
      id: this.inputData.company.id,
      inactiveTrailerCount: this.inputData.company.inactiveTrailerCount,
      inactiveTruckCount: this.inputData.company.inactiveTruckCount,
      invoicingDay: this.inputData.company.invoicingDay,
      isOwner: this.inputData.company.isOwner,
      name: this.inputData.company.name,
      ownerCommission: this.inputData.company.ownerCommission,
      parentId: this.inputData.company.parentId,
      payPeriod: this.inputData.company.payPeriod,
      payPeriodId: this.inputData.company.payPeriodId,
      protected: this.inputData.company.protected,
      secretKey: this.inputData.company.secretKey,
      startLoadNumber: this.inputData.company.startLoadNumber,
      subscribed: this.inputData.company.subscribed,
      subscribedUntil: this.inputData.company.subscribedUntil,
      subscriptionExpired: this.inputData.company.subscriptionExpired,
      subscriptionRemainingDays: this.inputData.company.subscriptionRemainingDays,
      taxNumber: this.inputData.company.taxNumber,
      trailerStatByType: this.inputData.company.trailerStatByType,
      trialExpired: this.inputData.company.trialExpired,
      trialRemainingDays: this.inputData.company.trialRemainingDays,
      trialUntil: this.inputData.company.trialUntil,
      truckStatByType: this.inputData.company.truckStatByType,
      updatedAt: this.inputData.company.updatedAt,
      used: this.inputData.company.used,
    };


    if (this.inputData.type === 'new') {
      dataOfCompany.doc.insurancePolicy.push(saveData);
    } else {
      dataOfCompany.doc.insurancePolicy[this.inputData.id] = saveData;
    }

    //this.companyService.saveCompany(dataOfCompany);
    //this.closeInsurancePolicyModal();
  }

  /* Get Address */
  public handleAddressChange(address: any) {
    this.address = this.shared.selectAddress(this.officeForm, address);
  }

  /* Set Files */
  setFiles(files: any) {
    this.files = files;
  }

  /* Open Dropdown */
  openNote() {
    this.showNote = !this.showNote;
    if (this.showNote) {
      setTimeout(() => {
        this.note.nativeElement.focus();
      }, 250);
    }
  }

  closeModal() {
    this.activeModal.close();
  }

  ngOnDestroy() {
  }

  private transformInputData() {
    const data = {
      producer: 'upper',
      email: 'lower',
      addressUnit: 'upper',
    };

    this.shared.handleInputValues(this.officeForm, data);
  }
}
