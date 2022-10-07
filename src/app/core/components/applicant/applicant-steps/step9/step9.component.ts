import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { UpdateDriverRightsCommand } from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step9',
  templateUrl: './step9.component.html',
  styleUrls: ['./step9.component.scss'],
})
export class Step9Component implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.REVIEW;

  public applicantId: number;

  public driverRightsForm: FormGroup;

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

      this.applicantQuery.driverRightsList$
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          stepValuesResponse = res;
        });

      this.patchStepValues(stepValuesResponse);
    }
  }

  public createForm(): void {
    this.driverRightsForm = this.formBuilder.group({
      understandYourRights: [false, Validators.requiredTrue],
    });
  }

  public patchStepValues(stepValues: any): void {
    const { understandDriverRights } = stepValues;

    this.driverRightsForm
      .get('understandYourRights')
      .patchValue(understandDriverRights);
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
      this.router.navigate([`/application/${this.applicantId}/8`]);
    }
  }

  public onSubmit(): void {
    if (this.driverRightsForm.invalid) {
      this.inputService.markInvalid(this.driverRightsForm);
      return;
    }

    const { understandYourRights } = this.driverRightsForm.value;

    const saveData: UpdateDriverRightsCommand = {
      understandDriverRights: understandYourRights,
      applicantId: this.applicantId,
    };

    this.applicantActionsService
      .updateDriverRights(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/10`]);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  public onSubmitReview(): void {
    this.router.navigate([`/application/${this.applicantId}/10`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
