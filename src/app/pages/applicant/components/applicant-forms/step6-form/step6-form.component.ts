/* eslint-disable no-unused-vars */

import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
} from '@angular/core';
import {
    FormsModule,
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';
import { CommonModule } from '@angular/common';

import {
    distinctUntilChanged,
    Subject,
    Subscription,
    takeUntil,
    throttleTime,
} from 'rxjs';

// helpers
import {
    anyInputInLineIncorrect,
    isFormValueEqual,
} from '@pages/applicant/utils/helpers/applicant.helper';

// validations
import {
    phoneFaxRegex,
    name2_24Validation,
} from '@shared/components/ta-input/validators/ta-input.regex-validations';

// sevices
import { FormService } from '@shared/services/form.service';
import { TaInputService } from '@shared/services/ta-input.service';

// enums
import { SelectedMode } from '@pages/applicant/enums/selected-mode.enum';

// models
import { Contact } from '@pages/applicant/pages/applicant-application/models/contact.model';

// modules
import { SharedModule } from '@shared/shared.module';
import { AngularSvgIconModule } from 'angular-svg-icon';

// components
import { TaAppTooltipV2Component } from '@shared/components/ta-app-tooltip-v2/ta-app-tooltip-v2.component';
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { ApplicantAddSaveBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-add-save-btn/applicant-add-save-btn.component';
import { ApplicantDeleteBtnComponent } from '@pages/applicant/components/applicant-buttons/applicant-delete-btn/applicant-delete-btn.component';


@Component({
    selector: 'app-step6-form',
    templateUrl: './step6-form.component.html',
    styleUrls: ['./step6-form.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        AngularSvgIconModule,
        SharedModule,

        // components
        TaInputComponent,
        TaAppTooltipV2Component,
        ApplicantAddSaveBtnComponent,
        ApplicantDeleteBtnComponent
    ],
})
export class Step6FormComponent
    implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
    @Input() mode: string;
    @Input() isEditing: boolean;
    @Input() formValuesToPatch?: any;
    @Input() markFormInvalid?: boolean;
    @Input() isReviewingCard: boolean;
    @Input() stepFeedbackValues?: any;
    @Input() contactsLength?: number;

    @Output() formValuesEmitter = new EventEmitter<any>();
    @Output() cancelFormEditingEmitter = new EventEmitter<any>();
    @Output() saveFormEditingEmitter = new EventEmitter<any>();
    @Output() formStatusEmitter = new EventEmitter<any>();
    @Output() markInvalidEmitter = new EventEmitter<any>();
    @Output() lastFormValuesEmitter = new EventEmitter<any>();
    @Output() hasIncorrectFieldsEmitter = new EventEmitter<any>();
    @Output() openAnnotationArrayValuesEmitter = new EventEmitter<any>();
    @Output() cancelFormReviewingEmitter = new EventEmitter<any>();
    @Output() cardOpenAnnotationArrayValuesEmitter = new EventEmitter<any>();

    private destroy$ = new Subject<void>();

    public selectedMode: string = SelectedMode.APPLICANT;

    public subscription: Subscription;

    public contactForm: UntypedFormGroup;

    public isContactEdited: boolean;

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
        {},
        {},
        {},
        {},
        {},
        {
            lineIndex: 15,
            lineInputs: [false, false, false],
            displayAnnotationButton: false,
            displayAnnotationTextArea: false,
        },
    ];
    public isCardReviewedIncorrect: boolean = false;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private formService: FormService
    ) {}

    ngOnInit(): void {
        this.createForm();
    }

    ngAfterViewInit(): void {
        if (
            this.selectedMode === SelectedMode.APPLICANT ||
            this.selectedMode === SelectedMode.FEEDBACK
        ) {
            this.contactForm.statusChanges
                .pipe(takeUntil(this.destroy$))
                .subscribe((res) => {
                    this.formStatusEmitter.emit(res);
                });

            this.contactForm.valueChanges
                .pipe(
                    distinctUntilChanged(),
                    throttleTime(2),
                    takeUntil(this.destroy$)
                )
                .subscribe((res) => {
                    this.lastFormValuesEmitter.emit(res);
                });
        }

        if (this.selectedMode === SelectedMode.REVIEW) {
            this.contactForm.valueChanges
                .pipe(
                    distinctUntilChanged(),
                    throttleTime(2),
                    takeUntil(this.destroy$)
                )
                .subscribe((res) => {
                    const reviewMessages = {
                        firstRowReview: res.firstRowReview,
                    };

                    this.lastFormValuesEmitter.emit(reviewMessages);
                });
        }
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.mode?.previousValue !== changes.mode?.currentValue) {
            this.selectedMode = changes.mode?.currentValue;
        }

        if (this.selectedMode === SelectedMode.APPLICANT) {
            if (
                changes.markFormInvalid?.previousValue !==
                changes.markFormInvalid?.currentValue
            ) {
                this.inputService.markInvalid(this.contactForm);
                this.markInvalidEmitter.emit(false);
            }
        }

        if (
            changes.formValuesToPatch?.previousValue !==
            changes.formValuesToPatch?.currentValue
        ) {
            setTimeout(() => {
                this.patchForm(changes.formValuesToPatch.currentValue);

                if (
                    this.selectedMode === SelectedMode.APPLICANT ||
                    this.selectedMode === SelectedMode.FEEDBACK
                ) {
                    this.startValueChangesMonitoring();
                }
            }, 50);
        }
    }

    private createForm(): void {
        this.contactForm = this.formBuilder.group({
            name: [null, [Validators.required, ...name2_24Validation]],
            phone: [null, [Validators.required, phoneFaxRegex]],
            relationship: [null, [Validators.required, ...name2_24Validation]],

            firstRowReview: [null],
        });
    }

    public patchForm(formValue: any): void {
        if (this.selectedMode === SelectedMode.REVIEW) {
            if (
                formValue.emergencyContactReview &&
                Object.keys(formValue.emergencyContactReview).length > 1
            ) {
                const {
                    isNameValid,
                    isPhoneValid,
                    isRelationshipValid,
                    emergencyContactMessage,
                } = formValue.emergencyContactReview;

                this.openAnnotationArray[15] = {
                    ...this.openAnnotationArray[15],
                    lineInputs: [
                        !isNameValid,
                        !isPhoneValid,
                        !isRelationshipValid,
                    ],
                    displayAnnotationButton:
                        (!isNameValid ||
                            !isPhoneValid ||
                            !isRelationshipValid) &&
                        !emergencyContactMessage
                            ? true
                            : false,
                    displayAnnotationTextArea: emergencyContactMessage
                        ? true
                        : false,
                };

                const inputFieldsArray = JSON.stringify(
                    this.openAnnotationArray
                        .filter((item) => Object.keys(item).length !== 0)
                        .map((item) => item.lineInputs)
                );

                if (inputFieldsArray.includes('true')) {
                    this.hasIncorrectFieldsEmitter.emit(true);

                    this.isCardReviewedIncorrect = true;
                } else {
                    this.hasIncorrectFieldsEmitter.emit(false);

                    this.isCardReviewedIncorrect = false;
                }

                this.contactForm.patchValue({
                    firstRowReview: emergencyContactMessage,
                });
            }
        }

        this.contactForm.patchValue({
            name: formValue.name,
            phone: formValue.phone,
            relationship: formValue.relationship,
        });
    }

    public startValueChangesMonitoring() {
        this.subscription = this.contactForm.valueChanges
            .pipe(
                distinctUntilChanged(),
                throttleTime(2),
                takeUntil(this.destroy$)
            )
            .subscribe((updatedFormValues) => {
                const {
                    id,
                    reviewId,
                    emergencyContactReview,
                    ...previousFormValues
                } = this.formValuesToPatch;

                const { firstRowReview, ...newFormValues } = updatedFormValues;

                previousFormValues.name =
                    previousFormValues.name?.toUpperCase();
                previousFormValues.relationship =
                    previousFormValues.relationship?.toUpperCase();

                if (newFormValues.name) {
                    newFormValues.name = newFormValues.name?.toUpperCase();
                }

                if (newFormValues.relationship) {
                    newFormValues.relationship =
                        newFormValues.relationship?.toUpperCase();
                }

                if (isFormValueEqual(previousFormValues, newFormValues)) {
                    this.isContactEdited = false;
                } else {
                    this.isContactEdited = true;
                }
            });
    }

    public onAddContact(): void {
        if (this.contactForm.invalid) {
            this.inputService.markInvalid(this.contactForm);
            return;
        }

        const { firstRowReview, ...contactForm } = this.contactForm.value;

        const saveData: Contact = {
            ...contactForm,
        };

        this.formValuesEmitter.emit(saveData);

        this.formService.resetForm(this.contactForm);
    }

    public onSaveEditedContact(): void {
        if (this.contactForm.invalid) {
            this.inputService.markInvalid(this.contactForm);
            return;
        }

        if (!this.isContactEdited) {
            return;
        }

        const { firstRowReview, ...contactForm } = this.contactForm.value;

        const saveData: Contact = {
            ...contactForm,
        };

        this.saveFormEditingEmitter.emit(saveData);

        this.isContactEdited = false;

        this.formService.resetForm(this.contactForm);

        this.subscription.unsubscribe();
    }

    public onCancelEditContact(): void {
        this.cancelFormEditingEmitter.emit(1);

        this.isContactEdited = false;

        this.formService.resetForm(this.contactForm);

        this.subscription.unsubscribe();
    }

    public onGetBtnClickValue(event: any): void {
        if (event.notDisabledClick) {
            this.onAddContact();
        }

        if (event.cancelClick) {
            this.onCancelEditContact();
        }

        if (event.saveClick) {
            this.onSaveEditedContact();
        }

        if (event.reviewCancelClick) {
            this.onCancelReviewContact();
        }

        if (event.reviewSaveClick) {
            this.onAddAnnotation();
        }
    }

    public incorrectInput(
        event: any,
        inputIndex: number,
        lineIndex: number
    ): void {
        const selectedInputsLine = this.openAnnotationArray.find(
            (item) => item.lineIndex === lineIndex
        );

        if (this.isReviewingCard) {
            if (event) {
                selectedInputsLine.lineInputs[inputIndex] = true;
            }

            if (!event) {
                selectedInputsLine.lineInputs[inputIndex] = false;
            }

            const inputFieldsArray = JSON.stringify(
                this.openAnnotationArray
                    .filter((item) => Object.keys(item).length !== 0)
                    .map((item) => item.lineInputs)
            );

            if (inputFieldsArray.includes('true')) {
                this.isCardReviewedIncorrect = true;
            } else {
                this.isCardReviewedIncorrect = false;
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
                    case 15:
                        if (!isAnyInputInLineIncorrect) {
                            this.contactForm
                                .get('firstRowReview')
                                .patchValue(null);
                        }

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
            this.hasIncorrectFieldsEmitter.emit(true);
        } else {
            this.hasIncorrectFieldsEmitter.emit(false);
        }

        const filteredOpenAnnotationArray = this.openAnnotationArray.filter(
            (item) => Object.keys(item).length !== 0
        );

        this.openAnnotationArrayValuesEmitter.emit(filteredOpenAnnotationArray);
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

    public onCancelReviewContact(): void {
        this.cancelFormReviewingEmitter.emit(1);

        this.isCardReviewedIncorrect = false;
    }

    public onAddAnnotation(): void {
        if (!this.isCardReviewedIncorrect) {
            return;
        }

        const filteredOpenAnnotationArray = this.openAnnotationArray.filter(
            (item) => Object.keys(item).length !== 0
        );

        this.cardOpenAnnotationArrayValuesEmitter.emit(
            filteredOpenAnnotationArray
        );

        this.isCardReviewedIncorrect = false;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
