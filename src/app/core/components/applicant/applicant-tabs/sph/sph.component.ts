import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { SphModalComponent } from './sph-modal/sph-modal.component';

import { ModalService } from '../../../shared/ta-modal/modal.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';

@Component({
  selector: 'app-sph',
  templateUrl: './sph.component.html',
  styleUrls: ['./sph.component.scss'],
})
export class SphComponent implements OnInit {
  public selectedMode: string = SelectedMode.APPLICANT;

  public sphForm: FormGroup;

  public signature: any;

  constructor(
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private inputService: TaInputService,
    private router: Router,
    private applicantActionsService: ApplicantActionsService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  public createForm(): void {
    this.sphForm = this.formBuilder.group({
      isTested: [false, Validators.requiredTrue],
      hasReadAndUnderstood: [false, Validators.requiredTrue],
    });
  }

  public handleCheckboxParagraphClick(type: string): void {
    if (this.selectedMode === 'FEEDBACK_MODE') {
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
      this.onSubmit();
    }
  }

  public onSubmit(): void {
    if (this.sphForm.invalid) {
      this.inputService.markInvalid(this.sphForm);
      return;
    }
  }
}
