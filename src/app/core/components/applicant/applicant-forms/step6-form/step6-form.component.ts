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
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Subject, Subscription, takeUntil } from 'rxjs';

import {
  anyInputInLineIncorrect,
  isFormValueEqual,
} from '../../state/utils/utils';

import {
  phoneFaxRegex,
  name2_24Validation,
} from '../../../shared/ta-input/ta-input.regex-validations';

import { FormService } from './../../../../services/form/form.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';

import { ContactModel } from '../../state/model/education.model';
import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
  selector: 'app-step6-form',
  templateUrl: './step6-form.component.html',
  styleUrls: ['./step6-form.component.scss'],
})
export class Step6FormComponent
  implements OnInit, OnDestroy, OnChanges, AfterViewInit
{
  @Input() mode: string;
  @Input() isEditing: boolean;
  @Input() formValuesToPatch?: any;
  @Input() markFormInvalid?: boolean;
  @Input() isReviewingCard: boolean;

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

  public contactForm: FormGroup;

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
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private formService: FormService
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  ngAfterViewInit(): void {
    if (this.selectedMode === SelectedMode.APPLICANT) {
      this.contactForm.statusChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.formStatusEmitter.emit(res);
        });

      this.contactForm.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.lastFormValuesEmitter.emit(res);
        });
    }

    if (this.selectedMode === SelectedMode.REVIEW) {
      this.contactForm.valueChanges
        .pipe(takeUntil(this.destroy$))
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
        this.selectedMode === SelectedMode.REVIEW ||
        this.selectedMode === SelectedMode.APPLICANT
      ) {
        if (
          changes.formValuesToPatch?.previousValue !==
          changes.formValuesToPatch?.currentValue
        ) {
          setTimeout(() => {
            this.patchForm(changes.formValuesToPatch.currentValue);

            if (this.selectedMode === SelectedMode.APPLICANT) {
              this.startValueChangesMonitoring();
            }
          }, 100);
        }
      }
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
      if (formValue.emergencyContactReview) {
        const { isNameValid, isPhoneValid, isRelationshipValid } =
          formValue.emergencyContactReview;
        console.log('formValue', formValue.emergencyContactReview);

        this.openAnnotationArray[15] = {
          ...this.openAnnotationArray[15],
          lineInputs: [!isNameValid, !isPhoneValid, !isRelationshipValid],
        };

        console.log('arr', this.openAnnotationArray);
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
      .pipe(takeUntil(this.destroy$))
      .subscribe((updatedFormValues) => {
        const { id, isEditingContact, ...previousFormValues } =
          this.formValuesToPatch;

        const { firstRowReview, ...newFormValues } = updatedFormValues;

        previousFormValues.name = previousFormValues.name.toUpperCase();
        previousFormValues.relationship =
          previousFormValues.relationship.toUpperCase();

        if (newFormValues.name) {
          newFormValues.name = newFormValues.name.toUpperCase();
        }

        if (newFormValues.relationship) {
          newFormValues.relationship = newFormValues.relationship.toUpperCase();
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

    const saveData: ContactModel = {
      ...contactForm,
      isEditingContact: false,
    };

    this.formValuesEmitter.emit(saveData);

    this.formService.resetForm(this.contactForm);

    this.contactForm.reset();
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

    const saveData: ContactModel = {
      ...contactForm,
      isEditingContact: false,
    };

    this.saveFormEditingEmitter.emit(saveData);

    this.isContactEdited = false;

    this.contactForm.reset();

    this.subscription.unsubscribe();
  }

  public onCancelEditContact(): void {
    this.cancelFormEditingEmitter.emit(1);

    this.isContactEdited = false;

    this.contactForm.reset();

    this.subscription.unsubscribe();
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
              this.contactForm.get('firstRowReview').patchValue(null);
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
      this.openAnnotationArray[event.lineIndex].displayAnnotationButton = false;
      this.openAnnotationArray[event.lineIndex].displayAnnotationTextArea =
        true;
    } else {
      this.openAnnotationArray[event.lineIndex].displayAnnotationButton = true;
      this.openAnnotationArray[event.lineIndex].displayAnnotationTextArea =
        false;
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

    this.cardOpenAnnotationArrayValuesEmitter.emit(filteredOpenAnnotationArray);

    this.isCardReviewedIncorrect = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
