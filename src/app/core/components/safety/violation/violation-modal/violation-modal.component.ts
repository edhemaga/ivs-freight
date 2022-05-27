import { Address } from 'src/app/core/model/address';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { tab_modal_animation } from '../../../shared/animations/tabs-modal.animation';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { AddressEntity } from 'appcoretruckassist';

@Component({
  selector: 'app-violation-modal',
  templateUrl: './violation-modal.component.html',
  styleUrls: ['./violation-modal.component.scss'],
  animations: [tab_modal_animation('animationTabsModal')],
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

  public selectedAuthorityAddress: Address | AddressEntity;
  public selectedAuthorityOrigin: Address | AddressEntity;
  public selectedAuthorityDestination: Address | AddressEntity;

  public selectedViolationCustomer: any = null;
  public labelsViolationCustomer: any[] = [];

  public documents: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.createForm();

    if (this.editData) {
      // TODO: KAD SE POVEZE TABELA, ONDA SE MENJA
      this.editData = {
        ...this.editData,
        id: 1,
      };
      this.editViolationById(this.editData.id);
    }
  }

  private createForm() {
    this.violationForm = this.formBuilder.group({
      report: [null],
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
      violations: this.formBuilder.array([]),
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
    if (data.action === 'save') {
      if (this.violationForm.invalid) {
        this.inputService.markInvalid(this.violationForm);
        return;
      }
      if (this.editData) {
        this.updateViolation(this.editData.id);
      }
    }

    this.ngbActiveModal.close();
  }

  public onHandleAddress(event: any, action) {
    switch(action) {
      case 'address-authority': {
        this.selectedAuthorityAddress = event;
        break;
      }
      case 'address-origin': {
        this.selectedAuthorityOrigin = event;
        break;
      }
      case 'address-destination': {
        this.selectedAuthorityDestination = event;
        break;
      }
    }
  }

  public onSelectDropDown(event: any) {
    this.selectedViolationCustomer = event;
  }

  public onFilesEvent(event) {
    console.log(event)
  }

  public pickedSpecialChecks() {
    return this.specialChecks.filter(item => item.active).length;
  }

  public identity(index: number, item: any): number {
    return item.id;
  }

  private updateViolation(id: number) {}

  private editViolationById(id: number) {}

  ngOnDestroy(): void {}
}
