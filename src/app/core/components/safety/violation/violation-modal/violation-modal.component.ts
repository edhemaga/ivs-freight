import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { tab_modal_animation } from '../../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { AddressEntity } from 'appcoretruckassist';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { FormService } from 'src/app/core/services/form/form.service';
import { untilDestroyed } from 'ngx-take-until-destroy';

@Component({
  selector: 'app-violation-modal',
  templateUrl: './violation-modal.component.html',
  styleUrls: ['./violation-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
  providers: [FormService, ModalService],
})
export class ViolationModalComponent implements OnInit, OnDestroy {
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

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();

    if (this.editData) {
      this.editViolationById(this.editData.id);
    }
  }

  private createForm() {
    this.violationForm = this.formBuilder.group({
      report: [null, Validators.required],
      inspectionLevel: [null],
      hmInspectionLevel: [null],
      country: [null],
      state: [null],
      date: [null],
      start: [null],
      end: [null],
      driverName: [null],
      driverLicenceNumber: [null],
      driverState: [null],
      driverDOB: [null],
      coDriverName: [null],
      coDriverLicenceNumber: [null],
      coDriverState: [null],
      coDriverDOB: [null],
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
          code: ['392.2-SLLS3'],
          categoryId: ['Vehicle Maintenance'],
          unit: ['Trailer'],
          sw: ['10+2'],
          oos: [true],
          sms: [false],
          description: ['Allowing or requiring a driver to use i…'],
        }),
      ]),
      note: [null],
      policeDepartment: [null],
      policeOfficer: [null],
      badgeNumber: [null],
      addressAuthority: [null],
      phoneAuthority: [null],
      faxAuthority: [null],
      facility: [null],
      highway: [null],
      milePost: [null],
      originAddress: [null],
      destinationAddress: [null],
      customer: [null],
      bol: [null],
      cargo: [null],
    });

    // this.formService.checkFormChange(this.violationForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
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
        this.violationForm.reset();
        break;
      }
      case 'save': {
        if (this.violationForm.invalid) {
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

  ngOnDestroy(): void {}
}
