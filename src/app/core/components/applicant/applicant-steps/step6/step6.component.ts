import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { ApplicantQuestion } from '../../state/model/applicant-question.model';
import { Applicant } from '../../state/model/applicant.model';
import {
  Contact,
  Education,
  ContactModel,
} from '../../state/model/education.model';

@Component({
  selector: 'app-step6',
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.scss'],
})
export class Step6Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.REVIEW;

  public applicant: Applicant | undefined;

  public educationForm: FormGroup;
  public contactForm: FormGroup;

  public contactsArray: ContactModel[] = [];

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

  public selectedGrade: number = -1;
  public selectedCollegeGrade: number = -1;
  public selectedContactIndex: number;

  public highlightGrade: number = -1;

  public isEditing: boolean = false;
  public isContactEdited: boolean = false;

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
      lineInputs: [false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 4,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 5,
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
  ];

  //

  /*  public contactsFormArray: Contact[] | undefined = [];
   */
  public educationInfo: Education | undefined;

  public editContact: number = -1;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  public trackByIdentity = (index: number, item: any): number => index;

  private createForm(): void {
    this.educationForm = this.formBuilder.group({
      specialTraining: [null, Validators.required],
      otherTraining: [null, Validators.required],
      knowledgeOfSafetyRegulations: [null, Validators.required],
      specialTrainingExplain: [null, Validators.required],
      otherTrainingExplain: [null, Validators.required],
      knowledgeOfSafetyRegulationsExplain: [null, Validators.required],
      driverForCompany: [null, Validators.required],
      driverForCompanyBeforeExplain: [null, Validators.required],
      driverForCompanyToExplain: [null, Validators.required],
      unableForJob: [null, Validators.required],
      unableForJobExplain: [null, Validators.required],

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

  public handleInputSelect(event: any): void {
    const selectedCheckbox = event.find(
      (radio: { checked: boolean }) => radio.checked
    );

    const selectedFormControlName =
      this.questions[selectedCheckbox.index].formControlName;

    this.educationForm
      .get(selectedFormControlName)
      .patchValue(selectedCheckbox.label);
  }

  public onDeleteContact(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.contactsArray.splice(index, 1);
  }

  public onEditContact(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.helperIndex = index;

    this.isContactEdited = false;

    this.isEditing = true;
    this.contactsArray[index].isEditingContact = true;

    this.selectedContactIndex = index;

    const selectedContact = this.contactsArray[index];

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
  }

  public saveEditedContact(event: any): void {
    this.contactsArray[this.selectedContactIndex] = event;

    this.isEditing = false;

    this.helperIndex = 2;
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

  private formFIlling(): void {
    this.selectedGrade = this.educationInfo?.grade
      ? this.educationInfo?.grade
      : 0;

    this.selectedCollegeGrade = this.educationInfo?.collegeGrade
      ? this.educationInfo?.collegeGrade
      : 0;

    this.educationForm.patchValue({
      specialTraining: this.educationInfo?.specialTraining,
      specialTrainingExplain: this.educationInfo?.specialTrainingExplain,
      otherTraining: this.educationInfo?.otherTraining,
      otherTrainingExplain: this.educationInfo?.otherTrainingExplain,
      knowledgeOfSafetyRegulations:
        this.educationInfo?.knowledgeOfSafetyRegulations,
      knowledgeOfSafetyRegulationsExplain:
        this.educationInfo?.knowledgeOfSafetyRegulationsExplain,
    });

    // if (this.specialTraining) {
    //     this.educationForm.controls['specialTrainingExplain'].setValidators(
    //         Validators.required
    //     );
    // } else {
    //     this.educationForm.controls['specialTrainingExplain'].setValidators(
    //         []
    //     );
    // }

    // if (this.otherTraining) {
    //     this.educationForm.controls['otherTrainingExplain'].setValidators(
    //         Validators.required
    //     );
    // } else {
    //     this.educationForm.controls['otherTrainingExplain'].setValidators(
    //         []
    //     );
    // }

    // if (this.knowledgeOfSafetyRegulations) {
    //     this.educationForm.controls[
    //         'knowledgeOfSafetyRegulationsExplain'
    //     ].setValidators(Validators.required);
    // } else {
    //     this.educationForm.controls[
    //         'knowledgeOfSafetyRegulationsExplain'
    //     ].setValidators([]);
    // }

    // this.educationForm.controls[
    //     'specialTrainingExplain'
    // ].updateValueAndValidity();

    // this.educationForm.controls[
    //     'otherTrainingExplain'
    // ].updateValueAndValidity();

    // this.educationForm.controls[
    //     'knowledgeOfSafetyRegulationsExplain'
    // ].updateValueAndValidity();

    /*   this.contactsFormArray = this.educationInfo?.contacts; */

    // this.generalForm = this.fb.group({
    //     when: since
    //         ? new NgbDate(
    //               since.getFullYear(),
    //               since.getMonth() + 1,
    //               since.getDate()
    //           )
    //         : undefined,
    // });
  }

  public onSubmitForm(): void {
    /*  this.shared.clearNotifications();

        let isValid = true;

        if (this.knowledgeOfSafetyRegulations === undefined) {
            this.notification.warning(
                'Please answer safety regulations.',
                'Warning:'
            );
            isValid = false;
        }

        if (!this.contactData?.length) {
            if (!this.shared.markInvalid(this.contactForm)) {
                isValid = false;
            }

            if (this.contactData && this.contactData.length < 1) {
                if (this.shared.markInvalid(this.contactForm)) {
                    this.onAddContact();
                } else {
                    isValid = false;
                }
            }
        }

        if (this.unableForJob === undefined) {
            this.notification.warning(
                'Please answer general second question.',
                'Warning:'
            );
            isValid = false;
        }

        if (this.editContact !== -1) {
            this.notification.warning('Please save contact.', 'Warning:');
            isValid = false;
        }

        if (!isValid) {
            return false;
        } */
    /*    const educationForm = this.educationForm.value;
    const education = new Education(this.educationInfo);

    education.applicantId = this.applicant?.id;
    education.contacts = this.contactsFormArray;

    education.grade = this.selectedGrade + 1;
    education.collegeGrade = this.selectedCollegeGrade + 1;

    education.specialTraining = educationForm.specialTraining;
    education.specialTrainingExplain = educationForm.specialTrainingExplain;
    education.otherTraining = educationForm.otherTraining;
    education.otherTrainingExplain = educationForm.otherTrainingExplain;
    education.knowledgeOfSafetyRegulations =
      educationForm.knowledgeOfSafetyRegulations;
    education.knowledgeOfSafetyRegulationsExplain =
      educationForm.knowledgeOfSafetyRegulationsExplain;
    education.driverForCompanyBefore = educationForm.driverForCompanyBefore;
    education.driverForCompanyBeforeExplain =
      educationForm.driverForCompanyBeforeExplain;
    education.unableForJob = educationForm.unableForJob;

    education.isCompleted = true;
 */
    /*    this.apppEntityServices.EducationService.upsert(education).subscribe(
            () => {
                this.notification.success('Education is updated');
            },
            (error: any) => {
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
