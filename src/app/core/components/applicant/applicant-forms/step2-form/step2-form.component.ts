import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { Subscription } from 'rxjs';

import {
  anyInputInLineIncorrect,
  isFormValueEqual,
} from '../../state/utils/utils';

import {
  emailRegex,
  phoneRegex,
} from '../../../shared/ta-input/ta-input.regex-validations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';

import { ApplicantQuestion } from '../../state/model/applicant-question.model';
import { ReasonForLeaving } from '../../state/model/reason-for-leaving.model';
import { TrailerType } from '../../state/model/trailer-type.model';
import { VehicleType } from '../../state/model/vehicle-type.model';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import {
  AnotherClassOfEquipmentModel,
  WorkHistoryModel,
} from '../../state/model/work-history.model';
import { AddressEntity } from './../../../../../../../appcoretruckassist/model/addressEntity';

@UntilDestroy()
@Component({
  selector: 'app-step2-form',
  templateUrl: './step2-form.component.html',
  styleUrls: ['./step2-form.component.scss'],
})
export class Step2FormComponent implements OnInit, OnDestroy {
  @ViewChildren('cmp') set content(content: QueryList<any>) {
    if (content) {
      const radioButtonsArray = content.toArray();

      this.cfrPartRadios = radioButtonsArray[0]
        ? radioButtonsArray[0].buttons
        : null;
      this.fmcsaRadios = radioButtonsArray[1]
        ? radioButtonsArray[1].buttons
        : null;
    }
  }

  @Input() isEditing: boolean;
  @Input() formValuesToPatch?: any;

  @Output() formValuesEmitter = new EventEmitter<any>();
  @Output() cancelFormEditingEmitter = new EventEmitter<any>();
  @Output() saveFormEditingEmitter = new EventEmitter<any>();

  public selectedMode: string = SelectedMode.APPLICANT;

  public subscription: Subscription;

  public workExperienceForm: FormGroup;

  public anotherClassOfEquipmentArray: AnotherClassOfEquipmentModel[] = [];

  public isEditingClassOfEquipment: boolean = false;
  public isTruckSelected: boolean = false;
  public isWorkExperienceEdited?: boolean;

  public editingCardAddress: any;

  public selectedAddress: AddressEntity;
  public selectedVehicleType: any = null;
  public selectedTrailerType: any = null;
  public selectedTrailerLength: any = null;
  public selectedReasonForLeaving: any = null;
  public selectedClassOfEquipmentIndex: number;

  public vehicleType: VehicleType[] = [];
  public trailerType: TrailerType[] = [];
  public trailerLengthType: any[] = [];

  private cfrPartRadios: any;
  private fmcsaRadios: any;

  public helperIndex: number = 2;

  public reasonsForLeaving: ReasonForLeaving[] = [
    { id: 1, name: 'Better opportunity' },
    { id: 2, name: 'Illness' },
    { id: 3, name: 'Company went out of business' },
    { id: 4, name: 'Fired or terminated' },
    { id: 5, name: 'Family obligations' },
    { id: 6, name: 'Other' },
  ];

  public questions: ApplicantQuestion[] = [
    {
      title: 'CFR Part 40?',
      formControlName: 'cfrPart',
      answerChoices: [
        {
          id: 1,
          label: 'YES',
          value: 'cfrPartYes',
          name: 'cfrPartYes',
          checked: false,
          index: 0,
        },
        {
          id: 2,
          label: 'NO',
          value: 'cfrPartNo',
          name: 'cfrPartNo',
          checked: false,
          index: 0,
        },
      ],
    },
    {
      title: 'FMCSA Regulated',
      formControlName: 'fmCSA',
      answerChoices: [
        {
          id: 3,
          label: 'YES',
          value: 'fmcsaYes',
          name: 'fmcsaYes',
          checked: false,
          index: 1,
        },
        {
          id: 4,
          label: 'NO',
          value: 'fmcsaNo',
          name: 'fmcsaNo',
          checked: false,
          index: 1,
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
      lineIndex: 10,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 11,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 12,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 13,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 14,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 15,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 16,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 17,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 18,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 19,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 20,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 21,
      lineInputs: [false, false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 22,
      lineInputs: [false, false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 23,
      lineInputs: [false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 24,
      lineInputs: [false, false, false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 25,
      lineInputs: [false],
      displayAnnotationButton: false,
      displayAnnotationTextArea: false,
    },
    {
      lineIndex: 26,
      lineInputs: [false],
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

    this.isDriverPosition();

    if (this.formValuesToPatch) {
      this.patchForm();

      this.subscription = this.workExperienceForm.valueChanges.subscribe(
        (updatedFormValues) => {
          const {
            employerAddress,
            applicantId,
            isEditingWorkHistory,
            ...previousFormValues
          } = this.formValuesToPatch;

          previousFormValues.employerAddress = employerAddress.address;

          this.editingCardAddress = employerAddress;

          const {
            firstRowReview,
            secondRowReview,
            thirdRowReview,
            fourthRowReview,
            fifthRowReview,
            sixthRowReview,
            seventhRowReview,
            ...newFormValues
          } = updatedFormValues;

          if (isFormValueEqual(previousFormValues, newFormValues)) {
            this.isWorkExperienceEdited = false;
          } else {
            this.isWorkExperienceEdited = true;
          }
        }
      );
    }
  }
  public trackByIdentity = (index: number, item: any): number => index;

  private createForm(): void {
    this.workExperienceForm = this.formBuilder.group({
      employer: [null, Validators.required],
      jobDescription: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      employerPhone: [null, [Validators.required, phoneRegex]],
      employerEmail: [null, [Validators.required, emailRegex]],
      employerFax: [null, phoneRegex],
      employerAddress: [null, Validators.required],
      employerAddressUnit: [null, Validators.maxLength(6)],
      isDrivingPosition: [false],
      anotherClassOfEquipmentForm: this.formBuilder.group({
        vehicleType: [null],
        trailerType: [null],
        trailerLength: [null],

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
      }),
      vehicleType: [null],
      trailerType: [null],
      trailerLength: [null],
      cfrPart: [null],
      fmCSA: [null],
      reasonForLeaving: [null, Validators.required],
      accountForPeriod: [null],

      firstRowReview: [null],
      secondRowReview: [null],
      thirdRowReview: [null],
      fourthRowReview: [null],
      fifthRowReview: [null],
      sixthRowReview: [null],
      seventhRowReview: [null],
    });
  }

  public patchForm(): void {
    const lastItemInClassOfEquipmentArray =
      this.formValuesToPatch.classesOfEquipment[
        this.formValuesToPatch.classesOfEquipment.length - 1
      ];

    const restOfTheItemsInClassOfEquipmentArray = [
      ...this.formValuesToPatch.classesOfEquipment,
    ];

    restOfTheItemsInClassOfEquipmentArray.pop();

    this.anotherClassOfEquipmentArray = [
      ...restOfTheItemsInClassOfEquipmentArray,
    ];

    this.workExperienceForm.patchValue({
      employer: this.formValuesToPatch.employer,
      jobDescription: this.formValuesToPatch.jobDescription,
      fromDate: this.formValuesToPatch.fromDate,
      toDate: this.formValuesToPatch.toDate,
      employerPhone: this.formValuesToPatch.employerPhone,
      employerEmail: this.formValuesToPatch.employerEmail,
      employerFax: this.formValuesToPatch.employerFax,
      employerAddress: this.formValuesToPatch.employerAddress.address,
      employerAddressUnit: this.formValuesToPatch.employerAddressUnit,
      isDrivingPosition: this.formValuesToPatch.isDrivingPosition,
      anotherClassOfEquipmentForm: this.formBuilder.group({
        vehicleType: lastItemInClassOfEquipmentArray.vehicleType,
        trailerType: lastItemInClassOfEquipmentArray.trailerType,
        trailerLength: lastItemInClassOfEquipmentArray.trailerLength,
      }),
      cfrPart: this.formValuesToPatch.cfrPart,
      fmCSA: this.formValuesToPatch.fmCSA,
      reasonForLeaving: this.formValuesToPatch.reasonForLeaving,
      accountForPeriod: this.formValuesToPatch.accountForPeriod,
    });

    if (this.formValuesToPatch.isDrivingPosition) {
      setTimeout(() => {
        const cfrPartValue = this.workExperienceForm.get('cfrPart').value;
        const fmcsaValue = this.workExperienceForm.get('fmCSA').value;

        if (cfrPartValue) {
          this.cfrPartRadios[0].checked = true;
        } else {
          this.cfrPartRadios[1].checked = true;
        }

        if (fmcsaValue) {
          this.fmcsaRadios[0].checked = true;
        } else {
          this.fmcsaRadios[1].checked = true;
        }
      }, 1);
    }
  }

  private isDriverPosition(): void {
    this.workExperienceForm
      .get('isDrivingPosition')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(
            this.workExperienceForm.get('vehicleType'),
            false
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('trailerType'),
            false
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('trailerLength'),
            false
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('cfrPart'),
            false
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('fmCSA'),
            false
          );
        } else {
          this.inputService.changeValidators(
            this.workExperienceForm.get('vehicleType')
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('trailerType')
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('trailerLength')
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('cfrPart')
          );
          this.inputService.changeValidators(
            this.workExperienceForm.get('fmCSA')
          );
        }
      });
  }

  public handleInputSelect(event: any, action: string): void {
    switch (action) {
      case InputSwitchActions.ADDRESS:
        this.selectedAddress = event.address;

        if (!event.valid) {
          this.workExperienceForm
            .get('employerAddress')
            .setErrors({ invalid: true });
        }

        break;
      case InputSwitchActions.TRUCK_TYPE:
        this.selectedVehicleType = event;

        break;
      case InputSwitchActions.TRAILER_TYPE:
        this.selectedTrailerType = event;

        break;
      case InputSwitchActions.TRAILER_LENGTH:
        this.selectedTrailerLength = event;

        break;
      case InputSwitchActions.ANSWER_CHOICE:
        const selectedCheckbox = event.find(
          (radio: { checked: boolean }) => radio.checked
        );

        const selectedFormControlName =
          this.questions[selectedCheckbox.index].formControlName;

        if (selectedCheckbox.label === 'YES') {
          this.workExperienceForm.get(selectedFormControlName).patchValue(true);
        } else {
          this.workExperienceForm
            .get(selectedFormControlName)
            .patchValue(false);
        }

        break;
      case InputSwitchActions.REASON_FOR_LEAVING:
        this.selectedReasonForLeaving = event;

        break;
      default:
        break;
    }
  }

  public onAddSecondOrLastEmployer(): void {
    if (this.workExperienceForm.invalid) {
      this.inputService.markInvalid(this.workExperienceForm);
      return;
    }

    const {
      employerAddress,
      anotherClassOfEquipmentForm,
      firstRowReview,
      secondRowReview,
      thirdRowReview,
      fourthRowReview,
      fifthRowReview,
      sixthRowReview,
      seventhRowReview,
      ...workExperienceForm
    } = this.workExperienceForm.value;

    const saveData: WorkHistoryModel = {
      ...workExperienceForm,
      employerAddress: this.selectedAddress,
      classesOfEquipment: [...this.anotherClassOfEquipmentArray],
      isEditingWorkHistory: false,
    };

    this.formValuesEmitter.emit(saveData);

    this.selectedReasonForLeaving = null;

    this.anotherClassOfEquipmentArray = [];

    this.workExperienceForm.reset();

    this.inputResetService.resetInputSubject.next(true);
  }

  public onCancelEditWorkExperience(): void {
    this.cancelFormEditingEmitter.emit(1);

    this.isWorkExperienceEdited = false;

    this.selectedReasonForLeaving = null;

    this.workExperienceForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.subscription.unsubscribe();
  }

  public onSaveEditedWorkExperience(): void {
    if (this.workExperienceForm.invalid) {
      this.inputService.markInvalid(this.workExperienceForm);
      return;
    }

    if (!this.isWorkExperienceEdited) {
      return;
    }

    const {
      employerAddress,
      firstRowReview,
      secondRowReview,
      thirdRowReview,
      fourthRowReview,
      fifthRowReview,
      sixthRowReview,
      seventhRowReview,
      ...workExperienceForm
    } = this.workExperienceForm.value;

    const saveData: WorkHistoryModel = {
      ...workExperienceForm,
      employerAddress: this.selectedAddress
        ? this.selectedAddress
        : this.editingCardAddress,
      isEditingWorkHistory: false,
    };

    this.saveFormEditingEmitter.emit(saveData);

    this.isWorkExperienceEdited = false;

    this.selectedReasonForLeaving = null;

    this.workExperienceForm.reset();

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

  public onDeleteClassOfEquipment(index: number): void {
    if (this.isEditingClassOfEquipment) {
      return;
    }

    this.anotherClassOfEquipmentArray.splice(index, 1);
  }

  public onEditClassOfEquipment(index: number): void {
    if (this.isEditingClassOfEquipment) {
      return;
    }

    this.helperIndex = index;

    this.isEditingClassOfEquipment = true;
    this.anotherClassOfEquipmentArray[index].isEditingClassOfEquipment = true;

    this.selectedClassOfEquipmentIndex = index;

    const selectedClassOfEquipment = this.anotherClassOfEquipmentArray[index];

    this.workExperienceForm['controls'].anotherClassOfEquipment.patchValue({
      vehicleType: selectedClassOfEquipment.vehicleType,
      trailerType: selectedClassOfEquipment.trailerType,
      trailerLength: selectedClassOfEquipment.trailerLength,
    });
  }

  ngOnDestroy(): void {}
}
