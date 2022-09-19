import {
  firstNameValidation,
  lastNameValidation, phoneFaxRegex,
} from '../../shared/ta-input/ta-input.regex-validations';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaInputService } from '../../shared/ta-input/ta-input.service';
import { ModalService } from '../../shared/ta-modal/modal.service';
import {Subject, takeUntil} from 'rxjs';
import { NotificationService } from '../../../services/notification/notification.service';
import {ApplicantTService} from "../../driver/state/applicant.service";
import {FormService} from "../../../services/form/form.service";
import {ApplicantResponse} from "../../../../../../appcoretruckassist";

@Component({
  selector: 'app-applicant-modal',
  templateUrl: './applicant-modal.component.html',
  styleUrls: ['./applicant-modal.component.scss'],
  providers: [ModalService, FormService]
})
export class ApplicantModalComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  @Input() editData: any;

  public applicantForm: FormGroup;

  private addNewApplicant: boolean = false;
  public applicantFullName: string = null;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private notificationService: NotificationService,
    private modalService: ModalService,
    private applicantService: ApplicantTService,
    private formService: FormService
  ) {}

  ngOnInit() {
    this.createForm();

    if(this.editData.type === 'edit') {
      this.editApplicant(this.editData.id);
    }
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
    switch(data.action) {
      case 'close': {
        this.applicantForm.reset();
        break;
      }
      case 'resend email': {
        this.resendApplicationEmail(this.editData.id);
        this.modalService.setModalSpinner({
          action: 'resend email',
          status: true,
        });
        break;
      }
      case 'save and add new': {
        if (this.applicantForm.invalid) {
          this.inputService.markInvalid(this.applicantForm);
          return;
        }
        this.addNewApplicant = true;
        this.addApplicant();
        this.modalService.setModalSpinner({
          action: 'save and add new',
          status: true,
        });
        break;
      }
      case 'save': {
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
        break;
      }
      default: {
        break;
      }
    }
  }

  private resendApplicationEmail(id: number) {
    this.applicantService.resendApplicantInvite({id}).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notificationService.success("Successfully resend email to applicant.", 'Success')
      },
      error: () => {
        this.notificationService.error("Can't resend email to applicant.", 'Error')
      }
    })
  }

  private updateApplicant(id: number) {
    this.applicantService.updateApplicant({
      ...this.applicantForm.value,
      id
    }).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        this.notificationService.success('Successfully update applicant.', 'Success');
      },
      error: () => {
        this.notificationService.error("Can't update applicant.", 'Error')
      }
    })
  }

  private addApplicant() {
    this.applicantService.addApplicant(this.applicantForm.value).pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        if(this.addNewApplicant) {
          this.modalService.setModalSpinner({
            action: 'save and add new',
            status: false,
          });
          this.addNewApplicant = false;
          this.formService.resetForm(this.applicantForm)
        }

        this.notificationService.success('Successfully add applicant.', 'Success');
      },
      error: () => {
        this.modalService.setModalSpinner({
          action: 'save and add new',
          status: false,
        });
        this.notificationService.error("Can't add applicant.", 'Error')
      }
    })
  }

  private editApplicant(id: number) {
    this.applicantService.getApplicantById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next:(res: ApplicantResponse) => {
        this.applicantForm.patchValue({
          firstName: res.personalInfo.firstName,
          lastName: res.personalInfo.lastName,
          phone: res.personalInfo.phone,
          email: res.personalInfo.email,
          note: null,
        })

        this.applicantFullName = res.personalInfo.firstName.concat(' ', res.personalInfo.lastName)
      },
      error: () => {
        this.notificationService.error("Can't load applicant.", 'Error')
      }
    })
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
