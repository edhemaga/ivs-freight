import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { tab_modal_animation } from '../../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { AddressEntity } from 'appcoretruckassist';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import {
  addressValidation,
  departmentValidation,
  descriptionValidation,
  fullNameValidation,
  phoneFaxRegex,
  vinNumberValidation,
} from '../../../shared/ta-input/ta-input.regex-validations';
import { Subject, takeUntil } from 'rxjs';
import { FormService } from '../../../../services/form/form.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();

    if (this.editData) {
      this.editViolationById(this.editData.id);
    }

    this.addViolation({
      code: '392.2-SLLS3',
      category: 'Vehicle Maintenance',
      unit: 'Trailer',
      sw: '10+2',
      oos: true,
      sms: false,
      description: 'Allowing or requiring a driver to use i…',
    });
  }

  private createForm() {
    this.violationForm = this.formBuilder.group({
      report: [null, Validators.required],
      inspectionLevel: [null],
      hmInspectionType: [null],
      country: [null],
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
      location: [null, [...addressValidation]],
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
          if (this.isFormDirty) {
            this.updateViolation(this.editData.id);
            this.modalService.setModalSpinner({ action: null, status: true });
          }
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
  }) {
    return this.formBuilder.group({
      code: [data.code],
      category: [data.category],
      unit: [data.unit],
      sw: [data.sw],
      oos: [data.oos],
      sms: [data.sms],
      description: [data.description, [...descriptionValidation]],
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

  private editViolationById(id: number) {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
