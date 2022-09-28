import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import {
  CreateMvrCommand,
  DriverResponse,
  EditMvrCommand,
  GetMvrModalResponse,
  MvrResponse,
} from 'appcoretruckassist';
import { DriverTService } from '../../../state/driver.service';
import { MvrTService } from '../../../state/mvr.service';
import { Subject, takeUntil } from 'rxjs';
import { ModalService } from '../../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../../shared/ta-input/ta-input.service';
import { NotificationService } from '../../../../../services/notification/notification.service';
import {
  convertDateToBackend,
  convertDateFromBackend,
} from '../../../../../utils/methods.calculations';

@Component({
  selector: 'app-driver-mvr-modal',
  templateUrl: './driver-mvr-modal.component.html',
  styleUrls: ['./driver-mvr-modal.component.scss'],
  providers: [ModalService],
})
export class DriverMvrModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public mvrForm: FormGroup;

  public modalName: string;

  public documents: any[] = [];

  public cdls: any[] = [];
  public selectedCdl: any = null;

  public isDirty: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverTService,
    private inputService: TaInputService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private mvrService: MvrTService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getModalDropdowns();

    this.getDriverById(this.editData.id);
    if (this.editData.type === 'edit-mvr') {
      this.getMVRById();
    }
  }

  private createForm() {
    this.mvrForm = this.formBuilder.group({
      issueDate: [null, Validators.required],
      cdlId: [null, Validators.required],
      note: [null],
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
        this.mvrForm.reset();
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.mvrForm.invalid) {
          this.inputService.markInvalid(this.mvrForm);
          return;
        }
        if (this.editData.type === 'edit-mvr') {
          this.updateMVR();
          this.modalService.setModalSpinner({ action: null, status: true });
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
  }

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'cdl': {
        this.selectedCdl = event;
        break;
      }
      default: {
        break;
      }
    }
  }

  private updateMVR() {
    const { issueDate } = this.mvrForm.value;
    const newData: EditMvrCommand = {
      driverId: this.editData.id,
      id: this.editData.file_id,
      ...this.mvrForm.value,
      issueDate: convertDateToBackend(issueDate),
      cdlId: this.selectedCdl.id,
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
    const { issueDate } = this.mvrForm.value;
    const newData: CreateMvrCommand = {
      driverId: this.editData.id,
      ...this.mvrForm.value,
      issueDate: convertDateToBackend(issueDate),
      cdlId: this.selectedCdl.id,
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

  public getMVRById() {
    this.mvrService
      .getMvrById(this.editData.file_id)
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
        },
        error: () => {
          this.notificationService.error("Can't get Test", 'Error:');
        },
      });
  }

  public getModalDropdowns() {
    this.mvrService
      .getMvrModal(this.editData.id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: GetMvrModalResponse) => {
          this.cdls = res.cdls.map((item) => {
            return {
              ...item,
              name: item.cdlNumber,
            };
          });
        },
        error: () => {
          this.notificationService.error(
            "Can't load mvr's modal dropdowns",
            'Error'
          );
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
