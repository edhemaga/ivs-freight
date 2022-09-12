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

import { phoneFaxRegex } from '../../../shared/ta-input/ta-input.regex-validations';

import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';
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
  @Input() isEditing: boolean;
  @Input() formValuesToPatch?: any;
  @Input() markFormInvalid?: boolean;

  @Output() formValuesEmitter = new EventEmitter<any>();
  @Output() cancelFormEditingEmitter = new EventEmitter<any>();
  @Output() saveFormEditingEmitter = new EventEmitter<any>();
  @Output() formStatusEmitter = new EventEmitter<any>();
  @Output() markInvalidEmitter = new EventEmitter<any>();
  @Output() lastFormValuesEmitter = new EventEmitter<any>();

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
    {
      lineIndex: 15,
      lineInputs: [false, false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
  ];

  constructor(
    private formBuilder: FormBuilder,
    private inputService: TaInputService,
    private inputResetService: TaInputResetService
  ) {}

  ngOnInit(): void {
    this.createForm();

    if (this.formValuesToPatch) {
      this.patchForm();

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
            newFormValues.relationship =
              newFormValues.relationship.toUpperCase();
          }

          if (isFormValueEqual(previousFormValues, newFormValues)) {
            this.isContactEdited = false;
          } else {
            this.isContactEdited = true;
          }
        });
    }
  }

  ngAfterViewInit(): void {
    this.contactForm.statusChanges.subscribe((res) => {
      this.formStatusEmitter.emit(res);
    });

    this.contactForm.valueChanges.subscribe((res) => {
      this.lastFormValuesEmitter.emit(res);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.markFormInvalid?.currentValue) {
      this.inputService.markInvalid(this.contactForm);

      this.markInvalidEmitter.emit(false);
    }
  }

  private createForm(): void {
    this.contactForm = this.formBuilder.group({
      name: [null, Validators.required],
      phone: [null, [Validators.required, phoneFaxRegex]],
      relationship: [null, Validators.required],

      firstRowReview: [null],
    });
  }

  public patchForm(): void {
    this.contactForm.patchValue({
      name: this.formValuesToPatch.name,
      phone: this.formValuesToPatch.phone,
      relationship: this.formValuesToPatch.relationship,
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

    this.contactForm.reset();

    this.inputResetService.resetInputSubject.next(true);
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

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }

  public onCancelEditContact(): void {
    this.cancelFormEditingEmitter.emit(1);

    this.isContactEdited = false;

    this.contactForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
