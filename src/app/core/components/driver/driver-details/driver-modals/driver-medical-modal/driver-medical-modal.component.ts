
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateMedicalCommand,
  DriverResponse,
  EditMedicalCommand,
  MedicalResponse,
} from 'appcoretruckassist';
import moment from 'moment';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { DriverTService } from '../../../state/driver.service';
import { MedicalTService } from '../../../state/medical.service';
@Component({
  selector: 'app-driver-medical-modal',
  templateUrl: './driver-medical-modal.component.html',
  styleUrls: ['./driver-medical-modal.component.scss'],
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
    private ngbActiveModal: NgbActiveModal
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
    if (data.action === 'close') {
      this.medicalForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        // If Form not valid
        if (this.medicalForm.invalid) {
          this.inputService.markInvalid(this.medicalForm);
          return;
        }
        if (this.editData.type === 'edit-medical') {
          this.updateMedical(this.editData.id);
        } else {
          this.addMedical();
        }
      }

      this.ngbActiveModal.close();
    }
  }

  public onFilesEvent(event: any) {
    console.log(event);
  }

  private updateMedical(id: number) {
    const { issueDate, expDate } = this.medicalForm.value;

    const newData: EditMedicalCommand = {
      id: this.editData.file_id,
      ...this.medicalForm.value,
      issueDate: new Date(issueDate).toISOString(),
      expDate: new Date(expDate).toISOString(),
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
      issueDate: new Date(issueDate).toISOString(),
      expDate: new Date(expDate).toISOString(),
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
            issueDate:  moment(new Date(res.issueDate)).format('YYYY-MM-DD'), 
            expDate:moment(new Date(res.expDate)).format('YYYY-MM-DD'),
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
