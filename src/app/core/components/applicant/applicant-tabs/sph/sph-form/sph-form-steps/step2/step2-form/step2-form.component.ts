/* eslint-disable no-unused-vars */

import {
    AfterViewInit,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
    SimpleChanges,
    ViewChild,
    OnChanges,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

import {
    Subscription,
    Subject,
    takeUntil,
    distinctUntilChanged,
    throttleTime,
} from 'rxjs';

import { isFormValueEqual } from '../../../../../../state/utils/utils';

import {
    addressValidation,
    descriptionValidation,
} from '../../../../../../../shared/ta-input/ta-input.regex-validations';

import { TaInputService } from '../../../../../../../shared/ta-input/ta-input.service';
import { FormService } from './../../../../../../../../services/form/form.service';

import { TaInputRadiobuttonsComponent } from '../../../../../../../shared/ta-input-radiobuttons/ta-input-radiobuttons.component';

import { SphFormAccidentModel } from '../../../../../../state/model/accident.model';
import { AnswerChoices } from '../../../../../../state/model/applicant-question.model';
import { InputSwitchActions } from '../../../../../../state/enum/input-switch-actions.enum';
import { AddressEntity } from 'appcoretruckassist';

@Component({
    selector: 'app-sph-step2-form',
    templateUrl: './step2-form.component.html',
    styleUrls: ['./step2-form.component.scss'],
})
export class SphStep2FormComponent
    implements OnInit, AfterViewInit, OnDestroy, OnChanges
{
    @ViewChild(TaInputRadiobuttonsComponent)
    component: TaInputRadiobuttonsComponent;

    @Input() isEditing: boolean;
    @Input() formValuesToPatch?: any;
    @Input() markFormInvalid?: boolean;
    @Input() displayRadioRequiredNote: boolean = false;
    @Input() checkIsHazmatSpillNotChecked: boolean;

    @Output() formValuesEmitter = new EventEmitter<any>();
    @Output() cancelFormEditingEmitter = new EventEmitter<any>();
    @Output() saveFormEditingEmitter = new EventEmitter<any>();
    @Output() formStatusEmitter = new EventEmitter<any>();
    @Output() markInvalidEmitter = new EventEmitter<any>();
    @Output() lastFormValuesEmitter = new EventEmitter<any>();
    @Output() radioRequiredNoteEmitter = new EventEmitter<any>();

    private destroy$ = new Subject<void>();

    public subscription: Subscription;

    public accidentForm: UntypedFormGroup;

    public accidentArray: SphFormAccidentModel[] = [];

    public isAccidentEdited?: boolean;

    public selectedAddress: AddressEntity = null;
    public editingCardAddress: any;

    public hazmatSpillRadios: any;
    public hazmatAnswerChoices: AnswerChoices[] = [
        {
            id: 7,
            label: 'YES',
            value: 'hazmatYes',
            name: 'hazmatYes',
            checked: false,
        },
        {
            id: 8,
            label: 'NO',
            value: 'hazmatNo',
            name: 'hazmatNo',
            checked: false,
        },
    ];

    constructor(
        private formBuilder: UntypedFormBuilder,
        private inputService: TaInputService,
        private formService: FormService
    ) {}

    ngOnInit(): void {
        this.createForm();
    }

    ngAfterViewInit(): void {
        this.hazmatSpillRadios = this.component.buttons;

        this.accidentForm.statusChanges
            .pipe(takeUntil(this.destroy$))
            .subscribe((res) => {
                this.formStatusEmitter.emit(res);
            });

        this.accidentForm.valueChanges
            .pipe(
                distinctUntilChanged(),
                throttleTime(2),
                takeUntil(this.destroy$)
            )
            .subscribe((res) => {
                res.accidentLocation = this.selectedAddress;

                this.lastFormValuesEmitter.emit(res);
            });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (
            changes.markFormInvalid?.previousValue !==
            changes.markFormInvalid?.currentValue
        ) {
            this.inputService.markInvalid(this.accidentForm);

            this.markInvalidEmitter.emit(false);
        }

        if (
            changes.formValuesToPatch?.previousValue !==
            changes.formValuesToPatch?.currentValue
        ) {
            setTimeout(() => {
                this.patchForm(changes.formValuesToPatch.currentValue);

                this.startValueChangesMonitoring();
            }, 50);
        }

        if (
            changes.checkIsHazmatSpillNotChecked?.previousValue !==
            changes.checkIsHazmatSpillNotChecked?.currentValue
        ) {
            let hazmatSpillRadios: any;

            if (!changes.checkIsHazmatSpillNotChecked?.firstChange) {
                hazmatSpillRadios = this.accidentForm.get('hazmatSpill').value;
            }

            if (hazmatSpillRadios === null) {
                this.radioRequiredNoteEmitter.emit(true);
            }
        }
    }

    private createForm(): void {
        this.accidentForm = this.formBuilder.group({
            accidentDate: [null, Validators.required],
            accidentLocation: [
                null,
                [Validators.required, ...addressValidation],
            ],
            accidentDescription: [
                null,
                [Validators.required, ...descriptionValidation],
            ],
            hazmatSpill: [null, Validators.required],
            injuries: [0],
            fatalities: [0],
        });
    }

    public patchForm(formValue: any): void {
        this.accidentForm.patchValue({
            accidentDate: formValue.accidentDate,
            accidentLocation: formValue.accidentLocation.address,
            accidentDescription: formValue.accidentDescription,
            hazmatSpill: formValue.hazmatSpill,
            fatalities: formValue.fatalities,
            injuries: formValue.injuries,
        });

        setTimeout(() => {
            this.selectedAddress = formValue.accidentLocation;

            const hazmatSpillValue = this.accidentForm.get('hazmatSpill').value;

            if (hazmatSpillValue) {
                this.hazmatSpillRadios[0].checked = true;
            } else {
                this.hazmatSpillRadios[1].checked = true;

                if (hazmatSpillValue === null) {
                    this.hazmatSpillRadios[0].checked = false;
                    this.hazmatSpillRadios[1].checked = false;
                }
            }
        }, 50);
    }

    public startValueChangesMonitoring(): void {
        this.subscription = this.accidentForm.valueChanges
            .pipe(
                distinctUntilChanged(),
                throttleTime(2),
                takeUntil(this.destroy$)
            )
            .subscribe((updatedFormValues) => {
                const {
                    accidentLocation,
                    accidentState,
                    isEditingAccident,
                    ...previousFormValues
                } = this.formValuesToPatch;

                previousFormValues.accidentLocation = accidentLocation?.address;

                updatedFormValues.accidentLocation =
                    this.selectedAddress?.address;

                this.editingCardAddress = accidentLocation;

                if (isFormValueEqual(previousFormValues, updatedFormValues)) {
                    this.isAccidentEdited = false;
                } else {
                    this.isAccidentEdited = true;
                }
            });
    }

    public handleInputSelect(event: any, action: string): void {
        switch (action) {
            case InputSwitchActions.ADDRESS:
                this.selectedAddress = event.address;

                if (!event.valid) {
                    this.accidentForm
                        .get('accidentLocation')
                        .setErrors({ invalid: true });
                }

                break;
            case InputSwitchActions.HAZMAT_SPILL:
                const selectedHazmatCheckbox = event.find(
                    (radio: { checked: boolean }) => radio.checked
                );

                if (selectedHazmatCheckbox.label === 'YES') {
                    this.accidentForm.get('hazmatSpill').patchValue(true);
                } else {
                    this.accidentForm.get('hazmatSpill').patchValue(false);
                }

                this.radioRequiredNoteEmitter.emit(false);

                break;

            default:
                break;
        }
    }

    public onAddAnotherAccident(): void {
        if (
            this.accidentForm.invalid ||
            this.accidentForm.get('hazmatSpill').value === null
        ) {
            if (this.accidentForm.invalid) {
                this.inputService.markInvalid(this.accidentForm);
            }

            if (this.accidentForm.get('hazmatSpill').value === null) {
                this.radioRequiredNoteEmitter.emit(true);
            }

            return;
        }

        const { accidentLocation, ...registerForm } = this.accidentForm.value;

        const saveData: SphFormAccidentModel = {
            ...registerForm,
            accidentLocation: this.selectedAddress,
            accidentState: this.selectedAddress.stateShortName,
            isEditingAccident: false,
        };

        this.formValuesEmitter.emit(saveData);

        this.hazmatSpillRadios[0].checked = false;
        this.hazmatSpillRadios[1].checked = false;

        this.selectedAddress = null;

        this.formService.resetForm(this.accidentForm);

        this.accidentForm.patchValue({
            fatalities: 0,
            injuries: 0,
        });
    }

    public onSaveEditedAccident(): void {
        if (this.accidentForm.invalid) {
            this.inputService.markInvalid(this.accidentForm);
            return;
        }

        if (!this.isAccidentEdited) {
            return;
        }

        const { address, accidentState, ...registerForm } =
            this.accidentForm.value;

        const saveData: SphFormAccidentModel = {
            ...registerForm,
            accidentLocation: this.selectedAddress
                ? this.selectedAddress
                : this.editingCardAddress,
            accidentState: this.selectedAddress
                ? this.selectedAddress.state
                : this.editingCardAddress.state,
            isEditingAccident: false,
        };

        this.hazmatSpillRadios[0].checked = false;
        this.hazmatSpillRadios[1].checked = false;

        this.selectedAddress = null;

        this.saveFormEditingEmitter.emit(saveData);

        this.isAccidentEdited = false;

        this.subscription.unsubscribe();
    }

    public onCancelEditAccident(): void {
        this.cancelFormEditingEmitter.emit(1);

        this.isAccidentEdited = false;

        this.hazmatSpillRadios[0].checked = false;
        this.hazmatSpillRadios[1].checked = false;

        this.selectedAddress = null;

        this.subscription.unsubscribe();
    }

    public onGetBtnClickValue(event: any): void {
        if (event.notDisabledClick) {
            this.onAddAnotherAccident();
        }

        if (event.cancelClick) {
            this.onCancelEditAccident();
        }

        if (event.saveClick) {
            this.onSaveEditedAccident();
        }
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
