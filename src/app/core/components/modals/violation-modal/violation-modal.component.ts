import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tab_modal_animation } from '../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { AddressEntity } from 'appcoretruckassist';
import { ModalService } from '../../shared/ta-modal/modal.service';
import {
  addressValidation,
  departmentValidation,
  descriptionValidation,
  fullNameValidation,
  phoneFaxRegex,
  vinNumberValidation,
} from '../../shared/ta-input/ta-input.regex-validations';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../services/form/form.service';
import { RoadsideService } from '../../safety/violation/state/roadside.service';
import { NotificationService } from '../../../services/notification/notification.service';
import { RoadsideInspectionResponse } from '../../../../../../appcoretruckassist/model/roadsideInspectionResponse';
import { convertDateFromBackend } from '../../../utils/methods.calculations';
import moment from 'moment';
import { AccidentTService } from '../../safety/accident/state/accident.service';
import { AccidentModalResponse } from '../../../../../../appcoretruckassist/model/accidentModalResponse';

@Component({
  selector: 'app-violation-modal',
  templateUrl: './violation-modal.component.html',
  styleUrls: ['./violation-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  providers: [ModalService, FormService],
})
export class ViolationModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() editData: any;

  public violationForm: FormGroup;

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

  public specialChecks: any[] = [
    {
      id: 1,
      name: 'Alc / Cont. Sub. Check',
      active: false,
    },
    {
      id: 2,
      name: 'Cond. by Local Juris.',
      active: false,
    },
    {
      id: 3,
      name: 'Size & Weight Enf.',
      active: false,
    },
    {
      id: 4,
      name: 'eScreen Inspection',
      active: false,
    },
    {
      id: 5,
      name: 'Traffic Enforcement',
      active: false,
    },
    {
      id: 6,
      name: 'PASA Cond. Insp.',
      active: false,
    },
    {
      id: 7,
      name: 'Drug Interd. Search',
      active: false,
    },
    {
      id: 8,
      name: 'Border Enf. Inspection',
      active: false,
    },
    {
      id: 9,
      name: 'Post Crash Inspection',
      active: false,
    },
    {
      id: 10,
      name: 'PBBT Inspection',
      active: false,
    },
  ];
  public isSpecialChecksOpen: boolean = true;

  public animationObject = {
    value: this.selectedTab,
    params: { height: '0px' },
  };

  public selectedAuthorityAddress: AddressEntity;
  public selectedAuthorityOrigin: AddressEntity;
  public selectedAuthorityDestination: AddressEntity;

  public selectedViolationCustomer: any = null;
  public labelsViolationCustomer: any[] = [];

  public documents: any[] = [];

  public isFormDirty: boolean;

  public violationModalName: string = null;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private formService: FormService,
    private roadsideService: RoadsideService,
    private accidentTService: AccidentTService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();
    this.getModalDropdowns();

    if (this.editData) {
      this.editViolationById(this.editData.id);
    }
  }

  private createForm() {
    this.violationForm = this.formBuilder.group({
      report: [null, Validators.required],
      inspectionLevel: [null],
      hmInspectionType: [null],
      county: [null],
      state: [null],
      startTime: [null],
      endTime: [null],
      date: [null],
      // Driver
      driverName: [null, [...fullNameValidation]],
      driverLicenceNumber: [null],
      driverState: [null],
      driverDOB: [null],
      // Co Driver
      coDriverName: [null, [...fullNameValidation]],
      coDriverLicenceNumber: [null],
      coDriverState: [null],
      coDriverDOB: [null],
      // Truck
      truck_Unit: [null],
      truck_Type: [null],
      truck_Make: [null],
      truck_PlateNo: [null],
      truck_State: [null],
      truck_VIN: [null, [...vinNumberValidation]],
      // Trailer
      trailer_Unit: [null],
      trailer_Type: [null],
      trailer_Make: [null],
      trailer_PlateNo: [null],
      trailer_State: [null],
      trailer_VIN: [null, [...vinNumberValidation]],
      // Violation
      violations: this.formBuilder.array([]),
      note: [null],
      policeDepartment: [null, [...departmentValidation]],
      policeOfficer: [null],
      badgeNo: [null],
      address: [null, [...addressValidation]],
      phone: [null, phoneFaxRegex],
      fax: [null, phoneFaxRegex],
      facility: [null],
      highway: [null],
      milePost: [null],
      origin: [null, [...addressValidation]],
      destination: [null, [...addressValidation]],
      customer: [null],
      boL: [null],
      cargo: [null],
    });

    this.formService.checkFormChange(this.violationForm);
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

  public onModalAction(data: { action: string; bool: boolean }): void {
    // Update
    switch (data.action) {
      case 'close': {
        break;
      }
      case 'save': {
        if (this.violationForm.invalid || !this.isFormDirty) {
          this.inputService.markInvalid(this.violationForm);
          return;
        }
        if (this.editData) {
          this.updateViolation(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public get violations(): FormArray {
    return this.violationForm.get('violations') as FormArray;
  }

  public createViolation(data: {
    code: string;
    category: string;
    unit: string;
    sw: string;
    oos: boolean;
    sms: boolean;
    description: string;
    extraDescription: string;
  }) {
    return this.formBuilder.group({
      code: [data.code],
      category: [data.category],
      unit: [data.unit],
      sw: [data.sw],
      oos: [data.oos],
      sms: [data.sms],
      description: [data.description, [...descriptionValidation]],
      extraDescription: [data.extraDescription, [...descriptionValidation]],
    });
  }

  public addViolation(data: {
    code: string;
    category: string;
    unit: string;
    sw: string;
    oos: boolean;
    sms: boolean;
    description: string;
    extraDescription: string;
  }) {
    this.violations.push(this.createViolation(data));
  }

  public onHandleAddress(
    event: {
      address: AddressEntity | any;
      valid: boolean;
    },
    action
  ) {
    switch (action) {
      case 'address-authority': {
        if (event.valid) this.selectedAuthorityAddress = event;
        break;
      }
      case 'address-origin': {
        if (event.valid) this.selectedAuthorityOrigin = event;
        break;
      }
      case 'address-destination': {
        if (event.valid) this.selectedAuthorityDestination = event;
        break;
      }
    }
  }

  public onSelectDropDown(event: any) {
    this.selectedViolationCustomer = event;
  }

  public onFilesEvent(event) {
    this.documents = event.files;
  }

  public pickedSpecialChecks() {
    return this.specialChecks.filter((item) => item.active).length;
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  private updateViolation(id: number) {}

  private editViolationById(id: number) {
    this.roadsideService
      .getRoadsideById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: RoadsideInspectionResponse) => {
          this.violationForm.patchValue({
            report: res.report,
            inspectionLevel: res.inspectionLevel,
            hmInspectionType: res.hmInspectionType,
            county: null, //TODO: Wait for backend
            state: res.state ? res.state.stateShortName : null,
            startTime: res.startTime,
            endTime: res.endTime,
            date: res.date ? convertDateFromBackend(res.date) : null,
            // Driver
            driverName: res.driver_FullName,
            driverLicenceNumber: res.driver_LicenceNo,
            driverState: res.driver_State,
            driverDOB: res.driver_DateOfBirth
              ? convertDateFromBackend(res.driver_DateOfBirth)
              : null,
            // Co Driver
            coDriverName: res.coDriver_FullName,
            coDriverLicenceNumber: res.coDriver_LicenceNo,
            coDriverState: res.coDriver_State,
            coDriverDOB: res.coDriver_DateOfBirth
              ? convertDateFromBackend(res.coDriver_DateOfBirth)
              : null,
            // Truck
            truck_Unit: res.truck_Unit,
            truck_Type: res.truck_Type,
            truck_Make: res.truck_Make,
            truck_PlateNo: res.truck_PlateNo,
            truck_State: res.truck_State,
            truck_VIN: res.truck_VIN,
            // Trailer
            trailer_Unit: res.trailer_Unit,
            trailer_Type: res.trailer_Type,
            trailer_Make: res.trailer_Make,
            trailer_PlateNo: res.trailer_PlateNo,
            trailer_State: res.trailer_State,
            trailer_VIN: res.trailer_VIN,
            // Violation
            violations: [],
            note: res.note,
            policeDepartment: res.policeDepartment,
            policeOfficer: res.policeOfficer,
            badgeNo: res.badgeNo,
            address: res.address ? res.address.address : null,
            phone: res.phone,
            fax: res.fax,
            facility: res.facility,
            highway: res.highway,
            milePost: res.milePost,
            origin: res.origin ? res.origin.address : null,
            destination: res.destination ? res.destination.address : null,
            customer: res.broker ? res.broker.businessName : null,
            boL: res.boL,
            cargo: res.cargo,
          });

          this.selectedAuthorityAddress = res.address;
          this.selectedAuthorityOrigin = res.origin;
          this.selectedAuthorityDestination = res.destination;
          this.selectedViolationCustomer = res.broker;

          this.violationModalName = res.report;

          if (res.violations.length) {
            for (let i = 0; i < res.violations.length; i++) {
              this.violations.push(
                this.createViolation({
                  code: res.violations[i].code,
                  category: res.violations[i].category,
                  unit: res.violations[i].unit,
                  sw: res.violations[i].sw,
                  oos: res.violations[i].oos,
                  sms: res.violations[i].sms,
                  description: res.violations[i].description,
                  extraDescription: res.violations[i].extraDescription
                    ? res.violations[i].description?.concat(
                        '.',
                        res.violations[i].extraDescription
                      )
                    : res.violations[i].description,
                })
              );
            }
          }

          if (res.specialChecks.length) {
            for (let i = 0; i < this.specialChecks.length; i++) {
              for (let j = 0; j < res.specialChecks.length; j++) {
                if (
                  this.specialChecks[i].name ===
                  res.specialChecks[j].specialChecks.name
                ) {
                  this.specialChecks[i].active = res.specialChecks[j].active;
                  break;
                }
              }
            }
          }
        },
        error: (err: any) => {
          this.notificationService.error('Error', err);
        },
      });
  }

  private getModalDropdowns() {
    this.accidentTService
      .getModalDropdowns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: AccidentModalResponse) => {
          this.labelsViolationCustomer = res.brokers.map((item) => {
            return {
              id: item.id,
              name: item.businessName,
            };
          });
        },
        error: (err: any) => {
          this.notificationService.error('Error', err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
