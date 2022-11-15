import {
  phoneFaxRegex,
  addressValidation,
  vinNumberValidation,
  descriptionValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AddressEntity } from 'appcoretruckassist';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../services/form/form.service';

@Component({
  selector: 'app-accident-modal',
  templateUrl: './accident-modal.component.html',
  styleUrls: ['./accident-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  providers: [ModalService, FormService],
})
export class AccidentModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
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

  public isLocationAndShippingOpen: boolean = true;

  public isFormDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private formService: FormService
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
      location: [null, [...addressValidation]],
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
      truckVIN: [null, [...vinNumberValidation]],
      trailerUnit: [null],
      trailerType: [null],
      trailerMake: [null],
      trailerPlateNumber: [null],
      trailerState: [null],
      trailerVIN: [null, [...vinNumberValidation]],
      violations: this.formBuilder.array([
        this.formBuilder.group({
          categoryId: ['Crash Indicator'],
          sw: ['2'],
          hm: [true],
          description: [
            'Involves tow-away but no injury or fatality',
            [...descriptionValidation],
          ],
        }),
      ]),
      insurance: this.formBuilder.array([]),
      insuranceType: [null],
      insuranceClaimNumber: [null],
      insuranceAdjuster: [null],
      insurancePhone: [null, phoneFaxRegex],
      insuranceEmail: [null],
      note: [null],
      roadwayTrafficWay: [null],
      weatherCondition: [null],
      roadAccessControl: [null],
      roadSurfaceCondition: [null],
      lightCondition: [null],
      reportingAgency: [null],
      authorityPoliceOffice: [null],
      authorityBadgeNumber: [null],
      authorityAddress: [null, [...addressValidation]],
      authorityPhone: [null, phoneFaxRegex],
      authorityFax: [null, phoneFaxRegex],
      shippingOriginLocation: [null, [...addressValidation]],
      shippingDestinationLocation: [null, [...addressValidation]],
      shippingCustomer: [null],
      shippingBOL: [null],
      shippingCargo: [null],
    });

    this.inputService.customInputValidator(
      this.accidentForm.get('insuranceEmail'),
      'email',
      this.destroy$
    );

    this.formService.checkFormChange(this.accidentForm);
    this.formService.formValueChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormChange: boolean) => {
        this.isFormDirty = isFormChange;
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
      phone: [null, phoneFaxRegex],
      email: [null],
    });
  }

  public addInsurance(event: { check: boolean; action: string }) {
    const form = this.createInsurance();
    if (event.check) {
      this.insurances.push(form);
    }

    this.inputService.customInputValidator(
      form.get('email'),
      'email',
      this.destroy$
    );
  }

  public removeInsurance(id: number) {
    this.insurances.removeAt(id);
    this.selectedInsuranceType.splice(id, 1);
  }

  public onModalAction(data: { action: string; bool: boolean }): void {
    switch (data.action) {
      case 'close': {
        break;
      }
      case 'save': {
        if (this.accidentForm.invalid || !this.isFormDirty) {
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
        if (event.valid) this.addressAuthority = event;
        break;
      }
      case 'address-origin': {
        if (event.valid) this.addressOrigin = event;
        break;
      }
      case 'address-destination': {
        if (event.valid) this.addressDestination = event;
        break;
      }
      case 'location': {
        if (event.valid) this.addressLocation = event;
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
        this.selectedInsuranceType[index] = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
