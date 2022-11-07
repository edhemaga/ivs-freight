import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  DriverResponse,
  GetMvrModalResponse,
  MvrResponse,
} from 'appcoretruckassist';
import { DriverTService } from '../../../driver/state/driver.service';
import { MvrTService } from '../../../driver/state/mvr.service';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { NotificationService } from '../../../../services/notification/notification.service';
import { FormService } from '../../../../services/form/form.service';
import {
  convertDateToBackend,
  convertDateFromBackend,
} from '../../../../utils/methods.calculations';
import { DriverListResponse } from '../../../../../../../appcoretruckassist/model/driverListResponse';

@Component({
  selector: 'app-driver-mvr-modal',
  templateUrl: './driver-mvr-modal.component.html',
  styleUrls: ['./driver-mvr-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class DriverMvrModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public mvrForm: FormGroup;

  public isFormDirty: boolean = false;

  public modalName: string;

  public documents: any[] = [];

  public cdls: any[] = [];
  public selectedCdl: any = null;

  public labelsDrivers: any[] = [];
  public selectedDriver: any = null;
  public fileModified: boolean = false;
  public filesForDelete: any[] = [];

  private destroy$ = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverTService,
    private inputService: TaInputService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private mvrService: MvrTService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.createForm();

    if (this.editData) {
      this.getDriverById(this.editData.id);
      this.getModalDropdowns(this.editData.id);

      if (this.editData.type === 'edit-mvr') {
        this.getMVRById(this.editData.file_id);
      }
    } else {
      this.getListOfDrivers();
      this.mvrForm.get('driver').setValidators(Validators.required);
    }
  }

  private createForm() {
    this.mvrForm = this.formBuilder.group({
      driver: [null],
      issueDate: [null, Validators.required],
      cdlId: [null, Validators.required],
      note: [null],
      files: [null],
    });

    this.formService.checkFormChange(this.mvrForm);
    this.formService.formValueChange$
      .pipe(takeUntil(this.destroy$))
      .subscribe((isFormChange: boolean) => {
        this.isFormDirty = isFormChange;
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

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.mvrForm.invalid) {
          this.inputService.markInvalid(this.mvrForm);
          return;
        }
        if (this.editData?.type === 'edit-mvr') {
          if (this.isFormDirty) {
            this.updateMVR();
            this.modalService.setModalSpinner({ action: null, status: true });
          }
        } else {
          this.addMVR();
          this.modalService.setModalSpinner({ action: null, status: true });
        }

        break;
      }
      default: {
        break;
      }
    }
  }

  public onFilesEvent(event: any) {
    this.documents = event.files;

    if (event.action == 'delete') {
      this.mvrForm.patchValue({
        files: null,
      });

      if(event.deleteId) {
        this.filesForDelete.push(event.deleteId);
      }
      
      this.fileModified = true;
    }
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'cdl': {
        this.selectedCdl = event;
        break;
      }
      case 'driver': {
        if (event) {
          this.selectedDriver = event;
          this.getModalDropdowns(this.selectedDriver.id);
          this.modalName = this.selectedDriver.name;
        } else {
          this.modalName = null;
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  private updateMVR() {
    const { issueDate, driver, note } = this.mvrForm.value;
    const documents = this.documents.map((item) => {
      return item.realFile;
    });
    const newData: any = {
      driverId: this.editData.id,
      id: this.editData.file_id,
      issueDate: convertDateToBackend(issueDate),
      cdlId: this.selectedCdl.id,
      note: note,
      files: documents
        ? documents
        : this.mvrForm.value.files,
      filesForDeleteIds: this.filesForDelete,
    };

    this.mvrService
      .updateMvr(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'MVR successfully updated.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("MVR can't be updated.", 'Error:');
        },
      });
  }

  private addMVR() {
    const { issueDate, driver, note } = this.mvrForm.value;
    const documents = this.documents.map((item) => {
      return item.realFile;
    });
    const newData: any = {
      driverId: this.selectedDriver ? this.selectedDriver.id : this.editData.id,
      issueDate: convertDateToBackend(issueDate),
      cdlId: this.selectedCdl.id,
      note: note,
      files: documents,
    };

    this.mvrService
      .addMvr(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'MVR successfully added.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("MVR can't be added.", 'Error:');
        },
      });
  }

  public getMVRById(id: number) {
    this.mvrService
      .getMvrById(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: MvrResponse) => {
          this.mvrForm.patchValue({
            cdlId: res.cdlNumber,
            issueDate: convertDateFromBackend(res.issueDate),
            note: res.note,
          });
          this.selectedCdl = {
            id: res.cdlId,
            name: res.cdlNumber,
          };

          this.documents = res.files ? (res.files as any) : [];
        },
        error: () => {
          this.notificationService.error("Can't get Test", 'Error:');
        },
      });
  }

  public getModalDropdowns(id: number) {
    this.mvrService
      .getMvrModal(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: GetMvrModalResponse) => {
          this.cdls = res.cdls.map((item) => {
            return {
              ...item,
              name: item.cdlNumber,
            };
          });

          if (this.cdls.length === 1) {
            this.selectedCdl = this.cdls[0];
            this.mvrForm.get('cdlId').patchValue(this.selectedCdl.name);
          }
        },
        error: () => {
          this.notificationService.error(
            "Can't load mvr's modal dropdowns",
            'Error'
          );
        },
      });
  }

  public getListOfDrivers() {
    this.driverService
      .getDrivers()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: DriverListResponse) => {
          this.labelsDrivers = res.pagination.data.map((item) => {
            return {
              id: item.id,
              name: item.fullName,
            };
          });
        },
        error: () => {
          this.notificationService.error("Can't load list of drivers", 'Error');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
