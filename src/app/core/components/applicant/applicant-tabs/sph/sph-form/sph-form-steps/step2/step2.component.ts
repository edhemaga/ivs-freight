import {
    AfterContentChecked,
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    OnDestroy,
    OnInit,
    QueryList,
    ViewChildren,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import {
    convertDateToBackend,
    convertDateFromBackend,
} from 'src/app/core/utils/methods.calculations';

import {
    filterUnceckedRadiosId,
    isAnyRadioInArrayUnChecked,
} from 'src/app/core/components/applicant/state/utils/utils';

import { TaInputService } from 'src/app/core/components/shared/ta-input/ta-input.service';
import { ApplicantActionsService } from 'src/app/core/components/applicant/state/services/applicant-actions.service';

import { ApplicantStore } from 'src/app/core/components/applicant/state/store/applicant.store';
import { ApplicantQuery } from 'src/app/core/components/applicant/state/store/applicant.query';

import { ApplicantQuestion } from 'src/app/core/components/applicant/state/model/applicant-question.model';
import { InputSwitchActions } from 'src/app/core/components/applicant/state/enum/input-switch-actions.enum';
import { SphFormAccidentModel } from './../../../../../state/model/accident.model';
import {
    ApplicantModalResponse,
    CreatePreviousEmployerAccidentHistoryCommand,
    EnumValue,
    TrailerTypeResponse,
    TruckTypeResponse,
} from 'appcoretruckassist/model/models';

@Component({
    selector: 'app-step2',
    templateUrl: './step2.component.html',
    styleUrls: ['./step2.component.scss'],
})
export class Step2Component
    implements OnInit, OnDestroy, AfterViewInit, AfterContentChecked
{
    @ViewChildren('cmp') components: QueryList<any>;

    private destroy$ = new Subject<void>();

    public accidentHistoryForm: UntypedFormGroup;

    public formStatus: string = 'INVALID';
    public markFormInvalid: boolean;

    public accidentArray: SphFormAccidentModel[] = [];

    public lastAccidentCard: any;

    public vehicleType: TruckTypeResponse[] = [];
    public trailerType: TrailerTypeResponse[] = [];

    public reasonsForLeaving: EnumValue[] = [];

    public selectedVehicleType: any = null;
    public selectedTrailerType: any = null;
    public selectedReasonForLeaving: any = null;

    public selectedAccidentIndex: number;
    public helperIndex: number = 2;

    public previousEmployerProspectId: number;

    public isEditing: boolean = false;

    public previousFormValuesOnEdit: any;

    public workForCompanyRadios: any;
    public motorVehicleForCompanyRadios: any;
    public consideredForEmploymentAgainRadios: any;

    public formValuesToPatch: any;

    public displayRadioRequiredNoteArray: {
        id: number;
        displayRadioRequiredNote: boolean;
    }[] = [
        { id: 0, displayRadioRequiredNote: false },
        { id: 1, displayRadioRequiredNote: false },
        { id: 2, displayRadioRequiredNote: false },
    ];
    public displayRadioRequiredNote: boolean = false;
    public checkIsHazmatSpillNotChecked: boolean = false;

    public questions: ApplicantQuestion[] = [
        {
            title: 'Did the above applicant work for your company?',
            formControlName: 'applicantWorkForCompany',
            formControlNameExplain: 'applicantWorkForCompanyExplain',
            answerChoices: [
                {
                    id: 1,
                    label: 'YES',
                    value: 'applicantWorkForCompanyYes',
                    name: 'applicantWorkForCompanyYes',
                    checked: false,
                    index: 0,
                },
                {
                    id: 2,
                    label: 'NO',
                    value: 'applicantWorkForCompanyNo',
                    name: 'applicantWorkForCompanyNo',
                    checked: false,
                    index: 0,
                },
            ],
        },
        {
            title: 'Did he/she drive a motor vehicle for your company?',
            formControlName: 'motorVehicleForCompany',
            formControlNameExplain: 'motorVehicleForCompanyExplain',
            answerChoices: [
                {
                    id: 3,
                    label: 'YES',
                    value: 'motorVehicleForCompanyYes',
                    name: 'motorVehicleForCompanyYes',
                    checked: false,
                    index: 1,
                },
                {
                    id: 4,
                    label: 'NO',
                    value: 'motorVehicleForCompanyNo',
                    name: 'motorVehicleForCompanyNo',
                    checked: false,
                    index: 1,
                },
            ],
        },
        {
            title: 'Would this applicant be considered for employment with your company again?',
            formControlName: 'consideredForEmploymentAgain',
            formControlNameExplain: 'consideredForEmploymentAgainExplain',
            answerChoices: [
                {
                    id: 5,
                    label: 'YES',
                    value: 'consideredForEmploymentAgainYes',
                    name: 'consideredForEmploymentAgainYes',
                    checked: false,
                    index: 2,
                },
                {
                    id: 6,
                    label: 'NO',
                    value: 'consideredForEmploymentAgainNo',
                    name: 'consideredForEmploymentAgainNo',
                    checked: false,
                    index: 2,
                },
            ],
        },
    ];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private router: Router,
        private inputService: TaInputService,
        private applicantActionsService: ApplicantActionsService,
        private applicantStore: ApplicantStore,
        private applicantQuery: ApplicantQuery,
        private changeDetectorRef: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.createForm();

        this.getDropdownLists();

        this.hasNoSafetyPerformanceToReport();

        this.getStepValuesFromStore();
    }

    ngAfterViewInit(): void {
        const radioButtonsArray = this.components.toArray();

        this.workForCompanyRadios = radioButtonsArray[0].buttons;
        this.motorVehicleForCompanyRadios = radioButtonsArray[1].buttons;
        this.consideredForEmploymentAgainRadios = radioButtonsArray[2].buttons;
    }

    ngAfterContentChecked(): void {
        this.changeDetectorRef.detectChanges();
    }

    public trackByIdentity = (index: number, _: any): number => index;

    private createForm(): void {
        this.accidentHistoryForm = this.formBuilder.group({
            applicantWorkForCompany: [null, Validators.required],
            applicantWorkForCompanyExplain: [null],
            applicantWorkForCompanyBeforeExplain: [null],
            applicantWorkForCompanyToExplain: [null],
            motorVehicleForCompany: [null, Validators.required],
            motorVehicleForCompanyExplain: [null],
            vehicleType: [null],
            trailerType: [null],
            reasonForLeaving: [null, Validators.required],
            consideredForEmploymentAgain: [null, Validators.required],
            noSafetyPerformance: [false],
        });
    }

    public getStepValuesFromStore(): void {
        this.applicantQuery.applicantSphForm$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                // dodaj tip
                // this.previousEmployerProspectId = res.id;
                // if (res.sphAccidentHistory) {
                //     this.patchStepValues(res.sphAccidentHistory);
                //     /*  this.stepHasValues = true; */
                // }
            });
    }

    public patchStepValues(stepValues: any): void {
        const {
            workForCompany,
            workFrom,
            workTo,
            driveForCompany,
            vehicleType,
            trailerType,
            reasonForLeaving,
            reemployment,
            noAccidents,
            accidents,
        } = stepValues;

        this.accidentHistoryForm.patchValue({
            applicantWorkForCompany: workForCompany,
            applicantWorkForCompanyBeforeExplain:
                convertDateFromBackend(workFrom),
            applicantWorkForCompanyToExplain: convertDateFromBackend(workTo),
            motorVehicleForCompany: driveForCompany,
            vehicleType: this.vehicleType.find(
                (item) => item.id === vehicleType
            ).name,
            trailerType: this.trailerType.find(
                (item) => item.id === trailerType
            ).name,
            reasonForLeaving: this.reasonsForLeaving.find(
                (item) => item.id === reasonForLeaving
            ).name,
            consideredForEmploymentAgain: reemployment,
            noSafetyPerformance: noAccidents,
        });

        if (!noAccidents) {
            const lastItemInAccidentsArray = accidents[accidents.length - 1];

            const restOfTheItemsInAccidentsArray = [...accidents];

            restOfTheItemsInAccidentsArray.pop();

            const filteredAccidentsArray = restOfTheItemsInAccidentsArray.map(
                (item) => {
                    return {
                        isEditingAccident: false,
                        accidentDate: convertDateFromBackend(item.date),
                        accidentLocation: item.location,
                        accidentDescription: item.description,
                        hazmatSpill: item.hazmatSpill,
                        fatalities: item.fatalities,
                        injuries: item.injuries,
                    };
                }
            );

            const filteredLastItemInAccidentArray = {
                isEditingAccident: false,
                accidentDate: convertDateFromBackend(
                    lastItemInAccidentsArray.date
                ),
                accidentLocation: lastItemInAccidentsArray.location,
                accidentDescription: lastItemInAccidentsArray.description,
                hazmatSpill: lastItemInAccidentsArray.hazmatSpill,
                fatalities: lastItemInAccidentsArray.fatalities,
                injuries: lastItemInAccidentsArray.injuries,
            };

            this.accidentArray = [...filteredAccidentsArray];

            this.formValuesToPatch = filteredLastItemInAccidentArray;
            this.previousFormValuesOnEdit = filteredLastItemInAccidentArray;
        }

        setTimeout(() => {
            if (workForCompany) {
                this.workForCompanyRadios[0].checked = true;
            } else {
                this.workForCompanyRadios[1].checked = true;
            }

            if (driveForCompany) {
                this.motorVehicleForCompanyRadios[0].checked = true;
            } else {
                this.motorVehicleForCompanyRadios[1].checked = true;
            }

            if (reemployment) {
                this.consideredForEmploymentAgainRadios[0].checked = true;
            } else {
                this.consideredForEmploymentAgainRadios[1].checked = true;
            }

            this.selectedVehicleType = this.vehicleType.find(
                (item) => item.id === vehicleType
            );
            this.selectedTrailerType = this.trailerType.find(
                (item) => item.id === trailerType
            );
            this.selectedReasonForLeaving = this.reasonsForLeaving.find(
                (item) => item.id === reasonForLeaving
            );
        }, 50);
    }

    private hasNoSafetyPerformanceToReport(): void {
        this.accidentHistoryForm
            .get('noSafetyPerformance')
            .valueChanges.pipe(takeUntil(this.destroy$))
            .subscribe((value) => {
                if (value) {
                    this.formStatus = 'VALID';
                } else {
                    if (this.lastAccidentCard) {
                        this.formValuesToPatch = {
                            accidentLocation:
                                this.lastAccidentCard?.accidentLocation,
                            accidentDate: this.lastAccidentCard?.accidentDate,
                            hazmatSpill: this.lastAccidentCard?.hazmatSpill,
                            fatalities: this.lastAccidentCard?.fatalities,
                            injuries: this.lastAccidentCard?.injuries,
                            accidentDescription:
                                this.lastAccidentCard?.accidentDescription,
                        };
                    }

                    this.formStatus = 'INVALID';
                }
            });
    }

    public handleInputSelect(event: any, action: string): void {
        switch (action) {
            case InputSwitchActions.TRUCK_TYPE:
                this.selectedVehicleType = event;

                break;
            case InputSwitchActions.TRAILER_TYPE:
                this.selectedTrailerType = event;

                break;

            case InputSwitchActions.ANSWER_CHOICE:
                const selectedCheckbox = event.find(
                    (radio: { checked: boolean }) => radio.checked
                );

                const selectedFormControlName =
                    this.questions[selectedCheckbox.index].formControlName;

                const selectedExplainFormControlName =
                    this.questions[selectedCheckbox.index]
                        .formControlNameExplain;

                if (selectedCheckbox.label === 'YES') {
                    this.accidentHistoryForm
                        .get(selectedFormControlName)
                        .patchValue(true);

                    if (selectedCheckbox.index === 0) {
                        this.accidentHistoryForm
                            .get(selectedExplainFormControlName)
                            .patchValue(selectedCheckbox.label);

                        this.inputService.changeValidators(
                            this.accidentHistoryForm.get(
                                'applicantWorkForCompanyBeforeExplain'
                            )
                        );

                        this.inputService.changeValidators(
                            this.accidentHistoryForm.get(
                                'applicantWorkForCompanyToExplain'
                            )
                        );
                    }

                    if (selectedCheckbox.index === 1) {
                        this.inputService.changeValidators(
                            this.accidentHistoryForm.get('vehicleType')
                        );

                        this.inputService.changeValidators(
                            this.accidentHistoryForm.get('trailerType')
                        );
                    }
                } else {
                    this.accidentHistoryForm
                        .get(selectedFormControlName)
                        .patchValue(false);

                    if (selectedCheckbox.index === 0) {
                        this.accidentHistoryForm
                            .get(selectedExplainFormControlName)
                            .patchValue(selectedCheckbox.label);

                        this.inputService.changeValidators(
                            this.accidentHistoryForm.get(
                                'applicantWorkForCompanyBeforeExplain'
                            ),
                            false
                        );

                        this.inputService.changeValidators(
                            this.accidentHistoryForm.get(
                                'applicantWorkForCompanyToExplain'
                            ),
                            false
                        );
                    }

                    if (selectedCheckbox.index === 1) {
                        this.inputService.changeValidators(
                            this.accidentHistoryForm.get('vehicleType'),
                            false
                        );

                        this.inputService.changeValidators(
                            this.accidentHistoryForm.get('trailerType'),
                            false
                        );
                    }
                }

                this.displayRadioRequiredNoteArray[
                    selectedCheckbox.index
                ].displayRadioRequiredNote = false;
                break;
            case InputSwitchActions.REASON_FOR_LEAVING:
                this.selectedReasonForLeaving = event;

                break;

            default:
                break;
        }
    }

    public onCloseWarningBox(): void {
        this.accidentHistoryForm
            .get('applicantWorkForCompanyExplain')
            .patchValue(null);

        this.workForCompanyRadios[0].checked = false;
        this.workForCompanyRadios[1].checked = false;
    }

    public onSelectNoWarningBox(): void {
        this.accidentHistoryForm
            .get('applicantWorkForCompany')
            .patchValue(true);
        this.accidentHistoryForm
            .get('applicantWorkForCompanyExplain')
            .patchValue('YES');

        this.inputService.changeValidators(
            this.accidentHistoryForm.get('applicantWorkForCompanyBeforeExplain')
        );

        this.inputService.changeValidators(
            this.accidentHistoryForm.get('applicantWorkForCompanyToExplain')
        );

        this.workForCompanyRadios[0].checked = true;
        this.workForCompanyRadios[1].checked = false;
    }

    public onSelectYesWarningBox(): void {
        const { applicantWorkForCompany } = this.accidentHistoryForm.value;

        const saveData: CreatePreviousEmployerAccidentHistoryCommand = {
            workForCompany: applicantWorkForCompany,
            workFrom: null,
            workTo: null,
            driveForCompany: null,
            vehicleType: null,
            trailerType: null,
            reasonForLeaving: null,
            reemployment: null,
            noAccidents: null,
            accidents: [],
            previousEmployerProspectId: this.previousEmployerProspectId,
        };

        this.applicantActionsService
            .createAccidentHistorySphForm(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate(['/sph-form-end']);
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    public onDeleteAccident(index: number): void {
        if (this.isEditing) {
            return;
        }

        this.accidentArray.splice(index, 1);
    }

    public onEditAccident(index: number): void {
        if (this.isEditing) {
            this.isEditing = false;
            this.accidentArray[this.selectedAccidentIndex].isEditingAccident =
                false;

            this.helperIndex = 2;
            this.selectedAccidentIndex = -1;
        }

        this.helperIndex = index;
        this.selectedAccidentIndex = index;

        this.isEditing = true;
        this.accidentArray[index].isEditingAccident = true;

        const selectedAccident = this.accidentArray[index];

        if (this.lastAccidentCard) {
            this.previousFormValuesOnEdit = {
                accidentLocation: this.lastAccidentCard?.accidentLocation,
                accidentDate: this.lastAccidentCard?.accidentDate,
                hazmatSpill: this.lastAccidentCard?.hazmatSpill,
                fatalities: this.lastAccidentCard?.fatalities,
                injuries: this.lastAccidentCard?.injuries,
                accidentDescription: this.lastAccidentCard?.accidentDescription,
            };
        }

        this.formValuesToPatch = selectedAccident;
    }

    public getAccidentFormValues(event: any): void {
        this.accidentArray = [...this.accidentArray, event];

        this.helperIndex = 2;
    }

    public cancelAccidentEditing(_: any): void {
        this.isEditing = false;
        this.accidentArray[this.selectedAccidentIndex].isEditingAccident =
            false;

        this.helperIndex = 2;
        this.selectedAccidentIndex = -1;

        this.formValuesToPatch = this.previousFormValuesOnEdit;
    }

    public saveEditedAccident(event: any): void {
        this.isEditing = false;
        this.accidentArray[this.selectedAccidentIndex].isEditingAccident =
            false;

        this.accidentArray[this.selectedAccidentIndex] = event;

        this.helperIndex = 2;
        this.selectedAccidentIndex = -1;

        this.formValuesToPatch = this.previousFormValuesOnEdit;
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
        this.lastAccidentCard = event;
    }

    public onGetRadioRequiredNoteEmit(event: any): void {
        if (event) {
            this.displayRadioRequiredNote = true;
        } else {
            this.displayRadioRequiredNote = false;
        }
    }

    public getDropdownLists(): void {
        this.applicantQuery.applicantDropdownLists$
            .pipe(takeUntil(this.destroy$))
            .subscribe((res: ApplicantModalResponse) => {
                this.vehicleType = res.truckTypes.map((item) => {
                    return {
                        ...item,
                        folder: 'common',
                        subFolder: 'trucks',
                    };
                });

                this.trailerType = res.trailerTypes.map((item) => {
                    return {
                        ...item,
                        folder: 'common',
                        subFolder: 'trailers',
                    };
                });

                this.reasonsForLeaving = res.reasonsForLeave;
            });
    }

    public onStepAction(event: any): void {
        if (event.action === 'next-step') {
            this.onSubmit();
        }

        if (event.action === 'back-step') {
            this.router.navigate(['/sph-form/1/1']);
        }
    }

    public onSubmit(): void {
        this.checkIsHazmatSpillNotChecked = true;

        const {
            applicantWorkForCompany,
            applicantWorkForCompanyBeforeExplain,
            applicantWorkForCompanyToExplain,
            motorVehicleForCompany,
            consideredForEmploymentAgain,
            noSafetyPerformance,
        } = this.accidentHistoryForm.value;

        const radioButtons = [
            { id: 0, isChecked: applicantWorkForCompany },
            { id: 1, isChecked: motorVehicleForCompany },
            {
                id: 2,
                isChecked: consideredForEmploymentAgain,
            },
        ];

        const isAnyRadioUnchecked = isAnyRadioInArrayUnChecked(radioButtons);

        if (
            this.accidentHistoryForm.invalid ||
            this.formStatus === 'INVALID' ||
            this.isEditing ||
            isAnyRadioUnchecked
        ) {
            if (this.accidentHistoryForm.invalid) {
                this.inputService.markInvalid(this.accidentHistoryForm);
            }

            if (this.formStatus === 'INVALID') {
                this.markFormInvalid = true;
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

        const filteredAccidentArray = this.accidentArray.map((item) => {
            return {
                date: convertDateToBackend(item.accidentDate),
                location: item.accidentLocation,
                description: item.accidentDescription,
                hazmatSpill: item.hazmatSpill,
                injuries: item.injuries,
                fatalities: item.fatalities,
            };
        });

        const filteredLastAccidentCard = {
            date: convertDateToBackend(this.lastAccidentCard.accidentDate),
            location: this.lastAccidentCard.accidentLocation,
            description: this.lastAccidentCard.accidentDescription,
            hazmatSpill: this.lastAccidentCard.hazmatSpill,
            injuries: this.lastAccidentCard.injuries,
            fatalities: this.lastAccidentCard.fatalities,
        };

        const saveData: CreatePreviousEmployerAccidentHistoryCommand = {
            previousEmployerProspectId: this.previousEmployerProspectId,
            workForCompany: applicantWorkForCompany,
            workFrom: convertDateToBackend(
                applicantWorkForCompanyBeforeExplain
            ),
            workTo: convertDateToBackend(applicantWorkForCompanyToExplain),
            driveForCompany: motorVehicleForCompany,
            vehicleType: motorVehicleForCompany
                ? this.selectedVehicleType.id
                : null,
            trailerType: motorVehicleForCompany
                ? this.selectedTrailerType.id
                : null,
            reasonForLeaving: this.selectedReasonForLeaving?.id,
            reemployment: consideredForEmploymentAgain,
            noAccidents: noSafetyPerformance,
            accidents: noSafetyPerformance
                ? []
                : [...filteredAccidentArray, filteredLastAccidentCard],
        };

        this.applicantActionsService
            .createAccidentHistorySphForm(saveData)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
                next: () => {
                    this.router.navigate(['/sph-form/3']);

                    this.applicantStore.update((store) => {
                        return {
                            ...store,
                            applicantSphForm: {
                                ...store.applicantSphForm,
                                sphAccidentHistory: saveData,
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
