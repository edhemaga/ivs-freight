import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  CdlResponse,
  DriverResponse,
  GetCdlModalResponse,
} from 'appcoretruckassist';
import { CdlTService } from '../../../driver/state/cdl.service';
import { DriverTService } from '../../../driver/state/driver.service';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { NotificationService } from '../../../../services/notification/notification.service';
import { FormService } from '../../../../services/form/form.service';
import {
  convertDateFromBackend,
  convertDateToBackend,
} from '../../../../utils/methods.calculations';
import {
  cdlCANADAValidation,
  cdlUSValidation,
} from 'src/app/core/components/shared/ta-input/ta-input.regex-validations';
import { DetailsDataService } from '../../../../services/details-data/details-data.service';

@Component({
  selector: 'app-driver-cdl-modal',
  templateUrl: './driver-cdl-modal.component.html',
  styleUrls: ['./driver-cdl-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class DriverCdlModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public cdlForm: FormGroup;

  public modalName: string = null;

  public classTypes: any[] = [];

  public stateTypes: any[] = [];
  public endorsements: any[] = [];
  public restrictions: any[] = [];

  public selectedRestrictions: any[] = [];
  public selectedEndorsments: any[] = [];
  public selectedClassType: any = null;

  public selectedStateType: any = null;
  public selectedCountryType: string = 'US';

  public documents: any[] = [];

  public isFormDirty: boolean;

  fileModified: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverTService,
    private cdlService: CdlTService,
    private inputService: TaInputService,
    private modalService: ModalService,
    private notificationService: NotificationService,
    private formService: FormService,
    private DetailsDataService: DetailsDataService
  ) {}

  ngOnInit(): void {
    this.getCdlDropdowns();
    this.createForm();
    this.getDriverById(this.editData.id);

    if (this.editData.type === 'edit-licence') {
      this.getCdlById();
    }

    if (this.editData.type === 'renew-licence') {
      this.populateCdlForm(this.editData.renewData);
    }
  }

  private createForm() {
    const cdlCountryTypeValidation =
      this.selectedCountryType === 'US' ? cdlUSValidation : cdlCANADAValidation;
    this.cdlForm = this.formBuilder.group({
      cdlNumber: [null, [Validators.required, ...cdlCountryTypeValidation]],
      issueDate: [null, Validators.required],
      expDate: [null, Validators.required],
      classType: [null, Validators.required],
      stateId: [null, Validators.required],
      restrictions: [null],
      endorsements: [null],
      note: [null],
      files: [null],
    });

    this.formService.checkFormChange(this.cdlForm);
    this.formService.formValueChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormChange: boolean) => {
        this.isFormDirty = isFormChange;
      });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        break;
      }
      case 'save': {
        if (this.cdlForm.invalid) {
          this.inputService.markInvalid(this.cdlForm);
          return;
        }
        this.DetailsDataService.setCdlNum(this.cdlForm.get('cdlNumber')?.value);
        if (this.editData.type === 'edit-licence') {
          if (this.isFormDirty) {
            this.updateCdl();
            this.modalService.setModalSpinner({ action: null, status: true });
          }
        } else {
          this.addCdl();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'class': {
        this.selectedClassType = event;
        break;
      }
      case 'state': {
        this.selectedStateType = event;
        break;
      }
      case 'restrictions': {
        this.selectedRestrictions = event;
        break;
      }
      case 'endorsments': {
        this.selectedEndorsments = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  private getCdlDropdowns() {
    this.cdlService
      .getCdlDropdowns()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: GetCdlModalResponse) => {
          this.selectedCountryType = res.country?.name;
          this.stateTypes = res.states.map((item) => {
            return {
              id: item.id,
              name: item.stateShortName,
              stateName: item.stateName,
            };
          });
          this.classTypes = res.classTypes;
          this.endorsements = res.endorsements.map((item) => {
            return {
              ...item,
              name: item.code.concat(' ', '-').concat(' ', item.description),
            };
          });
          this.restrictions = res.restrictions.map((item) => {
            return {
              ...item,
              name: item.code.concat(' ', '-').concat(' ', item.description),
            };
          });
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
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DriverResponse) => {
          this.modalName = res.firstName.concat(' ', res.lastName);
        },
        error: () => {
          this.notificationService.error("Driver can't be loaded.", 'Error:');
        },
      });
  }

  public populateCdlForm(res: any) {
    this.cdlForm.patchValue({
      cdlNumber: res.cdlNumber,
      issueDate: convertDateFromBackend(res.issueDate),
      expDate: convertDateFromBackend(res.expDate),
      classType: res.classType.name,
      stateId: res.state.stateName,
      restrictions: null,
      endorsements: null,
      note: res.note,
      file: res.files ? res.files : null,
    });

    this.documents = res.files ? (res.files as any) : [];
    this.selectedEndorsments = res.cdlEndorsements.map((item) => {
      return {
        ...item,
        name: item.code.concat(' ', '-').concat(' ', item.description),
      };
    });

    this.selectedRestrictions = res.cdlRestrictions.map((item) => {
      return {
        ...item,
        name: item.code.concat(' ', '-').concat(' ', item.description),
      };
    });

    this.selectedClassType = res.classType;
    this.selectedStateType = res.state;
  }

  public getCdlById() {
    this.cdlService
      .getCdlById(this.editData.file_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: CdlResponse) => {
          this.cdlForm.patchValue({
            cdlNumber: res.cdlNumber,
            issueDate: convertDateFromBackend(res.issueDate),
            expDate: convertDateFromBackend(res.expDate),
            classType: res.classType.name,
            stateId: res.state.stateName,
            restrictions: null,
            endorsements: null,
            note: res.note,
            files: res.files ? res.files : null,
          });

          this.documents = res.files ? (res.files as any) : [];

          this.selectedEndorsments = res.cdlEndorsements.map((item) => {
            return {
              ...item,
              name: item.code.concat(' ', '-').concat(' ', item.description),
            };
          });
          this.selectedRestrictions = res.cdlRestrictions.map((item) => {
            return {
              ...item,
              name: item.code.concat(' ', '-').concat(' ', item.description),
            };
          });

          this.selectedClassType = res.classType;
          this.selectedStateType = res.state;
        },
        error: () => {
          this.notificationService.error("Can't get CDL", 'Error:');
        },
      });
  }

  public updateCdl() {
    const { issueDate, expDate } = this.cdlForm.value;
    const newData: any = {
      driverId: this.editData.id,
      id: this.editData.file_id,
      ...this.cdlForm.value,
      issueDate: convertDateToBackend(issueDate),
      expDate: convertDateToBackend(expDate),
      classType: this.selectedClassType ? this.selectedClassType.name : null,
      stateId: this.selectedStateType ? this.selectedStateType.id : null,
      restrictions: this.selectedRestrictions
        ? this.selectedRestrictions.map((item) => item.id)
        : [],
      endorsements: this.selectedEndorsments
        ? this.selectedEndorsments.map((item) => item.id)
        : [],
      files: this.documents[0]?.realFile
        ? [this.documents[0]?.realFile]
        : this.cdlForm.value.files,
      fileModified: this.fileModified,
    };

    this.cdlService
      .updateCdl(newData)
      .pipe(takeUntil(this.destroy$))
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

    const newData: /* CreateCdlCommand */ any = {
      driverId: this.editData.id,
      ...this.cdlForm.value,
      issueDate: convertDateToBackend(issueDate),
      expDate: convertDateToBackend(expDate),
      classType: this.selectedClassType ? this.selectedClassType.name : null,
      stateId: this.selectedStateType ? this.selectedStateType.id : null,
      restrictions: this.selectedRestrictions
        ? this.selectedRestrictions.map((item) => item.id)
        : [],
      endorsements: this.selectedEndorsments
        ? this.selectedEndorsments.map((item) => item.id)
        : [],
      files: [this.documents[0]?.realFile],
    };

    if (this.editData.type === 'renew-licence') {
      const { driverId, ...renewData } = newData;
      this.cdlService
        .renewCdlUpdate({ ...renewData, id: this.editData.file_id })
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.notificationService.success('Succesfully.', 'Success');
          },
          error: () => {
            this.notificationService.error(
              "Can't execute this operation.",
              'Error'
            );
          },
        });
    } else {
      this.cdlService
        .addCdl(newData)
        .pipe(takeUntil(this.destroy$))
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
  }

  public onFilesEvent(event: any) {
    this.documents = event.files;

    if (event.action == 'delete') {
      this.cdlForm.patchValue({
        files: null,
      });

      this.fileModified = true;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
