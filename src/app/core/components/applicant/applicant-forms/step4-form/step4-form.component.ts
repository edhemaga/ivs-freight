import { Component, Input, OnInit } from '@angular/core';

import { FormGroup, FormControl } from '@angular/forms';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { TruckType } from '../../state/model/truck-type.model';
import { AnswerChoices } from '../../state/model/applicant-question.model';
import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
  selector: 'app-step4-form',
  templateUrl: './step4-form.component.html',
  styleUrls: ['./step4-form.component.scss'],
})
export class Step4FormComponent implements OnInit {
  public selectedMode = SelectedMode.REVIEW;

  public openAnnotationArray: {
    lineIndex?: number;
    lineInputs?: boolean[];
    displayAnnotationButton?: boolean;
    displayAnnotationTextArea?: boolean;
  }[] = [
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {},
    {
      lineIndex: 10,
      lineInputs: [false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 11,
      lineInputs: [false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
  ];

  //
  ž;
  @Input() form: FormGroup;

  @Input() handleInputSelect: (event: any, action: string) => void;
  @Input() onIncrementDecrementCounter: (event: any, type: string) => void;

  @Input() truckType: TruckType[];

  @Input() fatalitiesCounter: number;
  @Input() injuriesCounter: number;

  @Input() answerChoices: AnswerChoices[];

  public fatalitiesControl: FormControl = new FormControl(0);
  public injuriesControl: FormControl = new FormControl(0);

  constructor() {}

  ngOnInit(): void {}

  public incorrectInput(
    event: any,
    inputIndex: number,
    lineIndex: number,
    type?: string
  ): void {
    const selectedInputsLine = this.openAnnotationArray.find(
      (item) => item.lineIndex === lineIndex
    );

    if (type === 'card') {
      selectedInputsLine.lineInputs[inputIndex] =
        !selectedInputsLine.lineInputs[inputIndex];

      selectedInputsLine.displayAnnotationButton =
        !selectedInputsLine.displayAnnotationButton;

      if (selectedInputsLine.displayAnnotationTextArea) {
        selectedInputsLine.displayAnnotationButton = false;
        selectedInputsLine.displayAnnotationTextArea = false;
      }
    } else {
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
        const isAnyInputInLineIncorrect =
          anyInputInLineIncorrect(lineInputItems);

        if (!isAnyInputInLineIncorrect) {
          selectedInputsLine.displayAnnotationButton = false;
          selectedInputsLine.displayAnnotationTextArea = false;
        }
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
}
