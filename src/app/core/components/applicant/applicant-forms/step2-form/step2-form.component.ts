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

import { Subscription, Subject, takeUntil } from 'rxjs';

import {
  anyInputInLineIncorrect,
  isFormValueEqual,
} from '../../state/utils/utils';

import {
  addressValidation,
  phoneFaxRegex,
} from '../../../shared/ta-input/ta-input.regex-validations';

import { TaInputService } from '../../../shared/ta-input/ta-input.service';
import { TaInputResetService } from '../../../shared/ta-input/ta-input-reset.service';
import { ApplicantListsService } from '../../state/services/applicant-lists.service';

import { ApplicantQuestion } from '../../state/model/applicant-question.model';
import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { InputSwitchActions } from '../../state/enum/input-switch-actions.enum';
import {
  AnotherClassOfEquipmentModel,
  WorkHistoryModel,
} from '../../state/model/work-history.model';
import { AddressEntity } from './../../../../../../../appcoretruckassist/model/addressEntity';
import {
  EnumValue,
  TrailerLengthResponse,
  TrailerTypeResponse,
  TruckTypeResponse,
} from 'appcoretruckassist/model/models';

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

  private destroy$ = new Subject<void>();

  public selectedMode: string = SelectedMode.APPLICANT;

  public subscription: Subscription;
  public classOfEquipmentSubscription: Subscription;

  public workExperienceForm: FormGroup;
  public classOfEquipmentForm: FormGroup;

  public classOfEquipmentArray: AnotherClassOfEquipmentModel[] = [];
  public helperClassOfEquipmentArray: AnotherClassOfEquipmentModel[] = [];

  public isEditingClassOfEquipment: boolean = false;
  public isTruckSelected: boolean = false;
  public isWorkExperienceEdited: boolean;
  public isClassOfEquipmentEdited: boolean;

  public editingCardAddress: any;
  public previousFormValuesOnEdit: any;
  public previousClassOfEquipmentCardsListOnEdit: any;

  public selectedAddress: AddressEntity;
  public selectedVehicleType: any = null;
  public selectedTrailerType: any = null;
  public selectedTrailerLength: any = null;
  public selectedReasonForLeaving: any = null;

  public selectedClassOfEquipmentIndex: number;
  public helperIndex: number = 2;

  public vehicleType: TruckTypeResponse[] = [];
  public trailerType: TrailerTypeResponse[] = [];
  public trailerLengthType: TrailerLengthResponse[] = [];

  private cfrPartRadios: any;
  private fmcsaRadios: any;

  public reasonsForLeaving: EnumValue[] = [];

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
    private inputResetService: TaInputResetService,
    private applicantListsService: ApplicantListsService
  ) {}

  ngOnInit(): void {
    this.createForm();

    this.isDriverPosition();

    this.getDropdownLists();

    if (this.formValuesToPatch) {
      this.patchForm();

      this.subscription = this.workExperienceForm.valueChanges
        .pipe(takeUntil(this.destroy$))
        .subscribe((updatedFormValues) => {
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
        });
    }
  }
  public trackByIdentity = (index: number, item: any): number => index;

  private createForm(): void {
    this.workExperienceForm = this.formBuilder.group({
      employer: [null, Validators.required],
      jobDescription: [null, Validators.required],
      fromDate: [null, Validators.required],
      toDate: [null, Validators.required],
      employerPhone: [null, [Validators.required, phoneFaxRegex]],
      employerEmail: [null, [Validators.required]],
      employerFax: [null, phoneFaxRegex],
      employerAddress: [null, [Validators.required, ...addressValidation]],
      employerAddressUnit: [null, Validators.maxLength(6)],
      isDrivingPosition: [false],
      classOfEquipmentCards: this.formBuilder.group({
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

    this.classOfEquipmentForm = this.formBuilder.group({
      vehicleType: [null],
      trailerType: [null],
      trailerLength: [null],
    });

    /*   this.inputService.customInputValidator(
      this.workExperienceForm.get('email'),
      'email',
      this.destroy$
    ); */
  }

  public patchForm(): void {
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

      const lastItemInClassOfEquipmentArray =
        this.formValuesToPatch.classesOfEquipment[
          this.formValuesToPatch.classesOfEquipment.length - 1
        ];

      const restOfTheItemsInClassOfEquipmentArray = [
        ...this.formValuesToPatch.classesOfEquipment,
      ];

      restOfTheItemsInClassOfEquipmentArray.pop();

      this.classOfEquipmentArray = [...restOfTheItemsInClassOfEquipmentArray];
      this.helperClassOfEquipmentArray = [
        ...this.formValuesToPatch.classesOfEquipment,
      ];

      this.classOfEquipmentForm.patchValue({
        vehicleType: lastItemInClassOfEquipmentArray.vehicleType,
        trailerType: lastItemInClassOfEquipmentArray.trailerType,
        trailerLength: lastItemInClassOfEquipmentArray.trailerLength,
      });
    }
  }

  private isDriverPosition(): void {
    this.workExperienceForm
      .get('isDrivingPosition')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe((value) => {
        if (!value) {
          this.inputService.changeValidators(
            this.classOfEquipmentForm.get('vehicleType'),
            false
          );
          this.inputService.changeValidators(
            this.classOfEquipmentForm.get('trailerType'),
            false
          );
          this.inputService.changeValidators(
            this.classOfEquipmentForm.get('trailerLength'),
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
            this.classOfEquipmentForm.get('vehicleType')
          );
          this.inputService.changeValidators(
            this.classOfEquipmentForm.get('trailerType')
          );
          this.inputService.changeValidators(
            this.classOfEquipmentForm.get('trailerLength')
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

        if (event.id === 5 || event.id === 8) {
          this.isTruckSelected = false;

          this.selectedTrailerType = null;
          this.selectedTrailerLength = null;

          this.classOfEquipmentForm.patchValue({
            trailerType: null,
            trailerLength: null,
          });
        } else {
          this.isTruckSelected = true;
        }

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
      classOfEquipmentCards,
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
      classesOfEquipment: [...this.classOfEquipmentArray],
      isEditingWorkHistory: false,
    };

    this.formValuesEmitter.emit(saveData);

    this.selectedReasonForLeaving = null;

    this.classOfEquipmentArray = [];

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

    const lastItemInHelperClassOfEquipmentArray =
      this.helperClassOfEquipmentArray[
        this.helperClassOfEquipmentArray.length - 1
      ];
    const classOfEquipmentForm = this.classOfEquipmentForm.value;

    if (
      lastItemInHelperClassOfEquipmentArray.vehicleType !==
        classOfEquipmentForm.vehicleType ||
      lastItemInHelperClassOfEquipmentArray.trailerType !==
        classOfEquipmentForm.trailerType ||
      lastItemInHelperClassOfEquipmentArray.trailerLength !==
        classOfEquipmentForm.trailerLength
    ) {
      this.helperClassOfEquipmentArray[
        this.helperClassOfEquipmentArray.length - 1
      ] = classOfEquipmentForm;
    }

    const {
      employerAddress,
      classOfEquipmentCards,
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
      classesOfEquipment: this.isEditing
        ? [...this.helperClassOfEquipmentArray]
        : [...this.classOfEquipmentArray],
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

  public onAddClassOfEquipment(): void {
    if (this.classOfEquipmentForm.invalid) {
      this.inputService.markInvalid(this.classOfEquipmentForm);
      return;
    }

    const classOfEquipmentForm = this.classOfEquipmentForm.value;

    const saveData = {
      ...classOfEquipmentForm,
      isEditingClassOfEquipment: false,
    };

    if (this.isEditing) {
      this.classOfEquipmentArray = [...this.classOfEquipmentArray, saveData];

      this.helperClassOfEquipmentArray = this.classOfEquipmentArray;
    } else {
      this.classOfEquipmentArray = [...this.classOfEquipmentArray, saveData];
    }

    this.helperIndex = 2;

    this.classOfEquipmentForm.reset();

    this.inputResetService.resetInputSubject.next(true);
  }

  public onDeleteClassOfEquipment(index: number): void {
    if (this.isEditingClassOfEquipment) {
      return;
    }

    this.classOfEquipmentArray.splice(index, 1);
  }

  public onEditClassOfEquipment(index: number): void {
    if (this.isEditingClassOfEquipment) {
      return;
    }

    if (this.isEditing) {
      this.previousFormValuesOnEdit = this.classOfEquipmentForm.value;

      this.previousClassOfEquipmentCardsListOnEdit =
        this.helperClassOfEquipmentArray;
    } else {
      this.previousClassOfEquipmentCardsListOnEdit = this.classOfEquipmentArray;
    }

    this.helperIndex = index;
    this.selectedClassOfEquipmentIndex = index;

    this.isEditingClassOfEquipment = true;
    this.classOfEquipmentArray[index].isEditingClassOfEquipment = true;

    const selectedClassOfEquipment = this.classOfEquipmentArray[index];

    this.classOfEquipmentForm.patchValue({
      vehicleType: selectedClassOfEquipment.vehicleType,
      trailerType: selectedClassOfEquipment.trailerType,
      trailerLength: selectedClassOfEquipment.trailerLength,
    });

    this.classOfEquipmentSubscription =
      this.classOfEquipmentForm.valueChanges.subscribe((updatedFormValues) => {
        const {
          isEditingClassOfEquipment,
          trailerIconSrc,
          vehicleIconSrc,
          ...previousFormValues
        } = selectedClassOfEquipment;

        const {
          cardReview1,
          cardReview2,
          cardReview3,
          cardReview4,
          cardReview5,
          cardReview6,
          cardReview7,
          cardReview8,
          cardReview9,
          cardReview10,
          ...newFormValues
        } = updatedFormValues;

        if (isFormValueEqual(previousFormValues, newFormValues)) {
          this.isClassOfEquipmentEdited = false;
        } else {
          this.isClassOfEquipmentEdited = true;
        }
      });
  }

  public onCancelEditClassOfEquipment(): void {
    this.isEditingClassOfEquipment = false;
    this.classOfEquipmentArray[
      this.selectedClassOfEquipmentIndex
    ].isEditingClassOfEquipment = false;

    this.helperIndex = 2;
    this.selectedClassOfEquipmentIndex = -1;

    this.isClassOfEquipmentEdited = false;

    this.classOfEquipmentArray = this.previousClassOfEquipmentCardsListOnEdit;

    this.classOfEquipmentForm.reset();

    this.inputResetService.resetInputSubject.next(true);

    this.classOfEquipmentSubscription.unsubscribe();

    if (this.isEditing) {
      this.classOfEquipmentForm.patchValue({
        vehicleType: this.previousFormValuesOnEdit.vehicleType,
        trailerType: this.previousFormValuesOnEdit.trailerType,
        trailerLength: this.previousFormValuesOnEdit.trailerLength,
      });
    }
  }

  public onSaveEditedClassOfEquipment(): void {
    if (this.classOfEquipmentForm.invalid) {
      this.inputService.markInvalid(this.classOfEquipmentForm);
      return;
    }

    if (!this.isClassOfEquipmentEdited) {
      return;
    }

    const classOfEquipmentForm = this.classOfEquipmentForm.value;

    const saveData = {
      ...classOfEquipmentForm,
      isEditingClassOfEquipment: false,
    };

    if (this.isEditing) {
      this.helperClassOfEquipmentArray[this.selectedClassOfEquipmentIndex] =
        saveData;
    } else {
      this.classOfEquipmentArray[this.selectedClassOfEquipmentIndex] = saveData;
    }

    this.classOfEquipmentArray[this.selectedClassOfEquipmentIndex] = saveData;

    this.isEditingClassOfEquipment = false;
    this.classOfEquipmentArray[
      this.selectedClassOfEquipmentIndex
    ].isEditingClassOfEquipment = false;

    this.helperIndex = 2;
    this.selectedClassOfEquipmentIndex = -1;

    this.isClassOfEquipmentEdited = false;

    this.classOfEquipmentForm.reset();

    /* this.inputResetService.resetInputSubject.next(true);
     */
    this.classOfEquipmentSubscription.unsubscribe();

    if (this.isEditing) {
      this.classOfEquipmentForm.patchValue({
        vehicleType: this.previousFormValuesOnEdit.vehicleType,
        trailerType: this.previousFormValuesOnEdit.trailerType,
        trailerLength: this.previousFormValuesOnEdit.trailerLength,
      });
    }
  }

  public getDropdownLists(): void {
    this.applicantListsService
      .getDropdownLists()
      .pipe(takeUntil(this.destroy$))
      .subscribe((data) => {
        this.vehicleType = data.truckTypes.map((item) => {
          return {
            ...item,
            folder: 'common',
            subFolder: 'trucks',
          };
        });

        this.trailerType = data.trailerTypes.map((item) => {
          return {
            ...item,
            folder: 'common',
            subfolder: 'trailers',
          };
        });

        this.trailerLengthType = data.trailerLenghts;

        this.reasonsForLeaving = data.reasonsForLeave;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
