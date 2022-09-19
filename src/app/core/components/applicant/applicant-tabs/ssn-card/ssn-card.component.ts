import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
  selector: 'app-ssn-card',
  templateUrl: './ssn-card.component.html',
  styleUrls: ['./ssn-card.component.scss'],
})
export class SsnCardComponent implements OnInit {
  public selectedMode: string = SelectedMode.APPLICANT;

  public ssnCardForm: FormGroup;

  public documents: any[] = [];

  public openAnnotationArray: {
    lineIndex?: number;
    lineInputs?: boolean[];
    displayAnnotationButton?: boolean;
    displayAnnotationTextArea?: boolean;
  }[] = [
    {
      lineIndex: 0,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private applicantActionsService: ApplicantActionsService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  private createForm(): void {
    this.ssnCardForm = this.formBuilder.group({
      firstRowReview: [null],
    });
  }

  public onFilesAction(event: any): void {
    this.documents = event.files;
  }

  public incorrectInput(
    event: any,
    inputIndex: number,
    lineIndex: number
  ): void {
    const selectedInputsLine = this.openAnnotationArray.find(
      (item) => item.lineIndex === lineIndex
    );

    if (event) {
      selectedInputsLine.lineInputs[inputIndex] = true;

      if (!selectedInputsLine.displayAnnotationTextArea) {
        selectedInputsLine.displayAnnotationButton = true;
        selectedInputsLine.displayAnnotationTextArea = false;
      }
    }

    if (!event) {
      selectedInputsLine.lineInputs[inputIndex] = false;

      const lineInputItems = selectedInputsLine.lineInputs;
      const isAnyInputInLineIncorrect = anyInputInLineIncorrect(lineInputItems);

      if (!isAnyInputInLineIncorrect) {
        selectedInputsLine.displayAnnotationButton = false;
        selectedInputsLine.displayAnnotationTextArea = false;
      }
    }
  }

  public getAnnotationBtnClickValue(event: any): void {
    if (event.type === 'open') {
      this.openAnnotationArray[event.lineIndex].displayAnnotationButton = false;
      this.openAnnotationArray[event.lineIndex].displayAnnotationTextArea =
        true;
    } else {
      this.openAnnotationArray[event.lineIndex].displayAnnotationButton = true;
      this.openAnnotationArray[event.lineIndex].displayAnnotationTextArea =
        false;
    }
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      this.onSubmit();
    }
  }

  public onSubmit(): void {}

  public onSubmitReview(data: any): void {}
}
