import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
// import { CreateAuthorizationCommand } from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step11',
  templateUrl: './step11.component.html',
  styleUrls: ['./step11.component.scss'],
})
export class Step11Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.REVIEW;

  public authorizationForm: FormGroup;

  public applicantId: number;

  public signature: any;
  public signatureImgSrc: string;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private router: Router,
    private applicantStore: ApplicantStore,
    private applicantQuery: ApplicantQuery,
    private applicantActionsService: ApplicantActionsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    if (this.selectedMode === SelectedMode.APPLICANT) {
      this.applicantActionsService.getApplicantInfo$
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.applicantId = res.personalInfo.applicantId;
        });
    }

    if (this.selectedMode === SelectedMode.REVIEW) {
      let stepValuesResponse: any;

      this.applicantQuery.authorizationList$
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          stepValuesResponse = res;
        });

      this.patchStepValues(stepValuesResponse);
    }
  }

  public createForm(): void {
    this.authorizationForm = this.formBuilder.group({
      isFirstAuthorization: [false, Validators.requiredTrue],
      isSecondAuthorization: [false, Validators.requiredTrue],
      isThirdAuthorization: [false, Validators.requiredTrue],
      isFourthAuthorization: [false, Validators.requiredTrue],
    });
  }

  public patchStepValues(stepValues: any): void {
    const {
      isFirstAuthorization,
      isSecondAuthorization,
      isThirdAuthorization,
      isFourthAuthorization,
      signature,
    } = stepValues;

    this.authorizationForm.patchValue({
      isFirstAuthorization,
      isSecondAuthorization,
      isThirdAuthorization,
      isFourthAuthorization,
    });

    this.signatureImgSrc = signature;
  }

  public handleCheckboxParagraphClick(type: string): void {
    if (
      this.selectedMode === 'FEEDBACK_MODE' ||
      this.selectedMode === 'REVIEW_MODE'
    ) {
      return;
    }

    switch (type) {
      case InputSwitchActions.FIRST_AUTHORIZATION:
        this.authorizationForm.patchValue({
          isFirstAuthorization: !this.authorizationForm.get(
            'isFirstAuthorization'
          ).value,
        });

        break;
      case InputSwitchActions.SECOND_AUTHORIZATION:
        this.authorizationForm.patchValue({
          isSecondAuthorization: !this.authorizationForm.get(
            'isSecondAuthorization'
          ).value,
        });

        break;
      case InputSwitchActions.THIRD_AUTHORIZATION:
        this.authorizationForm.patchValue({
          isThirdAuthorization: !this.authorizationForm.get(
            'isThirdAuthorization'
          ).value,
        });

        break;
      case InputSwitchActions.FOURTH_AUTHORIZATION:
        this.authorizationForm.patchValue({
          isFourthAuthorization: !this.authorizationForm.get(
            'isFourthAuthorization'
          ).value,
        });

        break;

      default:
        break;
    }
  }

  public onSignatureAction(event: any): void {
    this.signatureImgSrc = event;
    this.signature = event;

    this.signature = this.signature.slice(22);
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      if (this.selectedMode === SelectedMode.APPLICANT) {
        this.onSubmit();
      }

      if (this.selectedMode === SelectedMode.REVIEW) {
        this.onSubmitReview();
      }
    }

    if (event.action === 'back-step') {
      this.router.navigate([`/application/${this.applicantId}/10`]);
    }
  }

  public onSubmit(): void {
    if (this.authorizationForm.invalid) {
      this.inputService.markInvalid(this.authorizationForm);
      return;
    }

    const authorizationForm = this.authorizationForm.value;

    const saveData: /* CreateAuthorizationCommand */ any = {
      ...authorizationForm,
      applicantId: this.applicantId,
      signature: this.signature,
    };

    this.applicantActionsService
      .createAuthorization(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/medical-certificate/${this.applicantId}`]);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  public onSubmitReview(): void {
    this.router.navigate([`/medical-certificate/${this.applicantId}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
