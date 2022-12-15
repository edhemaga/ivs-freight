/* eslint-disable no-unused-vars */

import {
    Component,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, Subscription, takeUntil } from 'rxjs';

import {
    anyInputInLineIncorrect,
    isAnyPropertyInObjectFalse,
    isFormValueNotEqual,
    isAnyRadioInArrayUnChecked,
    filterUnceckedRadiosId,
    isAnyValueInArrayFalse,
    isEveryValueInArrayTrue,
} from '../../state/utils/utils';

import {
    convertDateFromBackend,
    convertDateToBackend,
} from 'src/app/core/utils/methods.calculations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { ApplicantActionsService } from '../../state/services/applicant-actions.service';

import { ApplicantQuery } from '../../state/store/applicant.query';
import { ApplicantStore } from '../../state/store/applicant.store';

import {
    ApplicantResponse,
    CreateEducationCommand,
    CreateEducationReviewCommand,
    EducationFeedbackResponse,
} from 'appcoretruckassist/model/models';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { ApplicantQuestion } from '../../state/model/applicant-question.model';
import { ContactModel } from '../../state/model/education.model';

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

    public selectedMode: string = SelectedMode.REVIEW;

    public subscription: Subscription;

    public educationForm: FormGroup;
    public contactForm: FormGroup;

    public formStatus: string = 'INVALID';
    public markFormInvalid: boolean;

    public applicantId: number;

    public stepValues: any;
    public stepHasValues: boolean = false;
    public stepHasReviewValues: boolean = false;

    private specialTrainingRadios: any;
    private otherTrainingRadios: any;
    private knowledgeOfSafetyRegulationsRadios: any;
    private driverForCompanyBeforeRadios: any;
    private unableForJobRadios: any;

    public displayRadioRequiredNoteArray: {
        id: number;
        displayRadioRequiredNote: boolean;
    }[] = [
        { id: 0, displayRadioRequiredNote: false },
        { id: 1, displayRadioRequiredNote: false },
        { id: 2, displayRadioRequiredNote: false },
        { id: 3, displayRadioRequiredNote: false },
        { id: 4, displayRadioRequiredNote: false },
    ];

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
    public displayGradeRequiredNote: boolean = false;

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
            title: 'Do you have full knowledge of the federal moto carrier safety regulations?',
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
            title: 'Is there any reason you might be unable to preform the functions of the job for which you have applied?',
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
    public feedbackValuesToPatch: any;
    public isUpperFormFeedbackValueUpdated: boolean = false;
    public isBottomFormFeedbackValueUpdated: boolean = false;

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

    public trackByIdentity = (index: number, _: any): number => index;

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

        const filteredContactsArray = restOfTheItemsInContactsArray.map(
            (item) => {
                return {
                    id: item.id,
                    reviewId: item.emergencyContactReview?.id,
                    isEditingContact: false,
                    name: item.name,
                    phone: item.phone,
                    relationship: item.relationship,
                    emergencyContactReview: item.emergencyContactReview
                        ? item.emergencyContactReview
                        : null,
                };
            }
        );

        const filteredLastItemInContactsArray = {
            id: lastItemInContactsArray.id,
            reviewId: lastItemInContactsArray.emergencyContactReview?.id,
            isEditingContact: false,
            name: lastItemInContactsArray.name,
            phone: lastItemInContactsArray.phone,
            relationship: lastItemInContactsArray.relationship,
            emergencyContactReview:
                lastItemInContactsArray.emergencyContactReview
                    ? lastItemInContactsArray.emergencyContactReview
                    : null,
        };

        this.lastContactCard = {
            ...filteredLastItemInContactsArray,
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

            const indexOfFirstEmptyObjectInList =
                this.openAnnotationArray.indexOf(firstEmptyObjectInList);

            this.openAnnotationArray[indexOfFirstEmptyObjectInList] = {
                lineIndex: this.openAnnotationArray.indexOf(
                    firstEmptyObjectInList
                ),
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
            driverForCompanyBeforeExplain: from && convertDateFromBackend(from),
            driverForCompanyToExplain: to && convertDateFromBackend(to),
            unableForJob,
            unableForJobExplain: unableForJobDescription,
        });

        setTimeout(() => {
            if (specialTraining) {
                this.specialTrainingRadios[0].checked = true;

                this.inputService.changeValidators(
                    this.educationForm.get('specialTrainingExplain')
                );
            } else {
                this.specialTrainingRadios[1].checked = true;

                this.inputService.changeValidators(
                    this.educationForm.get('specialTrainingExplain'),
                    false
                );
            }

            if (otherTraining) {
                this.otherTrainingRadios[0].checked = true;

                this.inputService.changeValidators(
                    this.educationForm.get('otherTrainingExplain')
                );
            } else {
                this.otherTrainingRadios[1].checked = true;

                this.inputService.changeValidators(
                    this.educationForm.get('otherTrainingExplain'),
                    false
                );
            }

            if (knowledgeOfSafetyRegulations) {
                this.knowledgeOfSafetyRegulationsRadios[0].checked = true;
            } else {
                this.knowledgeOfSafetyRegulationsRadios[1].checked = true;
            }

            if (driverBefore) {
                this.driverForCompanyBeforeRadios[0].checked = true;

                this.inputService.changeValidators(
                    this.educationForm.get('driverForCompanyBeforeExplain')
                );

                this.inputService.changeValidators(
                    this.educationForm.get('driverForCompanyToExplain')
                );
            } else {
                this.driverForCompanyBeforeRadios[1].checked = true;

                this.inputService.changeValidators(
                    this.educationForm.get('driverForCompanyBeforeExplain'),
                    false
                );

                this.inputService.changeValidators(
                    this.educationForm.get('driverForCompanyToExplain'),
                    false
                );
            }

            if (unableForJob) {
                this.unableForJobRadios[0].checked = true;

                this.inputService.changeValidators(
                    this.educationForm.get('unableForJobExplain')
                );
            } else {
                this.unableForJobRadios[1].checked = true;

                this.inputService.changeValidators(
                    this.educationForm.get('unableForJobExplain'),
                    false
                );
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

                this.stepHasReviewValues = true;

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
                        !isOtherTrainingDescriptionValid &&
                        !otherTrainingDescriptionMessage
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
                        (!isFromValid || !isToValid) && !datesMessage
                            ? true
                            : false,
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
                    displayAnnotationTextArea:
                        unableToPreformJobDescriptionMessage ? true : false,
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

            const emergencyContactItemsReview = emergencyContacts.map(
                (item) => item.emergencyContactReview
            );

            if (emergencyContactItemsReview[0]) {
                this.stepHasReviewValues = true;

                emergencyContactItemsReview.pop();

                for (let i = 0; i < emergencyContactItemsReview.length; i++) {
                    const emergencyContactItemReview: any = {
                        ...emergencyContactItemsReview[i],
                    };

                    delete emergencyContactItemReview.isPrimary;

                    let hasIncorrectValue: boolean = Object.values(
                        emergencyContactItemReview
                    ).includes(false);

                    const incorrectMessage =
                        emergencyContactItemReview?.commonMessage;

                    if (
                        hasIncorrectValue === null ||
                        hasIncorrectValue == undefined
                    ) {
                        hasIncorrectValue = false;
                    }

                    this.openAnnotationArray[i + 4] = {
                        ...this.openAnnotationArray[i + 4],
                        lineInputs: [hasIncorrectValue],
                        displayAnnotationButton:
                            hasIncorrectValue && !incorrectMessage
                                ? true
                                : false,
                        displayAnnotationTextArea: incorrectMessage
                            ? true
                            : false,
                    };

                    const inputFieldsArray = JSON.stringify(
                        this.openAnnotationArray
                            .filter(
                                (item, index) =>
                                    index > 3 && Object.keys(item).length !== 0
                            )
                            .map((item) => item.lineInputs)
                    );

                    if (inputFieldsArray.includes('true')) {
                        this.cardsWithIncorrectFields = true;
                    } else {
                        this.cardsWithIncorrectFields = false;
                    }

                    this.contactForm
                        .get(`cardReview${i + 1}`)
                        .patchValue(incorrectMessage ? incorrectMessage : null);
                }
            }
        }

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            if (educationReview) {
                this.stepFeedbackValues = {
                    ...this.stepFeedbackValues,
                    ...educationReview,
                };
            }

            const contactItemsReview = emergencyContacts.map(
                (item) => item.emergencyContactReview
            );

            this.stepFeedbackValues = {
                ...this.stepFeedbackValues,
                contactItemsReview: contactItemsReview.map((item, index) => {
                    return {
                        isNameValid: item.isNameValid,
                        isPhoneValid: item.isPhoneValid,
                        isRelationshipValid: item.isRelationshipValid,
                        emergencyContactMessage:
                            index === contactItemsReview.length - 1
                                ? item.emergencyContactMessage
                                : item.commonMessage,
                        hasIncorrectValue: isAnyValueInArrayFalse([
                            item.isNameValid,
                            item.isPhoneValid,
                            item.isRelationshipValid,
                        ]),
                    };
                }),
            };

            const hasIncorrectValue = isAnyPropertyInObjectFalse(
                this.stepFeedbackValues
            );

            if (hasIncorrectValue) {
                this.startUpperFormFeedbackValueChangesMonitoring();
            }

            this.stepValues = stepValues;

            this.feedbackValuesToPatch =
                this.stepFeedbackValues.contactItemsReview[
                    this.stepFeedbackValues?.contactItemsReview.length - 1
                ];
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

        this.displayRadioRequiredNoteArray[
            selectedCheckbox.index
        ].displayRadioRequiredNote = false;
    }

    public onSchoolGradeClick(gradeIndex: number): void {
        if (this.selectedMode !== SelectedMode.APPLICANT) {
            return;
        }

        if (this.displayGradeRequiredNote) {
            this.displayGradeRequiredNote = false;
        }

        this.selectedGrade = gradeIndex;
        this.selectedCollegeGrade = -1;
    }

    public onCollegeGradeClick(gradeIndex: number): void {
        if (this.selectedMode !== SelectedMode.APPLICANT) {
            return;
        }

        if (this.displayGradeRequiredNote) {
            this.displayGradeRequiredNote = false;
        }

        this.selectedCollegeGrade = gradeIndex;

        this.selectedGrade = 11;
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
            this.contactsArray[this.selectedContactIndex].isEditingContact =
                false;

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

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues.contactItemsReview[
                    this.selectedContactIndex
                ];
        }
    }

    public getContactFormValues(event: any): void {
        this.contactsArray = [...this.contactsArray, event];

        if (this.lastContactCard.id) {
            this.contactsArray[this.contactsArray.length - 1].id =
                this.lastContactCard.id;

            this.lastContactCard.id = null;
        } else {
            this.contactsArray[this.contactsArray.length - 1].id = null;
        }

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

    public cancelContactEditing(_: any): void {
        this.isEditing = false;
        this.contactsArray[this.selectedContactIndex].isEditingContact = false;

        this.helperIndex = 2;
        this.selectedContactIndex = -1;

        this.formValuesToPatch = this.previousFormValuesOnEdit;

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues.contactItemsReview[
                    this.stepFeedbackValues.contactItemsReview.length - 1
                ];
        }
    }

    public saveEditedContact(event: any): void {
        this.isEditing = false;
        this.contactsArray[this.selectedContactIndex].isEditingContact = false;

        this.contactsArray[this.selectedContactIndex] = {
            ...this.contactsArray[this.selectedContactIndex],
            ...event,
        };

        this.helperIndex = 2;
        this.selectedContactIndex = -1;

        this.formValuesToPatch = this.previousFormValuesOnEdit;

        if (this.selectedMode === SelectedMode.FEEDBACK) {
            this.feedbackValuesToPatch =
                this.stepFeedbackValues.contactItemsReview[
                    this.stepFeedbackValues.contactItemsReview.length - 1
                ];
        }
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
        this.lastContactCard = {
            ...this.lastContactCard,
            ...event,
        };

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
            if (
                !this.openAnnotationArray[this.selectedContactIndex + 4]
                    .displayAnnotationTextArea
            ) {
                this.openAnnotationArray[
                    this.selectedContactIndex + 4
                ].displayAnnotationButton = true;
            }

            this.openAnnotationArray[
                this.selectedContactIndex + 4
            ].lineInputs[0] = true;

            this.cardsWithIncorrectFields = true;
        } else {
            this.openAnnotationArray[
                this.selectedContactIndex + 4
            ].displayAnnotationButton = false;

            this.hasIncorrectFields = false;
        }

        this.helperIndex = 2;
        this.selectedContactIndex = -1;

        this.previousFormValuesOnReview.emergencyContactReview = {
            ...this.previousFormValuesOnReview.emergencyContactReview,
            emergencyContactMessage: this.lastContactCard.firstRowReview,
        };

        this.formValuesToPatch = this.previousFormValuesOnReview;
    }

    public cancelContactReview(_: any): void {
        this.isReviewingCard = false;

        this.contactsArray[this.selectedContactIndex].isEditingContact = false;

        this.helperIndex = 2;
        this.selectedContactIndex = -1;

        this.previousFormValuesOnReview.emergencyContactReview = {
            ...this.previousFormValuesOnReview.emergencyContactReview,
            emergencyContactMessage: this.lastContactCard.firstRowReview,
        };

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
            selectedInputsLine.lineInputs[inputIndex] = false;

            if (selectedInputsLine.displayAnnotationButton) {
                selectedInputsLine.displayAnnotationButton = false;
            }

            if (selectedInputsLine.displayAnnotationTextArea) {
                selectedInputsLine.displayAnnotationButton = false;
                selectedInputsLine.displayAnnotationTextArea = false;
            }

            this.contactForm.get(`cardReview${lineIndex - 3}`).patchValue(null);

            Object.keys(
                this.contactsArray[lineIndex - 4].emergencyContactReview
            ).forEach((key) => {
                this.contactsArray[lineIndex - 4].emergencyContactReview[key] =
                    true;
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
                        this.educationForm
                            .get('questionReview1')
                            .patchValue(null);
                        break;

                    case 1:
                        this.educationForm
                            .get('questionReview2')
                            .patchValue(null);
                        break;

                    case 2:
                        if (!isAnyInputInLineIncorrect) {
                            this.educationForm
                                .get('questionReview4')
                                .patchValue(null);
                        }
                        break;

                    case 3:
                        this.educationForm
                            .get('questionReview5')
                            .patchValue(null);
                        break;

                    default:
                        break;
                }
            }
        }

        let inputFieldsArray: any = [];

        for (let i = 0; i < this.openAnnotationArray.length; i++) {
            if (i < 4) {
                inputFieldsArray = [
                    ...inputFieldsArray,
                    this.openAnnotationArray[i],
                ];
            }
        }

        inputFieldsArray = JSON.stringify(
            inputFieldsArray.map((item) => item.lineInputs)
        );

        if (inputFieldsArray.includes('true')) {
            this.questionsHaveIncorrectFields = true;
        } else {
            this.questionsHaveIncorrectFields = false;
        }
    }

    public getAnnotationBtnClickValue(event: any): void {
        if (event.type === 'open') {
            this.openAnnotationArray[event.lineIndex].displayAnnotationButton =
                false;
            this.openAnnotationArray[
                event.lineIndex
            ].displayAnnotationTextArea = true;
        } else {
            this.openAnnotationArray[event.lineIndex].displayAnnotationButton =
                true;
            this.openAnnotationArray[
                event.lineIndex
            ].displayAnnotationTextArea = false;
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

            const hasIncorrectValues = Object.keys(
                filteredIncorrectValues
            ).length;

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
                                .filter((item) =>
                                    item.toLowerCase().includes(keyName)
                                )
                                .pop();

                            o[keyName] = this.stepValues[match];

                            if (keyName === 'from') {
                                o['from'] = convertDateFromBackend(o['from']);
                            }

                            if (keyName === 'to') {
                                o['to'] = convertDateFromBackend(o['to']);
                            }

                            if (keyName === 'unabletopreformjobdescription') {
                                o['unabletopreformjobdescription'] =
                                    this.stepValues.unableForJobDescription;
                            }

                            return o;
                        }, {});

                        const filteredUpdatedFieldsWithIncorrectValues =
                            Object.keys(
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
                                    o['from'] =
                                        updatedFormValues.driverForCompanyBeforeExplain;
                                }

                                if (keyName === 'to') {
                                    o['to'] =
                                        updatedFormValues.driverForCompanyToExplain;
                                }

                                if (
                                    keyName === 'unabletopreformjobdescription'
                                ) {
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
            } else {
                this.isUpperFormFeedbackValueUpdated = true;
            }
        }
    }

    public startBottomFormFeedbackValueChangesMonitoring(): void {
        if (this.stepFeedbackValues) {
            let incorrectValuesArray = [];

            for (
                let i = 0;
                i < this.stepFeedbackValues.contactItemsReview.length;
                i++
            ) {
                const filteredContactIncorrectValues = Object.keys(
                    this.stepFeedbackValues?.contactItemsReview[i]
                )
                    .filter((item) => item !== 'hasIncorrectValue')
                    .reduce((o, key) => {
                        this.stepFeedbackValues.contactItemsReview[i][key] ===
                            false &&
                            (o[key] =
                                this.stepFeedbackValues?.contactItemsReview[i][
                                    key
                                ]);

                        return o;
                    }, {});

                const hasIncorrectValues = Object.keys(
                    filteredContactIncorrectValues
                ).length;

                if (hasIncorrectValues) {
                    const filteredFieldsWithIncorrectValues = Object.keys(
                        filteredContactIncorrectValues
                    ).reduce((o, key) => {
                        const keyName = key
                            .replace('Valid', '')
                            .replace('is', '')
                            .trim()
                            .toLowerCase();

                        const match = Object.keys(
                            this.stepValues.emergencyContacts[i]
                        )
                            .filter((item) =>
                                item.toLowerCase().includes(keyName)
                            )
                            .pop();

                        o[keyName] =
                            this.stepValues.emergencyContacts[i][match];

                        return o;
                    }, {});

                    const filteredUpdatedFieldsWithIncorrectValues =
                        Object.keys(filteredFieldsWithIncorrectValues).reduce(
                            (o, key) => {
                                const keyName = key;

                                const match = Object.keys(
                                    this.stepValues.emergencyContacts[i]
                                )
                                    .filter((item) =>
                                        item.toLowerCase().includes(keyName)
                                    )
                                    .pop();

                                o[keyName] =
                                    i ===
                                    this.stepFeedbackValues.contactItemsReview
                                        .length -
                                        1
                                        ? this.lastContactCard[match]
                                        : this.contactsArray[i][match];

                                return o;
                            },
                            {}
                        );

                    const isFormNotEqual = isFormValueNotEqual(
                        filteredFieldsWithIncorrectValues,
                        filteredUpdatedFieldsWithIncorrectValues
                    );

                    incorrectValuesArray = [
                        ...incorrectValuesArray,
                        isFormNotEqual,
                    ];
                }
            }

            const isCardsValueUpdated =
                isEveryValueInArrayTrue(incorrectValuesArray);

            if (isCardsValueUpdated) {
                this.isBottomFormFeedbackValueUpdated = true;
            } else {
                this.isBottomFormFeedbackValueUpdated = false;
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

        const {
            specialTraining,
            specialTrainingExplain,
            otherTraining,
            otherTrainingExplain,
            knowledgeOfSafetyRegulations,
            driverForCompany,
            driverForCompanyBeforeExplain,
            driverForCompanyToExplain,
            unableForJob,
            unableForJobExplain,
        } = this.educationForm.value;

        const radioButtons = [
            { id: 0, isChecked: specialTraining },
            { id: 1, isChecked: otherTraining },
            {
                id: 2,
                isChecked: knowledgeOfSafetyRegulations,
            },
            { id: 3, isChecked: driverForCompany },
            { id: 4, isChecked: unableForJob },
        ];

        const isAnyRadioUnchecked = isAnyRadioInArrayUnChecked(radioButtons);

        if (
            this.educationForm.invalid ||
            this.formStatus === 'INVALID' ||
            !this.selectedGrade ||
            isAnyRadioUnchecked ||
            this.isEditing
        ) {
            if (this.educationForm.invalid) {
                this.inputService.markInvalid(this.educationForm);
            }

            if (this.formStatus === 'INVALID') {
                this.markFormInvalid = true;
            }

            if (this.selectedGrade < 0) {
                this.displayGradeRequiredNote = true;
            }

            if (isAnyRadioUnchecked) {
                const uncheckedRadios = filterUnceckedRadiosId(radioButtons);

                this.displayRadioRequiredNoteArray =
                    this.displayRadioRequiredNoteArray.map((item, index) => {
                        if (
                            uncheckedRadios.some(
                                (someItem) => someItem === index
                            )
                        ) {
                            return {
                                ...item,
                                displayRadioRequiredNote: true,
                            };
                        }

                        return item;
                    });
            }

            return;
        }

        const filteredContactsArray = this.contactsArray.map((item) => {
            return {
                ...((this.stepHasValues ||
                    this.selectedMode === SelectedMode.FEEDBACK) && {
                    id: item.id ? item.id : null,
                    emergencyContactReview: item.emergencyContactReview
                        ? {
                              ...item.emergencyContactReview,
                              emergencyContactId: item.id ? item.id : null,
                          }
                        : null,
                }),
                name: item.name,
                phone: item.phone,
                relationship: item.relationship,
            };
        });

        const filteredLastContactCard = {
            ...((this.stepHasValues ||
                this.selectedMode === SelectedMode.FEEDBACK) && {
                id: this.lastContactCard.id ? this.lastContactCard.id : null,
                emergencyContactReview: this.lastContactCard
                    .emergencyContactReview
                    ? {
                          ...this.lastContactCard.emergencyContactReview,
                          emergencyContactId: this.lastContactCard.id
                              ? this.lastContactCard.id
                              : null,
                      }
                    : null,
            }),
            name: this.lastContactCard.name,
            phone: this.lastContactCard.phone,
            relationship: this.lastContactCard.relationship,
        };

        const saveData: CreateEducationCommand = {
            applicantId: this.applicantId,
            highestGrade: this.selectedGrade > -1 ? this.selectedGrade + 1 : -1,
            collegeGrade:
                this.selectedCollegeGrade > -1
                    ? this.selectedCollegeGrade + 1
                    : -1,
            specialTraining,
            specialTrainingDescription: specialTrainingExplain,
            otherTraining,
            otherTrainingDescription: otherTrainingExplain,
            knowledgeOfSafetyRegulations,
            driverBefore: driverForCompany,
            from: driverForCompany
                ? convertDateToBackend(driverForCompanyBeforeExplain)
                : null,
            to: driverForCompany
                ? convertDateToBackend(driverForCompanyToExplain)
                : null,
            unableForJob,
            unableForJobDescription: unableForJobExplain,
            emergencyContacts: [
                ...filteredContactsArray,
                filteredLastContactCard,
            ],
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.APPLICANT &&
                !this.stepHasValues
            ) {
                return this.applicantActionsService.createEducation(saveData);
            }

            if (
                (this.selectedMode === SelectedMode.APPLICANT &&
                    this.stepHasValues) ||
                this.selectedMode === SelectedMode.FEEDBACK
            ) {
                return this.applicantActionsService.updateEducation(saveData);
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/7`,
                    ]);

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
                                    otherTrainingDescription:
                                        saveData.otherTrainingDescription,
                                    knowledgeOfSafetyRegulations:
                                        saveData.knowledgeOfSafetyRegulations,
                                    driverBefore: saveData.driverBefore,
                                    from: saveData.from,
                                    to: saveData.to,
                                    unableForJob: saveData.unableForJob,
                                    unableForJobDescription:
                                        saveData.unableForJobDescription,
                                    emergencyContacts:
                                        saveData.emergencyContacts,
                                },
                            },
                        };
                    });

                    if (this.selectedMode === SelectedMode.FEEDBACK) {
                        if (this.subscription) {
                            this.subscription.unsubscribe();
                        }
                    }
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

        const contactsArrayReview = this.contactsArray.map((item, index) => {
            const itemReview = item.emergencyContactReview;

            return {
                ...(this.stepHasReviewValues && {
                    id: item.reviewId,
                }),
                emergencyContactId: item.id,
                isPrimary: false,
                commonMessage: this.contactForm.get(`cardReview${index + 1}`)
                    .value,
                isNameValid: itemReview ? itemReview.isNameValid : true,
                isPhoneValid: itemReview ? itemReview.isPhoneValid : true,
                isRelationshipValid: itemReview
                    ? itemReview.isRelationshipValid
                    : true,
                emergencyContactMessage: null,
            };
        });

        const lastItemReview =
            this.previousFormValuesOnReview.emergencyContactReview;

        const lastItemReviewId = this.previousFormValuesOnReview.reviewId;
        const lastItemId = this.previousFormValuesOnReview.id;

        const lastReviewedItemInContactsArray = {
            ...(this.stepHasReviewValues && {
                id: lastItemReviewId,
            }),
            emergencyContactId: lastItemId,
            isPrimary: true,
            commonMessage: null,
            isNameValid: lastItemReview.isNameValid ?? true,
            isPhoneValid: lastItemReview.isPhoneValid ?? true,
            isRelationshipValid: lastItemReview.isRelationshipValid ?? true,
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
            emergencyContactReviews: [
                ...contactsArrayReview,
                lastReviewedItemInContactsArray,
            ],
        };

        const selectMatchingBackendMethod = () => {
            if (
                this.selectedMode === SelectedMode.REVIEW &&
                !this.stepHasReviewValues
            ) {
                return this.applicantActionsService.createEducationReview(
                    saveData
                );
            }

            if (
                this.selectedMode === SelectedMode.REVIEW &&
                this.stepHasReviewValues
            ) {
                return this.applicantActionsService.updateEducationReview(
                    saveData
                );
            }
        };

        selectMatchingBackendMethod()
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate([
                        `/application/${this.applicantId}/7`,
                    ]);

                    const { emergencyContactReviews, ...stepValuesReview } =
                        saveData;

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicant: {
                                ...store.applicant,
                                education: {
                                    ...store.applicant.education,
                                    educationReview: {
                                        ...store.applicant.education
                                            .educationReview,
                                        ...stepValuesReview,
                                    },
                                    emergencyContacts:
                                        store.applicant.education.emergencyContacts.map(
                                            (item, index) => {
                                                if (
                                                    index ===
                                                    store.applicant.education
                                                        .emergencyContacts
                                                        .length -
                                                        1
                                                ) {
                                                    return {
                                                        ...item,
                                                        emergencyContactReview:
                                                            {
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

                                                return {
                                                    ...item,
                                                    emergencyContactReview: {
                                                        ...item.emergencyContactReview,
                                                        ...contactsArrayReview[
                                                            index
                                                        ],
                                                    },
                                                };
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
