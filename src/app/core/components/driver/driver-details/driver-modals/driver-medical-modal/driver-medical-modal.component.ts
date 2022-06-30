import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  CreateMedicalCommand,
  DriverResponse,
  EditMedicalCommand,
  MedicalResponse,
} from 'appcoretruckassist';
import moment from 'moment';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import {
  convertDateFromBackend,
  convertDateToBackend,
} from 'src/app/core/utils/methods.calculations';
import { DriverTService } from '../../../state/driver.service';
import { MedicalTService } from '../../../state/medical.service';
@Component({
  selector: 'app-driver-medical-modal',
  templateUrl: './driver-medical-modal.component.html',
  styleUrls: ['./driver-medical-modal.component.scss'],
  providers: [ModalService],
})
export class DriverMedicalModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public medicalForm: FormGroup;

  public modalName: string;

  public documents: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverTService,
    private inputService: TaInputService,
    private medicalService: MedicalTService,
    private notificationService: NotificationService,
    private modalService: ModalService
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

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.medicalForm.reset();
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.medicalForm.invalid) {
          this.inputService.markInvalid(this.medicalForm);
          return;
        }
        if (this.editData.type === 'edit-medical') {
          this.updateMedical(this.editData.id);
          this.modalService.setModalSpinner({ action: null, status: true });
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

    const newData: EditMedicalCommand = {
      id: this.editData.file_id,
      ...this.medicalForm.value,
      issueDate: convertDateToBackend(issueDate),
      expDate: convertDateToBackend(expDate),
    };

    this.medicalService
      .updateMedical(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Medical successfully updated.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Medical can't be updated.", 'Error:');
        },
      });
  }

  private addMedical() {
    const { issueDate, expDate } = this.medicalForm.value;
    const newData: CreateMedicalCommand = {
      driverId: this.editData.id,
      ...this.medicalForm.value,
      issueDate: convertDateToBackend(issueDate),
      expDate: convertDateToBackend(expDate),
    };

    this.medicalService
      .addMedical(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Medical successfully added.',
            'Success:'
          );
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("Medical can't be added.", 'Error:');
        },
      });
  }

  public getMedicalById() {
    this.medicalService
      .getMedicalById(this.editData.file_id)
      .pipe(untilDestroyed(this))
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

  ngOnDestroy(): void {}
}
