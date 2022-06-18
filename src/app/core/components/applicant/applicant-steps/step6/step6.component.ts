import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import { ApplicantQuestion } from '../../state/model/applicant-question.model';
import { Applicant } from '../../state/model/applicant.model';
import { Contact, Education } from '../../state/model/education.model';

@Component({
  selector: 'app-step6',
  templateUrl: './step6.component.html',
  styleUrls: ['./step6.component.scss'],
})
export class Step6Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.APPLICANT;

  public applicant: Applicant | undefined;

  public educationForm: FormGroup;
  public educationInfo: Education | undefined;
  public contactForm: FormGroup;
  public contactsFormArray: Contact[] | undefined = [];

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
          label: 'Yes',
          value: 'specialTrainingYes',
          name: 'specialTrainingYes',
          checked: false,
          index: 0,
        },
        {
          id: 2,
          label: 'No',
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
          label: 'Yes',
          value: 'otherTrainingYes',
          name: 'otherTrainingYes',
          checked: false,
          index: 1,
        },
        {
          id: 4,
          label: 'No',
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
          label: 'Yes',
          value: 'knowledgeOfSafetyRegulationsYes',
          name: 'knowledgeOfSafetyRegulationsYes',
          checked: false,
          index: 2,
        },
        {
          id: 6,
          label: 'No',
          value: 'knowledgeOfSafetyRegulationsNo',
          name: 'knowledgeOfSafetyRegulationsNo',
          checked: false,
          index: 2,
        },
      ],
    },
    {
      title: 'Have you been a driver for this company before?',
      formControlName: 'driverForCompanyBefore',
      formControlNameExplain: 'driverForCompanyBeforeExplain',
      answerChoices: [
        {
          id: 7,
          label: 'Yes',
          value: 'driverForCompanyBeforeYes',
          name: 'driverForCompanyBeforeYes',
          checked: false,
          index: 3,
        },
        {
          id: 8,
          label: 'No',
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
          label: 'Yes',
          value: 'unableForJobYes',
          name: 'unableForJobYes',
          checked: false,
          index: 4,
        },
        {
          id: 10,
          label: 'No',
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

  public editContact: number = -1;

  public highlightGrade: number = -1;

  public trackByIdentity = (index: number, item: any): number => index;

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.formInit();

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  private formInit(): void {
    this.educationForm = this.formBuilder.group({
      specialTraining: [null, Validators.required],
      otherTraining: [null, Validators.required],
      knowledgeOfSafetyRegulations: [null, Validators.required],
      specialTrainingExplain: [null, Validators.required],
      otherTrainingExplain: [null, Validators.required],
      knowledgeOfSafetyRegulationsExplain: [null, Validators.required],
      driverForCompanyBefore: [null, Validators.required],
      driverForCompanyBeforeExplain: [null, Validators.required],
      unableForJob: [null, Validators.required],
    });

    this.contactForm = this.formBuilder.group({
      contactName: [null, Validators.required],
      contactPhone: [null, Validators.required],
      contactRelationship: [null, Validators.required],
    });
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.ANSWER_CHOICE:
        const selectedCheckbox = event.find(
          (radio: { checked: boolean }) => radio.checked
        );

        const selectedFormControlName =
          this.questions[selectedCheckbox.index].formControlName;

        this.educationForm
          .get(selectedFormControlName)
          .patchValue(selectedCheckbox.label);

        break;

      default:
        break;
    }
  }

  public onAddContact(): void {
    const contactForm = this.contactForm.value;
    const contact = new Contact();

    contact.contactName = contactForm.contactName;
    contact.contactPhone = contactForm.contactPhone;
    contact.contactRelationship = contactForm.contactRelationship;
    contact.isDeleted = false;

    this.contactsFormArray?.push(contact);

    this.contactForm.reset();
    this.editContact = -1;
  }

  public onUpdateContact(): void {
    if (this.contactsFormArray?.length) {
      const contactForm = this.contactForm.value;
      const contact = new Contact(this.contactsFormArray[this.editContact]);

      contact.contactName = contactForm.contactName;
      contact.contactPhone = contactForm.contactPhone;
      contact.contactRelationship = contactForm.contactRelationship;
      contact.isDeleted = false;

      this.contactsFormArray[this.editContact] = contact;
    }

    this.contactForm.reset();
    this.editContact = -1;
  }

  public onEditContact(index: number): void {
    if (this.contactsFormArray?.length && this.contactsFormArray[index]) {
      this.contactForm.patchValue({
        contactName: this.contactsFormArray[index].contactName,
        contactPhone: this.contactsFormArray[index].contactPhone,
        contactRelationship: this.contactsFormArray[index].contactRelationship,
      });
    }

    this.editContact = index;
  }

  public onDeleteContact(index: number): void {
    if (this.contactsFormArray?.length && this.contactsFormArray[index]) {
      if (this.contactsFormArray[index].id) {
        this.contactsFormArray[index].isDeleted = true;
      } else {
        this.contactsFormArray.splice(index, 1);
      }
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

    this.contactsFormArray = this.educationInfo?.contacts;

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

    const educationForm = this.educationForm.value;
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
