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
import { MvrTService } from '../../../state/mvr.service';
import moment from 'moment';
import { ModalService } from 'src/app/core/components/shared/ta-modal/modal.service';
import {
  convertDateFromBackend,
  convertDateToBackend,
} from 'src/app/core/utils/methods.calculations';
import { FormService } from 'src/app/core/services/form/form.service';

@Component({
  selector: 'app-driver-mvr-modal',
  templateUrl: './driver-mvr-modal.component.html',
  styleUrls: ['./driver-mvr-modal.component.scss'],
  providers: [ModalService],
})
export class DriverMvrModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public mvrForm: FormGroup;

  public modalName: string;

  public documents: any[] = [];

  public isDirty: boolean = false;

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
    this.getDriverById(this.editData.id);
    if (this.editData.type === 'edit-mvr') {
      this.getMVRById();
    }
  }

  private createForm() {
    this.mvrForm = this.formBuilder.group({
      issueDate: [null, Validators.required],
      note: [null],
    });

    // this.formService.checkFormChange(this.mvrForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
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

  private updateMVR() {
    console.log('updateMVR editData', this.editData);
    const { issueDate } = this.mvrForm.value;
    const newData: EditMvrCommand = {
      driverId: this.editData.id,
      id: this.editData.file_id,
      ...this.mvrForm.value,
      issueDate: convertDateToBackend(issueDate),
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
          this.modalService.setModalSpinner({ action: null, status: false });
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
          this.modalService.setModalSpinner({ action: null, status: false });
        },
        error: () => {
          this.notificationService.error("MVR can't be added.", 'Error:');
        },
      });
  }

  public getMVRById() {
    this.mvrService
      .getMvrById(this.editData.file_id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: MvrResponse) => {
          this.mvrForm.patchValue({
            issueDate: convertDateFromBackend(res.issueDate),
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
