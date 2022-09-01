import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';

import { Subscription, Subject, takeUntil } from 'rxjs';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import {
  anyInputInLineIncorrect,
  isFormValueEqual,
} from '../../state/utils/utils';

import { phoneRegex } from '../../../shared/ta-input/ta-input.regex-validations';

import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';
import { TaInputService } from '../../../shared/ta-input/ta-input.service';

import { ContactModel } from '../../state/model/education.model';
import { SelectedMode } from '../../state/enum/selected-mode.enum';

@Component({
  selector: 'app-step6-form',
  templateUrl: './step6-form.component.html',
  styleUrls: ['./step6-form.component.scss'],
})
export class Step6FormComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();
  @Input() isEditing: boolean;
  @Input() formValuesToPatch?: any;

  @Output() formValuesEmitter = new EventEmitter<any>();
  @Output() cancelFormEditingEmitter = new EventEmitter<any>();
  @Output() saveFormEditingEmitter = new EventEmitter<any>();

  public selectedMode: string = SelectedMode.FEEDBACK;

  public contactForm: FormGroup;

  public subscription: Subscription;

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

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.createForm();

    if (this.formValuesToPatch) {
      this.patchForm();

      this.subscription = this.contactForm.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((updatedFormValues) => {
          const { isEditingContact, ...previousFormValues } =
            this.formValuesToPatch;

          const { firstRowReview, ...newFormValues } = updatedFormValues;

          if (isFormValueEqual(previousFormValues, newFormValues)) {
            this.isContactEdited = false;
          } else {
            this.isContactEdited = true;
          }
        });
    }
  }

  private createForm(): void {
    this.contactForm = this.formBuilder.group({
      contactName: [null, Validators.required],
      contactPhone: [null, [Validators.required, phoneRegex]],
      contactRelationship: [null, Validators.required],

      firstRowReview: [null],
    });
  }

  public patchForm(): void {
    this.contactForm.patchValue({
      contactName: this.formValuesToPatch.contactName,
      contactPhone: this.formValuesToPatch.contactPhone,
      contactRelationship: this.formValuesToPatch.contactRelationship,
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
}
