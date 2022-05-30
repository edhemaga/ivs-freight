import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { untilDestroyed } from 'ngx-take-until-destroy';
import {
  CreateMvrCommand,
  DriverResponse,
  EditMvrCommand,
  MvrResponse,
} from 'appcoretruckassist';
import { DriverTService } from '../../../state/driver.service';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { MvrTService } from '../../../state/mvr.service';

@Component({
  selector: 'app-driver-mvr-modal',
  templateUrl: './driver-mvr-modal.component.html',
  styleUrls: ['./driver-mvr-modal.component.scss'],
})
export class DriverMvrModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public mvrForm: FormGroup;

  public modalName: string;

  public documents: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private driverService: DriverTService,
    private inputService: TaInputService,
    private notificationService: NotificationService,
    private ngbActiveModal: NgbActiveModal,
    private mvrService: MvrTService
  ) {}

  ngOnInit(): void {
    this.createForm();
    this.getDriverById(this.editData.id);
    if (this.editData.type === 'edit-mvr') {
      this.getMVRById()
    }
  }

  private createForm() {
    this.mvrForm = this.formBuilder.group({
      issueDate: [null, Validators.required],
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
      this.mvrForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        // If Form not valid
        if (this.mvrForm.invalid) {
          this.inputService.markInvalid(this.mvrForm);
          return;
        }
        if (this.editData.type === 'edit-mvr') {
          this.updateMVR();
        } else {
          this.addMVR();
        }
      }

      this.ngbActiveModal.close();
    }
  }

  public onFilesEvent(event: any) {
    console.log(event);
  }

  private updateMVR() {
    const { issueDate } = this.mvrForm.value;
    const newData: EditMvrCommand = {
      driverId: this.editData.id,
      ...this.mvrForm.value,
      issueDate: new Date(issueDate).toISOString(),
    };

    this.mvrService
      .addMvr(newData)
      .pipe(untilDestroyed(this))
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
      issueDate: new Date(issueDate).toISOString(),
    };
    this.mvrService
      .addMvr(newData)
      .pipe(untilDestroyed(this))
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
      .getMvrById(this.editData.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: MvrResponse) => {
          this.mvrForm.patchValue({
            issueDate: res.issueDate,
            note: null,
          });
        },
        error: () => {
          this.notificationService.error("Can't get Test", 'Error:');
        },
      });
  }

  ngOnDestroy(): void {}
}
