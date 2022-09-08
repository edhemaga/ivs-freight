import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { Applicant } from '../../state/model/applicant.model';
import {
  Accident,
  AccidentInfo,
  AccidentModel,
} from '../../state/model/accident.model';

@Component({
  selector: 'app-step4',
  templateUrl: './step4.component.html',
  styleUrls: ['./step4.component.scss'],
})
export class Step4Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.APPLICANT;

  public accidentForm: FormGroup;

  public accidentArray: AccidentModel[] = [];

  public selectedAccidentIndex: number;

  public helperIndex: number = 2;

  public isEditing: boolean = false;

  public formValuesToPatch: any;

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
    {
      lineIndex: 1,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 2,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 3,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {},
    {},
    {},
    {},
    {},
    {},
  ];

  /* public applicant: Applicant | undefined; */

  /* public accidentArray: Accident[] = []; */

  /* public accidentInfo: AccidentInfo | undefined; */

  /* public editAccident: number = -1; */

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  public trackByIdentity = (index: number, item: any): number => index;

  public createForm(): void {
    this.accidentForm = this.formBuilder.group({
      hasPastAccident: [false],

      cardReview1: [null],
      cardReview2: [null],
      cardReview3: [null],
      cardReview4: [null],
      cardReview5: [null],
      cardReview6: [null],
      cardReview7: [null],
      cardReview8: [null],
      cardReview9: [null],
      cardReview10: [null],
    });
  }

  public onDeleteAccident(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.accidentArray.splice(index, 1);
  }

  public onEditAccident(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.helperIndex = index;
    this.selectedAccidentIndex = index;

    this.isEditing = true;
    this.accidentArray[index].isEditingAccident = true;

    const selectedAccident = this.accidentArray[index];

    this.formValuesToPatch = selectedAccident;
  }

  public getAccidentFormValues(event: any): void {
    this.accidentArray = [...this.accidentArray, event];

    this.helperIndex = 2;

    const firstEmptyObjectInList = this.openAnnotationArray.find(
      (item) => Object.keys(item).length === 0
    );

    const indexOfFirstEmptyObjectInList = this.openAnnotationArray.indexOf(
      firstEmptyObjectInList
    );

    this.openAnnotationArray[indexOfFirstEmptyObjectInList] = {
      lineIndex: this.openAnnotationArray.indexOf(firstEmptyObjectInList),
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    };
  }

  public cancelAccidentEditing(event: any): void {
    this.isEditing = false;
    this.accidentArray[this.selectedAccidentIndex].isEditingAccident = false;

    this.helperIndex = 2;
    this.selectedAccidentIndex = -1;
  }

  public saveEditedAccident(event: any): void {
    this.isEditing = false;
    this.accidentArray[this.selectedAccidentIndex].isEditingAccident = false;

    this.accidentArray[this.selectedAccidentIndex] = event;

    this.helperIndex = 2;
    this.selectedAccidentIndex = -1;
  }

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

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
    }

    if (event.action === 'back-step') {
    }
  }

  /* private formFilling(): void {
      this.accidentForm.patchValue({
      hasPastAccident: [
        this.accidentInfo?.hasPastAccident,
        Validators.required,
      ],
    });

    this.accidentArray = this.accidentInfo?.accidents
      ? this.accidentInfo?.accidents
      : [];
  } */

  /* public onSubmitForm(): void {
    this.shared.clearNotifications();

        let isValid = true;

        if (!this.accidentForm.get('hasPastAccident').value) {
            if (this.editAccident !== -1) {
                this.onAddAccident();
            }

            if (!this.accidentArray?.length) {
                if (this.accidentForm.get('hazmatSpill').value === undefined) {
                    this.notification.warning(
                        'Please answer hazmat spill.',
                        'Warning:'
                    );
                    isValid = false;
                }
            }
            if (!isValid) {
                return false;
            }
        }
      const accidentInfoData = new AccidentInfo(this.accidentInfo);

    accidentInfoData.accidents = this.accidentArray;
    accidentInfoData.applicantId = this.applicant?.id;
    accidentInfoData.hasPastAccident = this.accidentForm.value.hasPastAccident;
    accidentInfoData.isCompleted = true;
    accidentInfoData.isDeleted = false;

    // REDUX
        this.apppEntityServices.AccidentService.upsert(
          accidentInfoData
        ).subscribe(
          (response) => {
            this.notification.success('Accident Info is updated');
          },
          (error) => {
            this.shared.handleError(error);
          }
        );
  } */

  /* public onSubmitReview(data: any): void {} */

  ngOnDestroy(): void {}
}
