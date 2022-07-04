import { Validators } from '@angular/forms';
import { untilDestroyed } from 'ngx-take-until-destroy';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import {
  CreateRegistrationCommand,
  RegistrationResponse,
  UpdateRegistrationCommand,
} from 'appcoretruckassist';
import moment from 'moment';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { CommonTruckTrailerService } from '../common-truck-trailer.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import {
  convertDateFromBackend,
  convertDateToBackend,
} from 'src/app/core/utils/methods.calculations';
import { FormService } from 'src/app/core/services/form/form.service';

@Component({
  selector: 'app-tt-registration-modal',
  templateUrl: './tt-registration-modal.component.html',
  styleUrls: ['./tt-registration-modal.component.scss'],
  providers: [ModalService],
})
export class TtRegistrationModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public registrationForm: FormGroup;

  public documents: any[] = [];

  public isDirty: boolean;

  constructor(
    private formBuilder: FormBuilder,
    private commonTruckTrailerService: CommonTruckTrailerService,
    private notificationService: NotificationService,
    private inputService: TaInputService,
    private modalService: ModalService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();

    if (this.editData.type === 'edit-registration') {
      this.getRegistrationById();
    }
  }

  private createForm() {
    this.registrationForm = this.formBuilder.group({
      issueDate: [null, Validators.required],
      expDate: [null],
      licensePlate: [null, Validators.required],
      note: [null],
    });

    this.formService.checkFormChange(this.registrationForm);

    this.formService.formValueChange$
      .pipe(untilDestroyed(this))
      .subscribe((isFormChange: boolean) => {
        isFormChange ? (this.isDirty = false) : (this.isDirty = true);
      });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    switch (data.action) {
      case 'close': {
        this.registrationForm.reset();
        break;
      }
      case 'save': {
        // If Form not valid
        if (this.registrationForm.invalid) {
          this.inputService.markInvalid(this.registrationForm);
          return;
        }
        if (this.editData.type === 'edit-registration') {
          this.updateRegistration();
          this.modalService.setModalSpinner({ action: null, status: true });
        } else {
          this.addRegistration();
          this.modalService.setModalSpinner({ action: null, status: true });
        }
        break;
      }
      default: {
        break;
      }
    }
  }

  private updateRegistration() {
    const { issueDate, expDate } = this.registrationForm.value;
    const newData: UpdateRegistrationCommand = {
      id: this.editData.file_id,
      ...this.registrationForm.value,
      issueDate: convertDateToBackend(issueDate),
      expDate: convertDateToBackend(expDate),
    };

    this.commonTruckTrailerService
      .updateRegistration(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Registration successfully updated.',
            'Success:'
          );
          this.modalService.setModalSpinner({
            action: null,
            status: false,
          });
        },
        error: () => {
          this.notificationService.error(
            "Registartion can't be updated.",
            'Error:'
          );
        },
      });
  }

  private addRegistration() {
    const { issueDate, expDate } = this.registrationForm.value;
    const newData: CreateRegistrationCommand = {
      ...this.registrationForm.value,
      issueDate: convertDateToBackend(issueDate),
      expDate: convertDateToBackend(expDate),
      trailerId: this.editData.modal === 'trailer' ? this.editData.id : null,
      truckId: this.editData.modal === 'truck' ? this.editData.id : null,
    };

    this.commonTruckTrailerService
      .addRegistration(newData)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: () => {
          this.notificationService.success(
            'Registration successfully added.',
            'Success:'
          );
          this.modalService.setModalSpinner({
            action: null,
            status: false,
          });
        },
        error: () => {
          this.notificationService.error(
            "Registration can't be added.",
            'Error:'
          );
        },
      });
  }

  private getRegistrationById() {
    this.commonTruckTrailerService
      .getRegistrationById(this.editData.file_id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: RegistrationResponse) => {
          this.registrationForm.patchValue({
            issueDate: convertDateFromBackend(res.issueDate),
            expDate: convertDateFromBackend(res.expDate),
            licensePlate: res.licensePlate,
            note: res.note,
          });
        },
        error: () => {
          this.notificationService.error("Can't get registration.", 'Error:');
        },
      });
  }

  public onFilesEvent(event: any) {
    this.documents = event.files;
  }

  ngOnDestroy(): void {}
}
