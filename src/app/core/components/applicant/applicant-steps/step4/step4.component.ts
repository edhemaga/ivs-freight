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

  public applicant: Applicant | undefined;

  public accidentForm: FormGroup;
  public accidentArray: AccidentModel[] = [
    {
      accidentDate: '01/09/12',
      accidentLocation: {
        address: 'Chicago, IL, USA',
        city: 'Chicago',
        country: 'US',
        state: 'IL',
        stateShortName: 'IL',
        street: '',
        streetNumber: '',
        zipCode: '',
      },
      accidentState: 'AL',
      fatalities: 1,
      injuries: 1,
      hazmatSpill: 'YES',
      truckType: 'Truck',
      accidentDescription: 'Lorem Ipsum Dolor Sir Ametiblablabla',
      isEditingAccident: false,
    },
    {
      accidentDate: '01/09/12',
      accidentLocation: {
        address: 'Chicago, IL, USA',
        city: 'Chicago',
        country: 'US',
        state: 'IL',
        stateShortName: 'IL',
        street: '',
        streetNumber: '',
        zipCode: '',
      },
      accidentState: 'AL',
      fatalities: 1,
      injuries: 1,
      hazmatSpill: 'YES',
      truckType: 'Truck',
      accidentDescription: 'Lorem Ipsum Dolor Sir Ametiblablabla',
      isEditingAccident: false,
    },
    {
      accidentDate: '01/09/12',
      accidentLocation: {
        address: 'Chicago, IL, USA',
        city: 'Chicago',
        country: 'US',
        state: 'IL',
        stateShortName: 'IL',
        street: '',
        streetNumber: '',
        zipCode: '',
      },
      accidentState: 'AL',
      fatalities: 1,
      injuries: 1,
      hazmatSpill: 'YES',
      truckType: 'Truck',
      accidentDescription: 'Lorem Ipsum Dolor Sir Ametiblablabla',
      isEditingAccident: false,
    },
    {
      accidentDate: '01/09/12',
      accidentLocation: {
        address: 'Chicago, IL, USA',
        city: 'Chicago',
        country: 'US',
        state: 'IL',
        stateShortName: 'IL',
        street: '',
        streetNumber: '',
        zipCode: '',
      },
      accidentState: 'AL',
      fatalities: 1,
      injuries: 1,
      hazmatSpill: 'YES',
      truckType: 'Truck',
      accidentDescription: 'Lorem Ipsum Dolor Sir Ametiblablabla',
      isEditingAccident: false,
    },
  ];

  public selectedAccidentIndex: number;

  public isEditing: boolean = false;

  public helperIndex: number = 2;

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

  //

  /* public accidentArray: Accident[] = []; */

  public accidentInfo: AccidentInfo | undefined;

  public editAccident: number = -1;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
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

    this.isEditing = true;
    this.accidentArray[index].isEditingAccident = true;

    this.selectedAccidentIndex = index;

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

  private formFilling(): void {
    /*   this.accidentForm.patchValue({
      hasPastAccident: [
        this.accidentInfo?.hasPastAccident,
        Validators.required,
      ],
    });

    this.accidentArray = this.accidentInfo?.accidents
      ? this.accidentInfo?.accidents
      : []; */
  }

  public onSubmitForm(): void {
    /* this.shared.clearNotifications();

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
        } */
    /*   const accidentInfoData = new AccidentInfo(this.accidentInfo);

    accidentInfoData.accidents = this.accidentArray;
    accidentInfoData.applicantId = this.applicant?.id;
    accidentInfoData.hasPastAccident = this.accidentForm.value.hasPastAccident;
    accidentInfoData.isCompleted = true;
    accidentInfoData.isDeleted = false;
 */
    /* REDUX
        this.apppEntityServices.AccidentService.upsert(
          accidentInfoData
        ).subscribe(
          (response) => {
            this.notification.success('Accident Info is updated');
          },
          (error) => {
            this.shared.handleError(error);
          }
        ); */
  }

  public onStepAction(event: any): void {
    if (event.action === 'next-step') {
      this.onSubmitForm();
    }
  }

  public onSubmitReview(data: any): void {}

  ngOnDestroy(): void {}
}
