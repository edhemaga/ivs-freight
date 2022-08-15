import { Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import {
  CreateRegistrationCommand,
  RegistrationModalResponse,
  RegistrationResponse,
  UpdateRegistrationCommand,
} from 'appcoretruckassist';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { CommonTruckTrailerService } from '../common-truck-trailer.service';
import { ModalService } from '../../../shared/ta-modal/modal.service';
import {
  convertDateFromBackend,
  convertDateToBackend,
} from 'src/app/core/utils/methods.calculations';
import { FormService } from 'src/app/core/services/form/form.service';

@UntilDestroy()
@Component({
  selector: 'app-tt-registration-modal',
  templateUrl: './tt-registration-modal.component.html',
  styleUrls: ['./tt-registration-modal.component.scss'],
  providers: [ModalService, FormService],
})
export class TtRegistrationModalComponent implements OnInit, OnDestroy {
  @Input() editData: any;

  public registrationForm: FormGroup;

  public documents: any[] = [];

  public isDirty: boolean;

  public stateTypes: any[] = [];
  public selectedStateType: any = null;

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
    this.getModalDropdowns();
    if (this.editData.type === 'edit-registration') {
      this.editRegistrationById();
    }
  }

  private createForm() {
    this.registrationForm = this.formBuilder.group({
      licensePlate: [null, Validators.required],
      stateId: [null, Validators.required],
      issueDate: [null, Validators.required],
      expDate: [null, Validators.required],
      note: [null],
    });

    // this.formService.checkFormChange(this.registrationForm);

    // this.formService.formValueChange$
    //   .pipe(untilDestroyed(this))
    //   .subscribe((isFormChange: boolean) => {
    //     isFormChange ? (this.isDirty = false) : (this.isDirty = true);
    //   });
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

  public onSelectDropdown(event: any, action: string) {
    switch (action) {
      case 'state': {
        this.selectedStateType = event;
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

  private updateRegistration() {
    const { issueDate, expDate, ...form } = this.registrationForm.value;
    const newData: UpdateRegistrationCommand = {
      id: this.editData.file_id,
      ...form,
      issueDate: convertDateToBackend(issueDate),
      expDate: convertDateToBackend(expDate),
      stateId: this.selectedStateType ? this.selectedStateType.id : null,
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
    const { issueDate, expDate, ...form } = this.registrationForm.value;
    const newData: CreateRegistrationCommand = {
      ...form,
      issueDate: convertDateToBackend(issueDate),
      expDate: convertDateToBackend(expDate),
      stateId: this.selectedStateType ? this.selectedStateType.id : null,
      trailerId: this.editData.modal === 'trailer' ? this.editData.id : null,
      truckId: this.editData.modal === 'truck' ? this.editData.id : null,
    };

    this.commonTruckTrailerService
      .addRegistration(newData, this.editData.tabSelected)
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

  private editRegistrationById() {
    this.commonTruckTrailerService
      .getRegistrationById(this.editData.file_id)
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: RegistrationResponse) => {
          this.registrationForm.patchValue({
            issueDate: convertDateFromBackend(res.issueDate),
            expDate: convertDateFromBackend(res.expDate),
            licensePlate: res.licensePlate,
            stateId: res.state ? res.state.stateName : null,
            note: res.note,
          });

          this.selectedStateType = res.state;
        },
        error: () => {
          this.notificationService.error("Can't get registration.", 'Error:');
        },
      });
  }

  private getModalDropdowns() {
    this.commonTruckTrailerService
      .getRegistrationModalDropdowns()
      .pipe(untilDestroyed(this))
      .subscribe({
        next: (res: RegistrationModalResponse) => {
          this.stateTypes = res.states.map((item) => {
            return {
              id: item.id,
              name: item.stateShortName,
              stateName: item.stateName,
            };
          });
        },
        error: () => {
          this.notificationService.error(
            "Can't get registration dropdowns!",
            'Error'
          );
        },
      });
  }

  ngOnDestroy(): void {}
}
