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

@Component({
  selector: 'app-tt-registration-modal',
  templateUrl: './tt-registration-modal.component.html',
  styleUrls: ['./tt-registration-modal.component.scss'],
})
export class TtRegistrationModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public registrationForm: FormGroup;

  public documents: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private commonTruckTrailerService: CommonTruckTrailerService,
    private notificationService: NotificationService,
    private inputService: TaInputService,
    private ngbActiveModal: NgbActiveModal
  ) {}

  ngOnInit() {
    this.createForm();
    console.log(this.editData);

    if (this.editData.type === 'edit-registration') {
      this.getRegistrationById();
    }
  }

  private createForm() {
    this.registrationForm = this.formBuilder.group({
      issueDate: [null],
      expDate: [null],
      licensePlate: [null],
      note: [null],
    });
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    if (data.action === 'close') {
      this.registrationForm.reset();
    } else {
      // Save & Update
      if (data.action === 'save') {
        // If Form not valid
        if (this.registrationForm.invalid) {
          this.inputService.markInvalid(this.registrationForm);
          return;
        }
        if (this.editData.type === 'edit-registration') {
          this.updateRegistration();
        }
        this.addRegistration();
      }

      this.ngbActiveModal.close();
    }
  }

  private updateRegistration() {
    const { issueDate, expDate } = this.registrationForm.value;
    const newData: UpdateRegistrationCommand = {
      id: this.editData.id,
      ...this.registrationForm.value,
      issueDate: new Date(issueDate).toISOString(),
      expDate: new Date(expDate).toISOString(),
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
      issueDate: new Date(issueDate).toISOString(),
      expDate: new Date(expDate).toISOString(),
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
      .getRegistrationById(this.editData.id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: RegistrationResponse) => {
          this.registrationForm.patchValue({
            issueDate: moment(new Date(res.issueDate)).format('YYYY-MM-DD'),
            expDate: moment(new Date(res.expDate)).format('YYYY-MM-DD'),
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
    console.log(event);
  }

  ngOnDestroy(): void {}
}
