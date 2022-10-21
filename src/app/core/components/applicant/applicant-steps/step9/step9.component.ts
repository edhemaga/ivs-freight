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

    this.getApplicantId();

    this.getStepValuesFromStore();
  }

  public createForm(): void {
    this.driverRightsForm = this.formBuilder.group({
      understandYourRights: [false, Validators.requiredTrue],
    });
  }

  public getStepValuesFromStore(): void {
    let stepValuesResponse: any;

    this.applicantQuery.driverRightsList$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        stepValuesResponse = res;
      });

    if (stepValuesResponse) {
      this.patchStepValues(stepValuesResponse);
    }
  }

  public patchStepValues(stepValues: any): void {
    const { understandDriverRights } = stepValues;

    this.driverRightsForm
      .get('understandYourRights')
      .patchValue(understandDriverRights);
  }

  public getApplicantId(): void {
    this.applicantQuery.applicantId$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.applicantId = res;
      });
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

          this.applicantStore.update(1, (entity) => {
            return {
              ...entity,
              driverRight: {
                ...entity.driverRight,
                understandDriverRights: saveData.understandDriverRights,
              },
            };
          });
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
