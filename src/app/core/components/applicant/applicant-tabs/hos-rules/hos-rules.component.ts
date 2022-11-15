import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { ApplicantResponse, UpdatePspAuthCommand } from 'appcoretruckassist';

@Component({
  selector: 'app-hos-rules',
  templateUrl: './hos-rules.component.html',
  styleUrls: ['./hos-rules.component.scss'],
})
export class HosRulesComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.APPLICANT;

  public hosRulesForm: FormGroup;

  public applicantId: number;

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

    this.getStepValuesFromStore();
  }

  public createForm(): void {
    this.hosRulesForm = this.formBuilder.group({
      isReadingConfirmed: [false, Validators.requiredTrue],
    });
  }

  public getStepValuesFromStore(): void {
    this.applicantQuery.applicant$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ApplicantResponse) => {
        this.applicantId = res.id;
      });
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      if (
        this.selectedMode === SelectedMode.APPLICANT ||
        this.selectedMode === SelectedMode.FEEDBACK
      ) {
        this.onSubmit();
      }

      if (this.selectedMode === SelectedMode.REVIEW) {
        this.onSubmitReview();
      }
    }
  }

  public onSubmit(): void {
    if (this.hosRulesForm.invalid) {
      this.inputService.markInvalid(this.hosRulesForm);
      return;
    }

    const { isReadingConfirmed } = this.hosRulesForm.value;

    const saveData: UpdatePspAuthCommand = {
      applicantId: this.applicantId,
      isConfirm: isReadingConfirmed,
    };

    this.applicantActionsService
      .updateHosRules(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/ssn-card/${this.applicantId}`]);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  public onSubmitReview(): void {}

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
