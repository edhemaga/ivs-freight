import {
  firstNameValidation,
  lastNameValidation, phoneFaxRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import { Subject } from 'rxjs';
import { NotificationService } from '../../../services/notification/notification.service';

@Component({
  selector: 'app-applicant-modal',
  templateUrl: './applicant-modal.component.html',
  styleUrls: ['./applicant-modal.component.scss'],
})
export class ApplicantModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() editData: any;

  public applicantForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private notificationService: NotificationService,
    private modalService: ModalService
  ) {}

  ngOnInit() {
    this.createForm();
  }

  private createForm() {
    this.applicantForm = this.formBuilder.group({
      firstName: [null, [Validators.required, ...firstNameValidation]],
      lastName: [null, [Validators.required, ...lastNameValidation]],
      phone: [null, [Validators.required, phoneFaxRegex]],
      email: [null, Validators.required],
      note: [null],
    });

    this.inputService.customInputValidator(
      this.applicantForm.get('email'),
      'email',
      this.destroy$
    );
  }

  public onModalAction(data: { action: string; bool: boolean }) {
    if (data.action === 'close') {
      this.applicantForm.reset();
    }
    // Resend Email
    else if (data.action === 'resend email') {
      this.resendApplicationEmail();
      this.modalService.setModalSpinner({
        action: 'resend email',
        status: true,
      });
    }
    // Add New
    else if (data.action === 'save and add new') {
      if (this.applicantForm.invalid) {
        this.inputService.markInvalid(this.applicantForm);
        return;
      }

      this.addApplicant();
      this.modalService.setModalSpinner({
        action: 'save and add new',
        status: true,
      });
    }
    // Save
    else if (data.action === 'save') {
      // Save & Update
      if (this.applicantForm.invalid) {
        this.inputService.markInvalid(this.applicantForm);
        return;
      }

      if (this.editData?.type === 'edit') {
        this.updateApplicant(this.editData.id);
        this.modalService.setModalSpinner({ action: null, status: true });
      } else {
        this.addApplicant();
        this.modalService.setModalSpinner({ action: null, status: true });
      }
    }
  }

  private resendApplicationEmail() {}

  private updateApplicant(id: number) {}

  private addApplicant() {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
