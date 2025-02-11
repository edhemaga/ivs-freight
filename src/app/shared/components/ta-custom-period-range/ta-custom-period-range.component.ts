import { CommonModule } from '@angular/common';
import {
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
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

import { Subject, distinctUntilChanged, takeUntil, throttleTime } from 'rxjs';

// moment
import moment from 'moment';

// config
import { CustomPeriodRangeConfig } from '@shared/components/ta-custom-period-range/utils/config/custom-period-range.config';

// services
import { FormService } from '@shared/services/form.service';

// components
import { TaInputComponent } from '@shared/components/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '@shared/components/ta-input-dropdown/ta-input-dropdown.component';

// models
import { CustomPeriodRange } from '@shared/models/custom-period-range.model';
import { DropdownListItem } from '@pages/dashboard/models/dropdown-list-item.model';
import { ITaInput } from '@shared/components/ta-input/config/ta-input.config';
import { CaInputDatetimePickerComponent } from 'ca-components';

@Component({
    selector: 'app-ta-custom-period-range',
    templateUrl: './ta-custom-period-range.component.html',
    styleUrls: ['./ta-custom-period-range.component.scss'],
    standalone: true,
    imports: [
        // modules
        CommonModule,
        ReactiveFormsModule,

        // components
        TaInputComponent,
        TaInputDropdownComponent,
        CaInputDatetimePickerComponent
    ],
})
export class TaCustomPeriodRangeComponent
    implements OnInit, OnChanges, OnDestroy
{
    @Input() subPeriodDropdownList: DropdownListItem[] = [];
    @Input() selectedSubPeriod: DropdownListItem;
    @Input() selectedCustomPeriodRange: CustomPeriodRange;
    @Input() clearCustomPeriodRangeValue?: boolean = false;
    @Input() isOnlyDateInputsLayout?: boolean = false;

    @Output() customPeriodRangeValuesEmitter =
        new EventEmitter<CustomPeriodRange>();
    @Output() customPeriodRangeSubperiodEmitter = new EventEmitter<number>();

    private destroy$ = new Subject<void>();

    public isFormDirty: boolean = true;

    public customPeriodRangeForm: UntypedFormGroup;

    public isSubPeriodDisabled: boolean = true;

    constructor(
        private formBuilder: UntypedFormBuilder,
        private formService: FormService
    ) {}

    get fromDateConfig(): ITaInput {
        return CustomPeriodRangeConfig.getFromDateConfig();
    }

    get toDateConfig(): ITaInput {
        return CustomPeriodRangeConfig.getToDateConfig();
    }

    get subPeriodConfig(): ITaInput {
        return CustomPeriodRangeConfig.getSubPeriodConfig(
            this.isSubPeriodDisabled
        );
    }

    ngOnInit(): void {
        this.createForm();

        this.watchDateInputsValueChange();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes.clearCustomPeriodRangeValue?.currentValue) {
            this.resetCustomPeriodRangeForm();
        }
    }

    private createForm(): void {
        this.customPeriodRangeForm = this.formBuilder.group({
            fromDate: [
                this.selectedCustomPeriodRange?.fromDate ?? null,
                Validators.required,
            ],
            toDate: [
                this.selectedCustomPeriodRange?.toDate ?? null,
                Validators.required,
            ],
            subPeriod: [
                null,
                !this.isOnlyDateInputsLayout && Validators.required,
            ],
        });

        if (this.selectedCustomPeriodRange) this.startFormChanges();
    }

    private startFormChanges() {
        this.formService.checkFormChange(this.customPeriodRangeForm);

        this.formService.formValueChange$
            .pipe(takeUntil(this.destroy$))
            .subscribe((isFormChange: boolean) => {
                this.isFormDirty = isFormChange;
            });
    }

    public handleInputSelect(dropdownListItem: DropdownListItem): void {
        this.selectedSubPeriod = dropdownListItem;

        this.customPeriodRangeForm.patchValue({
            subPeriod: dropdownListItem.name,
        });
    }

    public handleCancelOrSetClick(isCancelBtnClick: boolean): void {
        if (isCancelBtnClick) {
            this.customPeriodRangeValuesEmitter.emit(null);
        } else {
            this.customPeriodRangeValuesEmitter.emit(
                this.customPeriodRangeForm.value
            );
        }

        this.resetCustomPeriodRangeForm();
    }

    public handleContainerClick(event: Event): void {
        event.stopPropagation();
    }

    private watchDateInputsValueChange(): void {
        this.customPeriodRangeForm.valueChanges
            .pipe(
                distinctUntilChanged(),
                throttleTime(500),
                takeUntil(this.destroy$)
            )
            .subscribe((formValue) => {
                if (formValue.fromDate && formValue.toDate) {
                    const fromDate = moment(new Date(formValue.fromDate));
                    const toDate = moment(new Date(formValue.toDate));

                    const selectedDaysRange = toDate.diff(fromDate, 'days') + 1;

                    if (selectedDaysRange > 0) {
                        this.customPeriodRangeSubperiodEmitter.emit(
                            selectedDaysRange
                        );

                        this.isSubPeriodDisabled = false;
                    }
                }
            });
    }

    private resetCustomPeriodRangeForm(): void {
        const formControlNames = Object.keys(
            this.customPeriodRangeForm.controls
        );

        this.customPeriodRangeForm.reset();

        for (let i = 0; i < formControlNames.length; i++) {
            const formControl = this.customPeriodRangeForm.get(
                formControlNames[i]
            );

            if (formControl.value) {
                this.customPeriodRangeForm
                    .get(formControlNames[i])
                    .clearValidators();
            }

            formControl.reset();
        }

        this.isSubPeriodDisabled = true;
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
