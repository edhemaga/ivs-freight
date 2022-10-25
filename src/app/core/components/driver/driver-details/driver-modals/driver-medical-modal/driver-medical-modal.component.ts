import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DriverResponse, MedicalResponse } from 'appcoretruckassist';
import { Subject, takeUntil } from 'rxjs';
import { DriverTService } from '../../../state/driver.service';
import { MedicalTService } from '../../../state/medical.service';
import { ModalService } from '../../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../../shared/ta-input/ta-input.service';
import { NotificationService } from '../../../../../services/notification/notification.service';
import { FormService } from '../../../../../services/form/form.service';
import {
  convertDateToBackend,
  convertDateFromBackend,
} from '../../../../../utils/methods.calculations';
import { EditMedicalCommand } from 'appcoretruckassist/model/editMedicalCommand';
import { CreateMedicalCommand } from 'appcoretruckassist/model/createMedicalCommand';

@Component({
  selector: 'app-driver-medical-modal',
  templateUrl: './driver-medical-modal.component.html',
  styleUrls: ['./driver-medical-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class DriverMedicalModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() editData: any;

  public medicalForm: FormGroup;

  public modalName: string;

  public documents: any[] = [];

  public isFormDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverTService,
    private inputService: TaInputService,
    private medicalService: MedicalTService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getDriverById(this.editData.id);
    if (this.editData.type === 'edit-medical') {
      this.getMedicalById();
    }
  }

  private createForm() {
    this.medicalForm = this.formBuilder.group({
      issueDate: [null, Validators.required],
      expDate: [null, Validators.required],
      note: [null],
    });

    this.formService.checkFormChange(this.medicalForm);
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
        if (this.medicalForm.invalid) {
          this.inputService.markInvalid(this.medicalForm);
          return;
        }
        if (this.editData.type === 'edit-medical') {
          if (this.isFormDirty) {
            this.updateMedical(this.editData.id);
            this.modalService.setModalSpinner({ action: null, status: true });
          }
        } else {
          this.addMedical();
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

  private updateMedical(id: number) {
    const { issueDate, expDate } = this.medicalForm.value;

    const newData: /* EditMedicalCommand */ any = {
      id: this.editData.file_id,
      ...this.medicalForm.value,
      issueDate: convertDateToBackend(issueDate),
      expDate: convertDateToBackend(expDate),
    };

    this.medicalService
      .updateMedical(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Medical successfully updated.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Medical can't be updated.", 'Error:');
        },
      });
  }

  private addMedical() {
    const { issueDate, expDate } = this.medicalForm.value;
    const newData: /*CreateMedicalCommand*/ any = {
      driverId: this.editData.id,
      ...this.medicalForm.value,
      issueDate: convertDateToBackend(issueDate),
      expDate: convertDateToBackend(expDate),
    };

    this.medicalService
      .addMedical(newData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Medical successfully added.',
            'Success:'
          );
        },
        error: () => {
          this.notificationService.error("Medical can't be added.", 'Error:');
        },
      });
  }

  public getMedicalById() {
    this.medicalService
      .getMedicalById(this.editData.file_id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res: MedicalResponse) => {
          this.medicalForm.patchValue({
            issueDate: convertDateFromBackend(res.issueDate),
            expDate: convertDateFromBackend(res.expDate),
            note: res.note,
          });
        },
        error: () => {
          this.notificationService.error("Can't get Test", 'Error:');
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
