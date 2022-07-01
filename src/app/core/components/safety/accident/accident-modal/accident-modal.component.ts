import {
  phoneRegex,
  emailRegex,
} from './../../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { tab_modal_animation } from '../../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { AddressEntity } from 'appcoretruckassist';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { DropZoneConfig } from '../../../shared/ta-modal-upload/ta-upload-dropzone/ta-upload-dropzone.component';

@Component({
  selector: 'app-accident-modal',
  templateUrl: './accident-modal.component.html',
  styleUrls: ['./accident-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
})
export class AccidentModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public accidentForm: FormGroup;

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
  ];

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public documents: any[] = [];
  public media: any[] = [];

  public labelsViolationCustomer: any[] = [];
  public labelsTrailerUnits: any[] = [];
  public labelsInsuranceType: any[] = [];

  public selectedInsuranceType: any[] = [];

  public selectedViolationCustomer: any = null;
  public selectedTrailerUnit: any = null;

  public addressLocation: AddressEntity = null;
  public addressDestination: AddressEntity = null;
  public addressOrigin: AddressEntity = null;
  public addressAuthority: AddressEntity = null;

  public dropZoneConfigFile: DropZoneConfig = {
    dropZoneType: 'files', // files | image | media
    dropZoneSvg: 'assets/svg/common/ic_files_dropzone.svg',
    dropZoneAvailableFiles: 'application/pdf, application/png, application/jpg',
    multiple: true,
    globalDropZone: false,
  };

  public dropZoneConfigMedia: DropZoneConfig = {
    dropZoneType: 'media',
    dropZoneAvailableFiles: 'video/mp4,video/x-m4v,video/*',
    dropZoneSvg: 'assets/svg/common/ic_media_dropzone.svg',
    multiple: false,
    globalDropZone: false,
  };

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private notificationService: NotificationService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    if (this.editData) {
      this.editAccidentById(this.editData.id);
    }
    this.createForm();
  }

  private createForm() {
    this.accidentForm = this.formBuilder.group({
      report: [null],
      federallyRecordable: [null],
      stateRecordable: [null],
      injury: [null],
      fatality: [null],
      towing: [null],
      hazmat: [null],
      vehicleNumber: [null],
      location: [null],
      date: [null],
      time: [null],
      driverName: [null],
      driverLicenceNumber: [null],
      driverState: [null],
      driverDOB: [null],
      truckUnit: [null],
      truckType: [null],
      truckMake: [null],
      truckPlateNumber: [null],
      truckState: [null],
      truckVIN: [null],
      trailerUnit: [null],
      trailerType: [null],
      trailerMake: [null],
      trailerPlateNumber: [null],
      trailerState: [null],
      trailerVIN: [null],
      violations: this.formBuilder.array([
        this.formBuilder.group({
          categoryId: ['Crash Indicator'],
          sw: ['2'],
          hm: [true],
          description: ['Involves tow-away but no injury or fatality'],
        }),
      ]),
      insurance: this.formBuilder.array([]),
      insuranceType: [null],
      insuranceClaimNumber: [null],
      insuranceAdjuster: [null],
      insurancePhone: [null, phoneRegex],
      insuranceEmail: [null, emailRegex],
      note: [null],
      roadwayTrafficWay: [null],
      weatherCondition: [null],
      roadAccessControl: [null],
      roadSurfaceCondition: [null],
      lightCondition: [null],
      reportingAgency: [null],
      authorityPoliceOffice: [null],
      authorityBadgeNumber: [null],
      authorityAddress: [null],
      authorityPhone: [null, phoneRegex],
      authorityFax: [null],
      shippingOriginLocation: [null],
      shippingDestinationLocation: [null],
      shippingCustomer: [null],
      shippingBOL: [null],
      shippingCargo: [null],
    });
  }

  public tabChange(event: any): void {
    this.selectedTab = event.id;
    let dotAnimation = document.querySelector('.animation-two-tabs');
    this.animationObject = {
      value: this.selectedTab,
      params: { height: `${dotAnimation.getClientRects()[0].height}px` },
    };
  }

  public get violations(): FormArray {
    return this.accidentForm.get('violations') as FormArray;
  }

  public get insurances(): FormArray {
    return this.accidentForm.get('insurance') as FormArray;
  }

  private createInsurance(): FormGroup {
    return this.formBuilder.group({
      insuranceType: [null],
      claimNumber: [null],
      insuranceAdjuster: [null],
      phone: [null, phoneRegex],
      email: [null, emailRegex],
    });
  }

  public addInsurance(event: any) {
    if (event) {
      this.insurances.push(this.createInsurance());
    }
  }

  public removeInsurance(id: number) {
    this.insurances.removeAt(id);
    this.selectedInsuranceType.splice(id, 1);
  }

  public onModalAction(data: { action: string; bool: boolean }): void {
    switch (data.action) {
      case 'close': {
        this.accidentForm.reset();
        break;
      }
      case 'save': {
        if (this.accidentForm.invalid) {
          this.inputService.markInvalid(this.accidentForm);
          return;
        }
        if (this.editData) {
          this.updateAccident(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addAccident();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public editAccidentById(id: number) {}

  private updateAccident(id: number) {}

  private addAccident() {}

  public onHandleAddress(
    event: {
      address: AddressEntity | any;
      valid: boolean;
    },
    action
  ) {
    switch (action) {
      case 'address-authority': {
        this.addressAuthority = event;
        break;
      }
      case 'address-origin': {
        this.addressOrigin = event;
        break;
      }
      case 'address-destination': {
        this.addressDestination = event;
        break;
      }
      case 'location': {
        this.addressLocation = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onFilesEvent(event: any) {
    switch (event.type) {
      case 'documents': {
        this.documents = event.files;
        break;
      }
      case 'media': {
        this.media = event.files;
        break;
      }
      default: {
        break;
      }
    }
  }

  public onSelectDropDown(event: any, action: string, index?: number) {
    switch (action) {
      case 'shipping-customer': {
        this.selectedViolationCustomer = event;
        break;
      }
      case 'trailer-unit': {
        this.selectedTrailerUnit = event;
        break;
      }
      case 'insurance-type': {
        break;
      }
      case 'insurance-type': {
        this.selectedInsuranceType[index] = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {}
}
