import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';

import { anyInputInLineIncorrect } from '../../state/utils/utils';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { SelectedMode } from '../../state/enum/selected-mode.enum';
import { Applicant } from '../../state/model/applicant.model';
import {
  WorkHistory,
  WorkHistoryModel,
} from '../../state/model/work-history.model';

@UntilDestroy()
@Component({
  selector: 'app-step2',
  templateUrl: './step2.component.html',
  styleUrls: ['./step2.component.scss'],
})
export class Step2Component implements OnInit, OnDestroy {
  public selectedMode: string = SelectedMode.APPLICANT;

  public applicant: Applicant;

  public workExperienceForm: FormGroup;
  public workExperienceArray: WorkHistoryModel[] = [
    {
      applicantId: '1',
      employer: 'Kvelail',
      jobDescription: 'Developer',
      fromDate: '01/01/01',
      toDate: '02/02/02',
      employerPhone: '(621) 123-4567',
      employerFax: '(621) 123-4567',
      employerEmail: 'aasd@asd.com',
      employerAddress: {
        address: 'Chicago, IL, USA',
        city: 'Chicago',
        country: 'US',
        state: 'IL',
        stateShortName: 'IL',
        street: '',
        streetNumber: '',
        zipCode: '',
      },
      employerAddressUnit: '1',
      isDrivingPosition: true,
      classesOfEquipment: [
        {
          vehicleIconSrc:
            'assets/svg/truckassist-table/truck/ic_truck_semi-truck.svg',
          vehicleType: 'Semi Sleeper',
          trailerIconSrc: 'assets/svg/common/trailers/ic_trailer_dumper.svg',
          trailerType: 'Dumper',
          trailerLength: 1,
          isEditingClassOfEquipment: false,
        },
        {
          vehicleIconSrc:
            'assets/svg/truckassist-table/truck/ic_truck_cargo-van.svg',
          vehicleType: 'Cargo Van',
          trailerIconSrc: null,
          trailerType: null,
          trailerLength: 2,
          isEditingClassOfEquipment: false,
        },
        {
          vehicleIconSrc:
            'assets/svg/truckassist-table/truck/ic_truck_cargo-van.svg',
          vehicleType: 'Cargo Van',
          trailerIconSrc: null,
          trailerType: null,
          trailerLength: 3,
          isEditingClassOfEquipment: false,
        },
      ],
      truckType: null,
      trailerType: null,
      trailerLength: null,
      cfrPart: false,
      fmCSA: false,
      reasonForLeaving: 'Illness',
      accountForPeriod: null,
      isEditingWorkHistory: false,
    },
    {
      applicantId: '1',
      employer: 'Kvelail',
      jobDescription: 'Developer',
      fromDate: '01/01/01',
      toDate: '02/02/02',
      employerPhone: '(621) 123-4567',
      employerFax: '(621) 123-4567',
      employerEmail: 'aasd@asd.com',
      employerAddress: {
        address: 'Chicago, IL, USA',
        city: 'Chicago',
        country: 'US',
        state: 'IL',
        stateShortName: 'IL',
        street: '',
        streetNumber: '',
        zipCode: '',
      },
      employerAddressUnit: '1',
      isDrivingPosition: true,
      classesOfEquipment: [
        {
          vehicleIconSrc:
            'assets/svg/truckassist-table/truck/ic_truck_semi-truck.svg',
          vehicleType: 'Semi Sleeper',
          trailerIconSrc: 'assets/svg/common/trailers/ic_trailer_dumper.svg',
          trailerType: 'Dumper',
          trailerLength: 45,
          isEditingClassOfEquipment: false,
        },
      ],
      truckType: null,
      trailerType: null,
      trailerLength: null,
      cfrPart: null,
      fmCSA: null,
      reasonForLeaving: 'Illness',
      accountForPeriod: null,
      isEditingWorkHistory: false,
    },
    {
      applicantId: '1',
      employer: 'Kvelail',
      jobDescription: 'Developer',
      fromDate: '01/01/01',
      toDate: '02/02/02',
      employerPhone: '(621) 123-4567',
      employerFax: '(621) 123-4567',
      employerEmail: 'aasd@asd.com',
      employerAddress: {
        address: 'Chicago, IL, USA',
        city: 'Chicago',
        country: 'US',
        state: 'IL',
        stateShortName: 'IL',
        street: '',
        streetNumber: '',
        zipCode: '',
      },
      employerAddressUnit: '1',
      isDrivingPosition: true,
      classesOfEquipment: [
        {
          vehicleIconSrc:
            'assets/svg/truckassist-table/truck/ic_truck_semi-truck.svg',
          vehicleType: 'Semi Sleeper',
          trailerIconSrc: 'assets/svg/common/trailers/ic_trailer_dumper.svg',
          trailerType: 'Dumper',
          trailerLength: 33,
          isEditingClassOfEquipment: false,
        },
        {
          vehicleIconSrc:
            'assets/svg/truckassist-table/truck/ic_truck_cargo-van.svg',
          vehicleType: 'Cargo Van',
          trailerIconSrc: null,
          trailerType: null,
          trailerLength: null,
          isEditingClassOfEquipment: false,
        },
      ],
      truckType: null,
      trailerType: null,
      trailerLength: null,
      cfrPart: null,
      fmCSA: null,
      reasonForLeaving: 'Illness',
      accountForPeriod: null,
      isEditingWorkHistory: false,
    },
    {
      applicantId: '1',
      employer: 'Kvelail',
      jobDescription: 'Developer',
      fromDate: '01/01/01',
      toDate: '02/02/02',
      employerPhone: '(621) 123-4567',
      employerFax: '(621) 123-4567',
      employerEmail: 'aasd@asd.com',
      employerAddress: {
        address: 'Chicago, IL, USA',
        city: 'Chicago',
        country: 'US',
        state: 'IL',
        stateShortName: 'IL',
        street: '',
        streetNumber: '',
        zipCode: '',
      },
      employerAddressUnit: '1',
      isDrivingPosition: false,
      classesOfEquipment: [],
      truckType: null,
      trailerType: null,
      trailerLength: null,
      cfrPart: null,
      fmCSA: null,
      reasonForLeaving: 'Illness',
      accountForPeriod: 'Dada',
      isEditingWorkHistory: false,
    },
  ];

  public selectedWorkExperienceIndex: number;

  public isEditing: boolean = false;

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
  ];

  //

  public selectedItemIndex: number = -1;

  /* public workExperienceArray: WorkHistory[]; */

  // public get showAddNew(): boolean {
  //   /* return this.workHistories?.length &&
  //       this.workHistories[this.workHistories?.length - 1]?.id
  //       ? true
  //       : false; */
  //   return true;
  // }

  constructor(private formBuilder: FormBuilder, private router: Router) {}

  ngOnInit(): void {
    this.createForm();
    /*     this.isNoExperience(); */

    const applicantUser = localStorage.getItem('applicant_user');

    if (applicantUser) {
      this.applicant = JSON.parse(applicantUser) as Applicant;
    }
  }

  public trackByIdentity = (index: number, item: any): number => index;

  private createForm(): void {
    this.workExperienceForm = this.formBuilder.group({
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

      noWorkExperience: [false],
    });
  }

  public onDeleteWorkExperience(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.workExperienceArray.splice(index, 1);
  }

  public onEditWorkExperience(index: number): void {
    if (this.isEditing) {
      return;
    }

    this.helperIndex = index;

    this.isEditing = true;
    this.workExperienceArray[index].isEditingWorkHistory = true;

    this.selectedWorkExperienceIndex = index;

    const selectedWorkExperience = this.workExperienceArray[index];

    this.formValuesToPatch = selectedWorkExperience;
  }

  public getWorkExperienceFormValues(event: any): void {
    this.workExperienceArray = [...this.workExperienceArray, event];

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

  public cancelWorkExperienceEditing(event: any): void {
    this.isEditing = false;
    this.workExperienceArray[
      this.selectedWorkExperienceIndex
    ].isEditingWorkHistory = false;

    this.helperIndex = 2;
    this.selectedWorkExperienceIndex = -1;
  }

  public saveEditedWorkExperience(event: any): void {
    this.isEditing = false;
    this.workExperienceArray[
      this.selectedWorkExperienceIndex
    ].isEditingWorkHistory = false;

    this.workExperienceArray[this.selectedWorkExperienceIndex] = event;

    this.helperIndex = 2;
    this.selectedWorkExperienceIndex = -1;
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

  /* private isNoExperience(): void {
    this.workExperienceForm
      .get('noWorkExperience')
      .valueChanges.pipe(untilDestroyed(this))
      .subscribe((value) => {
        if (!value) {
          this.workExperienceArray = this.workExperienceArray?.map((wh) => {
            wh.isDeleted = false;
            wh.isExpanded = false;

            return wh;
          });

          if (!this.workExperienceArray?.length) {
            let workHistory = new WorkHistory(undefined);

            workHistory.isExpanded = true;

            this.workExperienceArray?.push(workHistory);
          }

          this.selectedItemIndex = this.workExperienceArray?.length
            ? this.workExperienceArray.length - 1
            : -1;
        } else {
          this.workExperienceArray = this.workExperienceArray?.map((wh) => {
            wh.isDeleted = true;
            wh.isExpanded = false;

            return wh;
          });
        }
      });
  } */

  /*   public hideForm(): void {
    if (this.workExperienceArray?.length) {
      this.workExperienceArray[this.selectedItemIndex].isExpanded = false;
      this.selectedItemIndex = -1;
    }
  } */

  /* private formFilling(index: number): void {
    this.selectedItemIndex = index;

    if (this.workExperienceArray?.length) {
      this.workExperienceArray?.forEach((wh, key) => {
        wh.isExpanded = key === index ? true : false;
      });

      const workExperience: WorkHistory = new WorkHistory(
        this.workExperienceArray[index]
      );

      this.workExperienceForm = this.formBuilder.group({
        employer: [workExperience.employer, Validators.required],
        jobDescription: [workExperience.jobDescription, Validators.required],
        fromDate: [workExperience.fromDate, Validators.required],
        toDate: [workExperience.toDate, Validators.required],
        phone: [workExperience.employerPhone, Validators.required],
        email: [workExperience.employerEmail, Validators.required],
        address: [workExperience.employerAddress, Validators.required],
        addressUnit: [
          workExperience.employerAddressUnit,
          Validators.maxLength(6),
        ],
        isDrivingPosition: [workExperience.isDrivingPosition],
        truckType: [
          workExperience.truckType && this.truckType.length
            ? this.truckType.find((b) => b.name === workExperience.truckType)
                ?.id
            : null,
          workExperience.isDrivingPosition
            ? Validators.required
            : Validators.nullValidator,
        ],
        trailerType: [
          workExperience.trailerType && this.trailerType.length
            ? this.trailerType.find(
                (b) => b.name === workExperience.trailerType
              )?.id
            : null,
          workExperience.isDrivingPosition
            ? Validators.required
            : Validators.nullValidator,
        ],
        trailerLength: [
          this.trailerLengthType.find(
            (a) => a.value === workExperience.trailerLength
          ),
          workExperience.isDrivingPosition
            ? Validators.required
            : Validators.nullValidator,
        ],
        cfrPart: [
          workExperience.cfrPart,
          workExperience.isDrivingPosition
            ? Validators.required
            : Validators.nullValidator,
        ],
        fmCSA: [
          workExperience.fmCSA,
          workExperience.isDrivingPosition
            ? Validators.required
            : Validators.nullValidator,
        ],
        reasonForLeaving: [
          this.reasonsForLeaving.find(
            (a) => workExperience.reasonForLeaving === a.name
          ),
          Validators.required,
        ],
        accountForPeriod: [workExperience.accountForPeriod],
      });

      this.workExperienceForm.get('noWorkExperience').patchValue(true);
    } else {
      this.workExperienceForm.get('noWorkExperience').patchValue(true);
    }
  } */

  /*  public onSubmitForm(): void {
    this.onAddWorkExperience();
  }
 */
  public goBack(): void {
    this.router.navigateByUrl(`/applicant/${this.applicant.id}/1`);
  }

  public onStepAction(event: any): void {
    if (event.action === 'back-step') {
      this.goBack();
    } /*  else if (event.action === 'next-step') {
            if (this.showAddNew) {
                if (this.workExperienceForm.get('noWorkExperience').value) {
                    if (this.workExperienceArray?.length) {
                        this.workExperienceArray.forEach(element => {
                            element.isDeleted = true;
                            element.applicantId = this.applicant.id;
                            this.apppEntityServices.workHistoryService
                                .upsert(element)
                                .subscribe(
                                    response => {
                                        this.notification.success(
                                            'Work Experience has been deleted!',
                                            'Success'
                                        );
                                    },
                                    error => {
                                        this.shared.handleError(error);
                                    }
                                );
                        });
                    }
                } else {
                    this.router.navigateByUrl(
                        `/applicant/${this.applicant.id}/3`
                    );
                }
            } else {
                this.onAddWorkExperience();
            }
        } */
  }

  ngOnDestroy(): void {}
}
