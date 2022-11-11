import {
  Component,
  OnDestroy,
  OnInit,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil, Subscription } from 'rxjs';

import {
  anyInputInLineIncorrect,
  isFormValueNotEqual,
  isAnyPropertyInObjectFalse,
} from '../../state/utils/utils';

import {
  convertDateToBackend,
  convertDateFromBackendShortYear,
} from 'src/app/core/utils/methods.calculations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantStore } from '../../state/store/applicant.store';
import { ApplicantQuery } from '../../state/store/applicant.query';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { ApplicantQuestion } from '../../state/model/applicant-question.model';
import { ContactModel } from '../../state/model/education.model';
import {
  ApplicantResponse,
  CreateEducationCommand,
  CreateEducationReviewCommand,
  EducationFeedbackResponse,
} from 'appcoretruckassist/model/models';

@Component({
  selector: 'app-step6',
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.scss'],
})
export class Step6Component implements OnInit, OnDestroy {
  @ViewChildren('cmp') set content(content: QueryList<any>) {
    if (content) {
      const radioButtonsArray = content.toArray();

      this.specialTrainingRadios = radioButtonsArray[0]
        ? radioButtonsArray[0].buttons
        : null;

      this.otherTrainingRadios = radioButtonsArray[1]
        ? radioButtonsArray[1].buttons
        : null;

      this.knowledgeOfSafetyRegulationsRadios = radioButtonsArray[2]
        ? radioButtonsArray[2].buttons
        : null;

      this.driverForCompanyBeforeRadios = radioButtonsArray[3]
        ? radioButtonsArray[3].buttons
        : null;

      this.unableForJobRadios = radioButtonsArray[4]
        ? radioButtonsArray[4].buttons
        : null;
    }
  }

  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.FEEDBACK;

  public subscription: Subscription;

  public educationForm: FormGroup;
  public contactForm: FormGroup;

  public formStatus: string = 'INVALID';
  public markFormInvalid: boolean;

  public applicantId: number;

  public emergencyContactsId: number[];

  public stepValues: any;
  public lastItemStepValues: any;
  public stepHasValues: boolean = false;

  private specialTrainingRadios: any;
  private otherTrainingRadios: any;
  private knowledgeOfSafetyRegulationsRadios: any;
  private driverForCompanyBeforeRadios: any;
  private unableForJobRadios: any;

  public contactsArray: ContactModel[] = [];

  public lastContactCard: any;

  public schoolGrades: string[] = [
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
  ];
  public collegeGrades: string[] = ['1', '2', '3', '4'];

  public helperIndex: number = 2;
  public selectedContactIndex: number;

  public selectedGrade: number = -1;
  public selectedCollegeGrade: number = -1;

  public highlightGrade: number = -1;

  public isEditing: boolean = false;
  public isReviewingCard: boolean = false;

  public previousFormValuesOnEdit: any;

  public formValuesToPatch: any;

  public questions: ApplicantQuestion[] = [
    {
      title: 'Have you received any safety awards or special training?',
      formControlName: 'specialTraining',
      formControlNameExplain: 'specialTrainingExplain',
      answerChoices: [
        {
          id: 1,
          label: 'YES',
          value: 'specialTrainingYes',
          name: 'specialTrainingYes',
          checked: false,
          index: 0,
        },
        {
          id: 2,
          label: 'NO',
          value: 'specialTrainingNo',
          name: 'specialTrainingNo',
          checked: false,
          index: 0,
        },
      ],
    },
    {
      title: 'Other training?',
      formControlName: 'otherTraining',
      formControlNameExplain: 'otherTrainingExplain',
      answerChoices: [
        {
          id: 3,
          label: 'YES',
          value: 'otherTrainingYes',
          name: 'otherTrainingYes',
          checked: false,
          index: 1,
        },
        {
          id: 4,
          label: 'NO',
          value: 'otherTrainingNo',
          name: 'otherTrainingNo',
          checked: false,
          index: 1,
        },
      ],
    },
    {
      title:
        'Do you have full knowledge of the federal moto carrier safety regulations?',
      formControlName: 'knowledgeOfSafetyRegulations',
      formControlNameExplain: 'knowledgeOfSafetyRegulationsExplain',
      answerChoices: [
        {
          id: 5,
          label: 'YES',
          value: 'knowledgeOfSafetyRegulationsYes',
          name: 'knowledgeOfSafetyRegulationsYes',
          checked: false,
          index: 2,
        },
        {
          id: 6,
          label: 'NO',
          value: 'knowledgeOfSafetyRegulationsNo',
          name: 'knowledgeOfSafetyRegulationsNo',
          checked: false,
          index: 2,
        },
      ],
    },
    {
      title: 'Have you been a driver for this company before?',
      formControlName: 'driverForCompany',
      formControlNameExplain: 'driverForCompanyBeforeExplain',
      answerChoices: [
        {
          id: 7,
          label: 'YES',
          value: 'driverForCompanyBeforeYes',
          name: 'driverForCompanyBeforeYes',
          checked: false,
          index: 3,
        },
        {
          id: 8,
          label: 'NO',
          value: 'driverForCompanyBeforeNo',
          name: 'driverForCompanyBeforeNo',
          checked: false,
          index: 3,
        },
      ],
    },
    {
      title:
        'Is there any reason you might be unable to preform the functions of the job for which you have applied?',
      formControlName: 'unableForJob',
      formControlNameExplain: 'unableForJobExplain',
      answerChoices: [
        {
          id: 9,
          label: 'YES',
          value: 'unableForJobYes',
          name: 'unableForJobYes',
          checked: false,
          index: 4,
        },
        {
          id: 10,
          label: 'NO',
          value: 'unableForJobNo',
          name: 'unableForJobNo',
          checked: false,
          index: 4,
        },
      ],
    },
  ];

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
      lineInputs: [false, false],
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
    {},
    {},
    {},
    {},
    {},
  ];
  public questionsHaveIncorrectFields: boolean = false;
  public hasIncorrectFields: boolean = false;
  public cardsWithIncorrectFields: boolean = false;
  public previousFormValuesOnReview: any;

  public stepFeedbackValues: any;
  public isUpperFormFeedbackValueUpdated: boolean = true;
  public isBottomFormFeedbackValueUpdated: boolean = true;

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

  public trackByIdentity = (index: number, item: any): number => index;

  private createForm(): void {
    this.educationForm = this.formBuilder.group({
      specialTraining: [null, Validators.required],
      otherTraining: [null, Validators.required],
      knowledgeOfSafetyRegulations: [null, Validators.required],
      specialTrainingExplain: [null],
      otherTrainingExplain: [null],
      knowledgeOfSafetyRegulationsExplain: [null],
      driverForCompany: [null, Validators.required],
      driverForCompanyBeforeExplain: [null],
      driverForCompanyToExplain: [null],
      unableForJob: [null, Validators.required],
      unableForJobExplain: [null],

      questionReview1: [null],
      questionReview2: [null],
      questionReview3: [null],
      questionReview4: [null],
      questionReview5: [null],
    });

    this.contactForm = this.formBuilder.group({
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

  public getStepValuesFromStore(): void {
    this.applicantQuery.applicant$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res: ApplicantResponse) => {
        this.applicantId = res.id;

        if (res.education) {
          this.patchStepValues(res.education);

          this.stepHasValues = true;
        }
      });
  }

  public patchStepValues(stepValues: EducationFeedbackResponse): void {
    console.log('stepValues', stepValues);
    const {
      highestGrade,
      collegeGrade,
      emergencyContacts,
      specialTraining,
      specialTrainingDescription,
      otherTraining,
      otherTrainingDescription,
      knowledgeOfSafetyRegulations,
      driverBefore,
      from,
      to,
      unableForJob,
      unableForJobDescription,
      educationReview,
    } = stepValues;

    this.formStatus = 'VALID';

    this.selectedGrade = highestGrade - 1;
    this.selectedCollegeGrade = collegeGrade - 1;

    const lastItemInContactsArray =
      emergencyContacts[emergencyContacts.length - 1];

    const restOfTheItemsInContactsArray = [...emergencyContacts];

    restOfTheItemsInContactsArray.pop();

    const filteredContactsArray = restOfTheItemsInContactsArray.map((item) => {
      return {
        isEditingContact: false,
        name: item.name,
        phone: item.phone,
        relationship: item.relationship,
        emergencyContactReview: item.emergencyContactReview
          ? item.emergencyContactReview
          : null,
      };
    });

    const filteredLastItemInContactsArray = {
      id: lastItemInContactsArray.id,
      isEditingContact: false,
      name: lastItemInContactsArray.name,
      phone: lastItemInContactsArray.phone,
      relationship: lastItemInContactsArray.relationship,
      emergencyContactReview: lastItemInContactsArray.emergencyContactReview
        ? lastItemInContactsArray.emergencyContactReview
        : null,
    };

    this.lastContactCard = {
      name: filteredLastItemInContactsArray.name,
      phone: filteredLastItemInContactsArray.phone,
      relationship: filteredLastItemInContactsArray.relationship,
    };

    this.contactsArray = JSON.parse(JSON.stringify(filteredContactsArray));

    this.formValuesToPatch = filteredLastItemInContactsArray;
    this.previousFormValuesOnReview = filteredLastItemInContactsArray;
    this.previousFormValuesOnEdit = this.contactsArray.length
      ? filteredLastItemInContactsArray
      : {
          name: null,
          phone: null,
          relationship: null,
        };

    for (let i = 0; i < filteredContactsArray.length; i++) {
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

    this.educationForm.patchValue({
      specialTraining,
      otherTraining,
      specialTrainingExplain: specialTrainingDescription,
      otherTrainingExplain: otherTrainingDescription,
      knowledgeOfSafetyRegulations,
      driverForCompany: driverBefore,
      driverForCompanyBeforeExplain:
        from && convertDateFromBackendShortYear(from),
      driverForCompanyToExplain: to && convertDateFromBackendShortYear(to),
      unableForJob,
      unableForJobExplain: unableForJobDescription,
    });

    setTimeout(() => {
      if (specialTraining) {
        this.specialTrainingRadios[0].checked = true;
      } else {
        this.specialTrainingRadios[1].checked = true;
      }

      if (otherTraining) {
        this.otherTrainingRadios[0].checked = true;
      } else {
        this.otherTrainingRadios[1].checked = true;
      }

      if (knowledgeOfSafetyRegulations) {
        this.knowledgeOfSafetyRegulationsRadios[0].checked = true;
      } else {
        this.knowledgeOfSafetyRegulationsRadios[1].checked = true;
      }

      if (driverBefore) {
        this.driverForCompanyBeforeRadios[0].checked = true;
      } else {
        this.driverForCompanyBeforeRadios[1].checked = true;
      }

      if (unableForJob) {
        this.unableForJobRadios[0].checked = true;
      } else {
        this.unableForJobRadios[1].checked = true;
      }
    }, 50);

    if (this.selectedMode === SelectedMode.REVIEW) {
      if (stepValues.educationReview) {
        const {
          isSpecialTrainingDescriptionValid,
          specialTrainingDescriptionMessage,
          isOtherTrainingDescriptionValid,
          otherTrainingDescriptionMessage,
          isFromValid,
          isToValid,
          datesMessage,
          isUnableToPreformJobDescriptionValid,
          unableToPreformJobDescriptionMessage,
        } = stepValues.educationReview;

        this.openAnnotationArray[0] = {
          ...this.openAnnotationArray[0],
          lineInputs: [!isSpecialTrainingDescriptionValid],
          displayAnnotationButton:
            !isSpecialTrainingDescriptionValid &&
            !specialTrainingDescriptionMessage
              ? true
              : false,
          displayAnnotationTextArea: specialTrainingDescriptionMessage
            ? true
            : false,
        };
        this.openAnnotationArray[1] = {
          ...this.openAnnotationArray[1],
          lineInputs: [!isOtherTrainingDescriptionValid],
          displayAnnotationButton:
            !isOtherTrainingDescriptionValid && !otherTrainingDescriptionMessage
              ? true
              : false,
          displayAnnotationTextArea: otherTrainingDescriptionMessage
            ? true
            : false,
        };
        this.openAnnotationArray[2] = {
          ...this.openAnnotationArray[2],
          lineInputs: [!isFromValid, !isToValid],
          displayAnnotationButton:
            (!isFromValid || !isToValid) && !datesMessage ? true : false,
          displayAnnotationTextArea: datesMessage ? true : false,
        };
        this.openAnnotationArray[3] = {
          ...this.openAnnotationArray[3],
          lineInputs: [!isUnableToPreformJobDescriptionValid],
          displayAnnotationButton:
            !isUnableToPreformJobDescriptionValid &&
            !unableToPreformJobDescriptionMessage
              ? true
              : false,
          displayAnnotationTextArea: unableToPreformJobDescriptionMessage
            ? true
            : false,
        };

        const inputFieldsArray = JSON.stringify(
          this.openAnnotationArray
            .filter((item) => Object.keys(item).length !== 0)
            .map((item) => item.lineInputs)
        );

        if (inputFieldsArray.includes('true')) {
          this.questionsHaveIncorrectFields = true;
        } else {
          this.questionsHaveIncorrectFields = false;
        }

        this.educationForm.patchValue({
          questionReview1: specialTrainingDescriptionMessage,
          questionReview2: otherTrainingDescriptionMessage,
          questionReview4: datesMessage,
          questionReview5: unableToPreformJobDescriptionMessage,
        });
      }
    }

    if (this.selectedMode === SelectedMode.FEEDBACK) {
      if (educationReview) {
        this.stepFeedbackValues = {
          ...this.stepFeedbackValues,
          ...educationReview,
        };
      }

      const lastContactsItem = emergencyContacts[emergencyContacts.length - 1];

      console.log('lastContactsItem', lastContactsItem);

      const lastContactsItemReview = lastContactsItem.emergencyContactReview;

      console.log('lastContactsItemReview', lastContactsItemReview);

      this.stepFeedbackValues = {
        ...this.stepFeedbackValues,
        lastContactsItemReview: {
          isNameValid: lastContactsItemReview
            ? lastContactsItemReview?.isNameValid
            : true,
          isPhoneValid: lastContactsItemReview
            ? lastContactsItemReview?.isPhoneValid
            : true,
          isRelationshipValid: lastContactsItemReview
            ? lastContactsItemReview?.isRelationshipValid
            : true,
          emergencyContactMessage: lastContactsItemReview
            ? lastContactsItemReview.emergencyContactMessage
            : null,
        },
      };

      const hasIncorrectValue = isAnyPropertyInObjectFalse(
        this.stepFeedbackValues
      );

      if (hasIncorrectValue) {
        this.startUpperFormFeedbackValueChangesMonitoring();
      }

      console.log('this.stepFeedbackValues', this.stepFeedbackValues);

      this.stepValues = stepValues;
      this.lastItemStepValues = lastContactsItem;
    }
  }

  public handleInputSelect(event: any): void {
    const selectedCheckbox = event.find(
      (radio: { checked: boolean }) => radio.checked
    );

    const selectedFormControlName =
      this.questions[selectedCheckbox.index].formControlName;

    const selectedExplainFormControlName =
      this.questions[selectedCheckbox.index].formControlNameExplain;

    if (selectedCheckbox.label === 'YES') {
      this.educationForm.get(selectedFormControlName).patchValue(true);

      this.inputService.changeValidators(
        this.educationForm.get(selectedExplainFormControlName)
      );

      if (selectedCheckbox.index === 2) {
        this.inputService.changeValidators(
          this.educationForm.get(selectedExplainFormControlName),
          false
        );
      }

      if (selectedCheckbox.index === 3) {
        this.inputService.changeValidators(
          this.educationForm.get('driverForCompanyBeforeExplain')
        );

        this.inputService.changeValidators(
          this.educationForm.get('driverForCompanyToExplain')
        );
      }
    } else {
      this.educationForm.get(selectedFormControlName).patchValue(false);

      this.inputService.changeValidators(
        this.educationForm.get(selectedExplainFormControlName),
        false
      );

      if (selectedCheckbox.index === 2) {
        this.inputService.changeValidators(
          this.educationForm.get(selectedExplainFormControlName),
          false
        );
      }

      if (selectedCheckbox.index === 3) {
        this.inputService.changeValidators(
          this.educationForm.get('driverForCompanyBeforeExplain'),
          false
        );

        this.inputService.changeValidators(
          this.educationForm.get('driverForCompanyToExplain'),
          false
        );

        this.educationForm.patchValue({
          driverForCompanyBeforeExplain: null,
          driverForCompanyToExplain: null,
        });
      }
    }
  }

  public onSchoolGradeClick(gradeIndex: number): void {
    if (this.selectedMode !== SelectedMode.APPLICANT) {
      return;
    }

    this.selectedGrade = gradeIndex;
    this.selectedCollegeGrade = -1;
  }

  public onCollegeGradeClick(gradeIndex: number): void {
    if (this.selectedMode !== SelectedMode.APPLICANT) {
      return;
    }

    this.selectedCollegeGrade = gradeIndex;

    if (this.selectedCollegeGrade) {
      this.selectedGrade = 11;
    }
  }

  public onDeleteContact(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.contactsArray.splice(index, 1);
  }

  public onEditContact(index: number): void {
    if (this.isEditing) {
      this.isEditing = false;
      this.contactsArray[this.selectedContactIndex].isEditingContact = false;

      this.helperIndex = 2;
      this.selectedContactIndex = -1;
    }

    this.helperIndex = index;
    this.selectedContactIndex = index;

    this.isEditing = true;
    this.contactsArray[index].isEditingContact = true;

    const selectedContact = this.contactsArray[index];

    if (this.lastContactCard) {
      this.previousFormValuesOnEdit = {
        name: this.lastContactCard.name,
        phone: this.lastContactCard.phone,
        relationship: this.lastContactCard.relationship,
      };
    }

    this.formValuesToPatch = selectedContact;
  }

  public getContactFormValues(event: any): void {
    this.contactsArray = [...this.contactsArray, event];

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

  public cancelContactEditing(event: any): void {
    this.isEditing = false;
    this.contactsArray[this.selectedContactIndex].isEditingContact = false;

    this.helperIndex = 2;
    this.selectedContactIndex = -1;

    this.formValuesToPatch = this.previousFormValuesOnEdit;
  }

  public saveEditedContact(event: any): void {
    this.isEditing = false;
    this.contactsArray[this.selectedContactIndex].isEditingContact = false;

    this.contactsArray[this.selectedContactIndex] = event;

    this.helperIndex = 2;
    this.selectedContactIndex = -1;

    this.formValuesToPatch = this.previousFormValuesOnEdit;
  }

  public onGetFormStatus(status: string): void {
    this.formStatus = status;
  }

  public onMarkInvalidEmit(event: any): void {
    if (!event) {
      this.markFormInvalid = false;
    }
  }

  public onGetLastFormValues(event: any): void {
    this.lastContactCard = event;

    if (this.selectedMode === SelectedMode.FEEDBACK) {
      if (event) {
        this.startBottomFormFeedbackValueChangesMonitoring();
      }
    }
  }

  public onHasIncorrectFields(event: any): void {
    if (event) {
      this.hasIncorrectFields = true;
    } else {
      this.hasIncorrectFields = false;
    }
  }

  public onGetOpenAnnotationArrayValues(event: any): void {
    this.previousFormValuesOnReview.emergencyContactReview = {
      isNameValid: !event[0].lineInputs[0],
      isPhoneValid: !event[0].lineInputs[1],
      isRelationshipValid: !event[0].lineInputs[2],
    };
  }

  public onGetCardOpenAnnotationArrayValues(event: any): void {
    this.isReviewingCard = false;

    this.contactsArray[this.selectedContactIndex].isEditingContact = false;

    this.contactsArray[this.selectedContactIndex].emergencyContactReview = {
      isNameValid: !event[0].lineInputs[0],
      isPhoneValid: !event[0].lineInputs[1],
      isRelationshipValid: !event[0].lineInputs[2],
    };

    const hasInvalidFields = JSON.stringify(
      this.contactsArray[this.selectedContactIndex].emergencyContactReview
    );

    if (hasInvalidFields.includes('false')) {
      this.openAnnotationArray[
        this.selectedContactIndex + 4
      ].displayAnnotationButton = true;

      this.openAnnotationArray[this.selectedContactIndex + 4].lineInputs[0] =
        true;

      this.cardsWithIncorrectFields = true;
    } else {
      this.openAnnotationArray[
        this.selectedContactIndex
      ].displayAnnotationButton = false;

      this.hasIncorrectFields = false;
    }

    this.helperIndex = 2;
    this.selectedContactIndex = -1;

    this.formValuesToPatch = this.previousFormValuesOnReview;
  }

  public cancelContactReview(event: any): void {
    this.isReviewingCard = false;

    this.contactsArray[this.selectedContactIndex].isEditingContact = false;

    this.helperIndex = 2;
    this.selectedContactIndex = -1;

    this.formValuesToPatch = this.previousFormValuesOnReview;
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
      if (selectedInputsLine.displayAnnotationButton) {
        selectedInputsLine.lineInputs[inputIndex] = false;
        selectedInputsLine.displayAnnotationButton = false;
      }

      if (selectedInputsLine.displayAnnotationTextArea) {
        selectedInputsLine.displayAnnotationButton = false;
        selectedInputsLine.displayAnnotationTextArea = false;
      }

      Object.keys(
        this.contactsArray[lineIndex - 4].emergencyContactReview
      ).forEach((key) => {
        this.contactsArray[lineIndex - 4].emergencyContactReview[key] = true;
      });

      const inputFieldsArray = JSON.stringify(
        this.openAnnotationArray
          .filter((item) => Object.keys(item).length !== 0)
          .map((item) => item.lineInputs)
      );

      if (inputFieldsArray.includes('true')) {
        this.cardsWithIncorrectFields = true;
      } else {
        this.cardsWithIncorrectFields = false;
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

        switch (lineIndex) {
          case 0:
            this.educationForm.get('questionReview1').patchValue(null);
            break;

          case 1:
            this.educationForm.get('questionReview2').patchValue(null);
            break;

          case 2:
            if (!isAnyInputInLineIncorrect) {
              this.educationForm.get('questionReview4').patchValue(null);
            }
            break;

          case 3:
            this.educationForm.get('questionReview5').patchValue(null);
            break;

          default:
            break;
        }
      }
    }

    const inputFieldsArray = JSON.stringify(
      this.openAnnotationArray
        .filter((item) => Object.keys(item).length !== 0)
        .map((item) => item.lineInputs)
    );

    if (inputFieldsArray.includes('true')) {
      this.questionsHaveIncorrectFields = true;
    } else {
      this.questionsHaveIncorrectFields = false;
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

  public onCardReview(index: number) {
    if (this.isReviewingCard) {
      return;
    }

    this.helperIndex = index;
    this.selectedContactIndex = index;

    this.contactsArray[index].isEditingContact = true;

    this.isReviewingCard = true;

    const selectedContact = this.contactsArray[index];

    this.formValuesToPatch = selectedContact;
  }

  public startUpperFormFeedbackValueChangesMonitoring(): void {
    if (this.stepFeedbackValues) {
      const filteredIncorrectValues = Object.keys(
        this.stepFeedbackValues
      ).reduce((o, key) => {
        this.stepFeedbackValues[key] === false &&
          (o[key] = this.stepFeedbackValues[key]);

        return o;
      }, {});

      const hasIncorrectValues = Object.keys(filteredIncorrectValues).length;

      if (hasIncorrectValues) {
        this.subscription = this.educationForm.valueChanges
          .pipe(takeUntil(this.destroy$))
          .subscribe((updatedFormValues) => {
            const filteredFieldsWithIncorrectValues = Object.keys(
              filteredIncorrectValues
            ).reduce((o, key) => {
              const keyName = key
                .replace('Valid', '')
                .replace('is', '')
                .trim()
                .toLowerCase();

              const match = Object.keys(this.stepValues)
                .filter((item) => item.toLowerCase().includes(keyName))
                .pop();

              o[keyName] = this.stepValues[match];

              if (keyName === 'from') {
                o['from'] = convertDateFromBackendShortYear(o['from']);
              }

              if (keyName === 'to') {
                o['to'] = convertDateFromBackendShortYear(o['to']);
              }

              if (keyName === 'unabletopreformjobdescription') {
                o['unabletopreformjobdescription'] =
                  this.stepValues.unableForJobDescription;
              }

              return o;
            }, {});

            const filteredUpdatedFieldsWithIncorrectValues = Object.keys(
              filteredFieldsWithIncorrectValues
            ).reduce((o, key) => {
              const keyName = key;

              if (keyName === 'specialtrainingdescription') {
                o['specialtrainingdescription'] =
                  updatedFormValues.specialTrainingExplain;
              }

              if (keyName === 'othertrainingdescription') {
                o['othertrainingdescription'] =
                  updatedFormValues.otherTrainingExplain;
              }

              if (keyName === 'from') {
                o['from'] = updatedFormValues.driverForCompanyBeforeExplain;
              }

              if (keyName === 'to') {
                o['to'] = updatedFormValues.driverForCompanyToExplain;
              }

              if (keyName === 'unabletopreformjobdescription') {
                o['unabletopreformjobdescription'] =
                  updatedFormValues.unableForJobExplain;
              }

              return o;
            }, {});

            const isFormNotEqual = isFormValueNotEqual(
              filteredFieldsWithIncorrectValues,
              filteredUpdatedFieldsWithIncorrectValues
            );

            if (isFormNotEqual) {
              this.isUpperFormFeedbackValueUpdated = true;
            } else {
              this.isUpperFormFeedbackValueUpdated = false;
            }
          });
      }
    }
  }

  public startBottomFormFeedbackValueChangesMonitoring(): void {
    if (this.stepFeedbackValues) {
      const filteredContactIncorrectValues = Object.keys(
        this.stepFeedbackValues?.lastContactsItemReview
      ).reduce((o, key) => {
        this.stepFeedbackValues.lastContactsItemReview[key] === false &&
          (o[key] = this.stepFeedbackValues?.lastContactsItemReview[key]);

        return o;
      }, {});

      const contactHasIncorrectValues = Object.keys(
        filteredContactIncorrectValues
      ).length;

      if (contactHasIncorrectValues) {
        const filteredFieldsWithIncorrectValues = Object.keys(
          filteredContactIncorrectValues
        ).reduce((o, key) => {
          const keyName = key
            .replace('Valid', '')
            .replace('is', '')
            .trim()
            .toLowerCase();

          const match = Object.keys(this.lastItemStepValues)
            .filter((item) => item.toLowerCase().includes(keyName))
            .pop();

          o[keyName] = this.lastItemStepValues[match];

          return o;
        }, {});

        const filteredUpdatedFieldsWithIncorrectValues = Object.keys(
          filteredFieldsWithIncorrectValues
        ).reduce((o, key) => {
          const keyName = key;

          const match = Object.keys(this.lastItemStepValues)
            .filter((item) => item.toLowerCase().includes(keyName))
            .pop();

          o[keyName] = this.lastContactCard[match];

          return o;
        }, {});

        const isFormNotEqual = isFormValueNotEqual(
          filteredFieldsWithIncorrectValues,
          filteredUpdatedFieldsWithIncorrectValues
        );

        if (isFormNotEqual) {
          this.isBottomFormFeedbackValueUpdated = true;
        } else {
          this.isBottomFormFeedbackValueUpdated = false;
        }
      }
    }
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

    if (event.action === 'back-step') {
      this.router.navigate([`/application/${this.applicantId}/5`]);
    }
  }

  public onSubmit(): void {
    if (this.selectedMode === SelectedMode.FEEDBACK) {
      if (
        !this.isUpperFormFeedbackValueUpdated ||
        !this.isBottomFormFeedbackValueUpdated
      ) {
        return;
      }
    }

    if (this.educationForm.invalid) {
      this.inputService.markInvalid(this.educationForm);

      return;
    }

    if (this.formStatus === 'INVALID') {
      this.markFormInvalid = true;

      return;
    }

    const {
      specialTrainingExplain,
      otherTrainingExplain,
      knowledgeOfSafetyRegulationsExplain,
      driverForCompany,
      driverForCompanyBeforeExplain,
      driverForCompanyToExplain,
      unableForJobExplain,
      questionReview1,
      questionReview2,
      questionReview3,
      questionReview4,
      questionReview5,
      ...educationForm
    } = this.educationForm.value;

    const filteredContactsArray = this.contactsArray.map((item) => {
      return {
        name: item.name,
        phone: item.phone,
        relationship: item.relationship,
      };
    });

    const filteredLastContactCard = {
      name: this.lastContactCard.name,
      phone: this.lastContactCard.phone,
      relationship: this.lastContactCard.relationship,
    };

    const saveData: CreateEducationCommand = {
      ...educationForm,
      applicantId: this.applicantId,
      highestGrade: this.selectedGrade > -1 ? this.selectedGrade + 1 : -1,
      collegeGrade:
        this.selectedCollegeGrade > -1 ? this.selectedCollegeGrade + 1 : -1,
      specialTrainingDescription: specialTrainingExplain,
      otherTrainingDescription: otherTrainingExplain,
      driverBefore: driverForCompany,
      from: driverForCompany
        ? convertDateToBackend(driverForCompanyBeforeExplain)
        : null,
      to: driverForCompany
        ? convertDateToBackend(driverForCompanyToExplain)
        : null,
      unableForJobDescription: unableForJobExplain,
      emergencyContacts: [...filteredContactsArray, filteredLastContactCard],
    };

    const selectMatchingBackendMethod = () => {
      if (this.selectedMode === SelectedMode.APPLICANT && !this.stepHasValues) {
        return this.applicantActionsService.createEducation(saveData);
      }

      if (
        (this.selectedMode === SelectedMode.APPLICANT && this.stepHasValues) ||
        this.selectedMode === SelectedMode.FEEDBACK
      ) {
        return this.applicantActionsService.updateEducation(saveData);
      }
    };

    selectMatchingBackendMethod()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/7`]);

          this.applicantStore.update((store) => {
            return {
              ...store,
              applicant: {
                ...store.applicant,
                education: {
                  ...store.applicant.education,
                  highestGrade: saveData.highestGrade,
                  collegeGrade: saveData.collegeGrade,
                  specialTraining: saveData.specialTraining,
                  specialTrainingDescription:
                    saveData.specialTrainingDescription,
                  otherTraining: saveData.otherTraining,
                  otherTrainingDescription: saveData.otherTrainingDescription,
                  knowledgeOfSafetyRegulations:
                    saveData.knowledgeOfSafetyRegulations,
                  driverBefore: saveData.driverBefore,
                  from: saveData.from,
                  to: saveData.to,
                  unableForJob: saveData.unableForJob,
                  unableForJobDescription: saveData.unableForJobDescription,
                  emergencyContacts: saveData.emergencyContacts,
                },
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
    const {
      questionReview1,
      questionReview2,
      questionReview4,
      questionReview5,
    } = this.educationForm.value;

    const lastItemReview =
      this.previousFormValuesOnReview.emergencyContactReview;

    const lastItemId = this.previousFormValuesOnReview.id;

    const lastReviewedItemInContactsArray = {
      itemId: lastItemId,
      isNameValid: lastItemReview ? lastItemReview.isNameValid : true,
      isPhoneValid: lastItemReview ? lastItemReview.isPhoneValid : true,
      isRelationshipValid: lastItemReview
        ? lastItemReview.isRelationshipValid
        : true,
      emergencyContactMessage: this.lastContactCard.firstRowReview,
    };

    const saveData: CreateEducationReviewCommand = {
      applicantId: this.applicantId,
      isSpecialTrainingDescriptionValid:
        !this.openAnnotationArray[0].lineInputs[0],
      specialTrainingDescriptionMessage: questionReview1,
      isOtherTrainingDescriptionValid:
        !this.openAnnotationArray[1].lineInputs[0],
      otherTrainingDescriptionMessage: questionReview2,
      isFromValid: !this.openAnnotationArray[2].lineInputs[0],
      isToValid: !this.openAnnotationArray[2].lineInputs[1],
      datesMessage: questionReview4,
      isUnableToPreformJobDescriptionValid:
        !this.openAnnotationArray[3].lineInputs[0],
      unableToPreformJobDescriptionMessage: questionReview5,
      emergencyContactReviews: [lastReviewedItemInContactsArray],
    };

    console.log('saveData', saveData);

    this.applicantActionsService
      .createEducationReview(saveData)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.router.navigate([`/application/${this.applicantId}/7`]);

          const { emergencyContactReviews, ...stepValuesReview } = saveData;

          this.applicantStore.update((store) => {
            return {
              ...store,
              applicant: {
                ...store.applicant,
                education: {
                  ...store.applicant.education,
                  educationReview: stepValuesReview,
                  emergencyContacts:
                    store.applicant.education.emergencyContacts.map(
                      (item, index) => {
                        if (
                          index ===
                          store.applicant.education.emergencyContacts.length - 1
                        ) {
                          return {
                            ...item,
                            emergencyContactReview: {
                              ...item.emergencyContactReview,
                              isNameValid:
                                lastReviewedItemInContactsArray.isNameValid,
                              isPhoneValid:
                                lastReviewedItemInContactsArray.isPhoneValid,
                              isRelationshipValid:
                                lastReviewedItemInContactsArray.isRelationshipValid,
                              emergencyContactMessage:
                                lastReviewedItemInContactsArray.emergencyContactMessage,
                            },
                          };
                        }

                        return item;
                      }
                    ),
                },
              },
            };
          });
        },
        error: (err) => {
          console.log(err);
        },
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

/*

    this.contactForm = this.formBuilder.group({
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
    }); */

/* public openAnnotationArray: {
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
      lineInputs: [false, false],
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
    {},
    {},
    {},
    {},
    {},
  ]; */
