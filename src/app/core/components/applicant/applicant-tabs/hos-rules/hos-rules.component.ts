import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
  selector: 'app-hos-rules',
  templateUrl: './hos-rules.component.html',
  styleUrls: ['./hos-rules.component.scss'],
})
export class HosRulesComponent implements OnInit {
  public selectedMode: string = SelectedMode.APPLICANT;

  public hosRulesForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private router: Router,
    private applicantActionsService: ApplicantActionsService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  public createForm(): void {
    this.hosRulesForm = this.formBuilder.group({
      isReadingConfirmed: [false, Validators.requiredTrue],
    });
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      this.onSubmit();
    }
  }

  public onSubmit(): void {
    if (this.hosRulesForm.invalid) {
      this.inputService.markInvalid(this.hosRulesForm);
      return;
    }
  }
}
