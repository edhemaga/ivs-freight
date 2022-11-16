import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject, takeUntil } from 'rxjs';

import { convertDateFromBackend } from './../../../../utils/methods.calculations';

import { SphModalComponent } from './sph-modal/sph-modal.component';

import { ModalService } from '../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';

import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { ApplicantResponse } from 'appcoretruckassist';

@Component({
  selector: 'app-sph',
  templateUrl: './sph.component.html',
  styleUrls: ['./sph.component.scss'],
})
export class SphComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.APPLICANT;

  public sphForm: FormGroup;

  public signature: any;

  public applicantCardInfo: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private inputService: TaInputService,
    private applicantQuery: ApplicantQuery
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.getStepValuesFromStore();
  }

  public createForm(): void {
    this.sphForm = this.formBuilder.group({
      isTested: [false, Validators.requiredTrue],
      hasReadAndUnderstood: [false, Validators.requiredTrue],
    });
  }

  public getStepValuesFromStore(): void {
    this.applicantQuery.applicant$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ApplicantResponse) => {
        const personalInfo = res.personalInfo;

        this.applicantCardInfo = {
          name: personalInfo?.fullName,
          ssn: personalInfo?.ssn,
          dob: convertDateFromBackend(personalInfo?.doB),
        };
      });
  }

  public handleCheckboxParagraphClick(type: string): void {
    if (
      this.selectedMode === SelectedMode.FEEDBACK ||
      this.selectedMode === SelectedMode.REVIEW
    ) {
      return;
    }

    switch (type) {
      case InputSwitchActions.IS_TESTED:
        this.sphForm.patchValue({
          isTested: !this.sphForm.get('isTested').value,
        });

        break;
      default:
        break;
    }
  }

  public onSignatureAction(event: any): void {
    this.signature = event;
  }

  public handleReviewSectionsClick(): void {
    this.modalService.openModal(
      SphModalComponent,
      {
        size: 'sph-applicant',
      },
      null,
      'sph-applicant-backdrop'
    );
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
  }

  public onSubmit(): void {
    if (this.sphForm.invalid) {
      this.inputService.markInvalid(this.sphForm);
      return;
    }
  }

  public onSubmitReview(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
