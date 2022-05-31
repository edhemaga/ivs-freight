import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {
  CdlResponse,
  CreateCdlCommand,
  CreateCdlResponse,
  DriverResponse,
  EditCdlCommand,
  GetCdlModalResponse,
} from 'appcoretruckassist';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { CdlTService } from '../../../state/cdl.service';
import { DriverTService } from '../../../state/driver.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import moment from 'moment';

@Component({
  selector: 'app-driver-cdl-modal',
  templateUrl: './driver-cdl-modal.component.html',
  styleUrls: ['./driver-cdl-modal.component.scss'],
})
export class DriverCdlModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public cdlForm: FormGroup;

  public modalName: string = null;

  public canadaStates: any[] = [];
  public usStates: any[] = [];
  public classTypes: any[] = [];
  public countryTypes: any[] = [];
  public stateTypes: any[] = [];
  public endorsements: any[] = [];
  public restrictions: any[] = [];

  public selectedClassType: any = null;
  public selectedCountryType: any = null;
  public selectedStateType: any = null;

  public documents: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverTService,
    private cdlService: CdlTService,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getCdlDropdowns();
    this.countryStateChange();
    this.getDriverById(this.editData.id);

    if (this.editData.type === 'edit-licence') {
      this.getCdlById();
    }
  }

  private createForm() {
    this.cdlForm = this.formBuilder.group({
      cdlNumber: [null, Validators.required],
      issueDate: [null, Validators.required],
      expDate: [null, Validators.required],
      classType: [null, Validators.required],
      countryType: [null, Validators.required],
      stateId: [null],
      restrictions: [null],
      endorsements: [null],
      note: [null],
    });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    if (data.action === 'close') {
      this.cdlForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        // If Form not valid
        if (this.cdlForm.invalid) {
          this.inputService.markInvalid(this.cdlForm);
          return;
        }
        if (this.editData.type === 'edit-licence') {
          this.updateCdl();
        } else {
          this.addCdl();
        }
      }

      this.ngbActiveModal.close();
    }
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'class': {
        this.selectedClassType = event;
        break;
      }
      case 'country': {
        this.selectedCountryType = event;

        if (this.selectedCountryType.name.toLowerCase() === 'us') {
          this.stateTypes = this.usStates;
        } else {
          this.stateTypes = this.canadaStates;
        }
        break;
      }
      case 'state': {
        this.selectedStateType = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  private countryStateChange() {
    this.cdlForm
      .get('countryType')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (value) {
          this.inputService.changeValidators(this.cdlForm.get('stateId'));
        } else {
          this.inputService.changeValidators(
            this.cdlForm.get('stateId'),
            false
          );
        }
      });
  }

  private getCdlDropdowns() {
    this.cdlService
      .getCdlDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: GetCdlModalResponse) => {
          this.canadaStates = res.canadaStates.map((item) => {
            return {
              id: item.id,
              name: item.stateShortName,
              stateName: item.stateName,
            };
          });
          this.usStates = res.usStates.map((item) => {
            return {
              id: item.id,
              name: item.stateShortName,
              stateName: item.stateName,
            };
          });
          this.classTypes = res.classTypes;
          this.countryTypes = res.countryTypes;
          this.endorsements = res.endorsements;
          this.restrictions = res.restrictions;
        },
        error: () => {
          this.notificationService.error(
            "Cdl's dropdowns can't be loaded.",
            'Error:'
          );
        },
      });
  }

  private getDriverById(id: number) {
    this.driverService
      .getDriverById(id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: DriverResponse) => {
          this.modalName = res.firstName.concat(' ', res.lastName);
        },
        error: () => {
          this.notificationService.error("Driver can't be loaded.", 'Error:');
        },
      });
  }

  public getCdlById() {
    this.cdlService
      .getCdlById(this.editData.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: CdlResponse) => {
          this.cdlForm.patchValue({
            cdlNumber: res.cdlNumber,
            issueDate: moment(new Date(res.issueDate)).format('YYYY-MM-DD'),
            expDate: moment(new Date(res.expDate)).format('YYYY-MM-DD'),
            classType: res.classType,
            countryType: res.countryType,
            stateId: res.state.stateName,
            restrictions: res.cdlRestrictions,
            endorsements: res.cdlEndorsements,
            note: res.note,
          });
          this.selectedClassType = res.classType;
          this.selectedCountryType = res.countryType;
          this.selectedStateType = res.state;
        },
        error: () => {
          this.notificationService.error("Can't get CDL", 'Error:');
        },
      });
  }

  public updateCdl() {
    const { issueDate, expDate } = this.cdlForm.value;

    const newData: EditCdlCommand = {
      id: this.editData.id,
      ...this.cdlForm.value,
      issueDate: new Date(issueDate).toISOString(),
      expDate: new Date(expDate).toISOString(),
      classType: this.selectedClassType.name,
      countryType: this.selectedCountryType.name,
      stateId: this.selectedStateType.id,
      restrictions: null,
      endorsements: null,
    };

    this.cdlService
      .addCdl(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'CDL successfully updated.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("CDL can't be updated.", 'Error:');
        },
      });
  }

  public addCdl() {
    const { issueDate, expDate } = this.cdlForm.value;

    const newData: CreateCdlCommand = {
      driverId: this.editData.id,
      ...this.cdlForm.value,
      issueDate: new Date(issueDate).toISOString(),
      expDate: new Date(expDate).toISOString(),
      classType: this.selectedClassType.name,
      countryType: this.selectedCountryType.name,
      stateId: this.selectedStateType.id,
      restrictions: null,
      endorsements: null,
    };

    this.cdlService
      .addCdl(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'CDL successfully added.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("CDL can't be added.", 'Error:');
        },
      });
  }

  public onFilesEvent(event: any) {
    console.log(event);
  }

  ngOnDestroy(): void {}
}
