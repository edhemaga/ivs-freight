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

// components
import { TaInputComponent } from '../../shared/ta-input/ta-input.component';
import { TaInputDropdownComponent } from '../../shared/ta-input-dropdown/ta-input-dropdown.component';

// enums
import { ConstantStringEnum } from 'src/app/pages/dashboard/state/enums/constant-string.enum';

// models
import { CustomPeriodRange } from 'src/app/pages/dashboard/state/models/custom-period-range.model';
import { DropdownListItem } from 'src/app/pages/dashboard/state/models/dropdown-list-item.model';

@Component({
    selector: 'app-ta-custom-period-range',
    templateUrl: './ta-custom-period-range.component.html',
    styleUrls: ['./ta-custom-period-range.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        ReactiveFormsModule,
        TaInputComponent,
        TaInputDropdownComponent,
    ],
})
export class TaCustomPeriodRangeComponent
    implements OnInit, OnChanges, OnDestroy
{
    @Input() subPeriodDropdownList: DropdownListItem[] = [];
    @Input() selectedSubPeriod: DropdownListItem;
    @Input() clearCustomPeriodRangeValue?: boolean = false;

    @Output() customPeriodRangeValuesEmitter =
        new EventEmitter<CustomPeriodRange>();
    @Output() customPeriodRangeSubperiodEmitter = new EventEmitter<number>();

    private destroy$ = new Subject<void>();

    public customPeriodRangeForm: UntypedFormGroup;

    public isSubPeriodDisabled: boolean = true;

    constructor(private formBuilder: UntypedFormBuilder) {}

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
            fromDate: [null, Validators.required],
            toDate: [null, Validators.required],
            subPeriod: [null, Validators.required],
        });
    }

    public handleInputSelect(dropdownListItem: DropdownListItem): void {
        this.selectedSubPeriod = dropdownListItem;

        this.customPeriodRangeForm.patchValue({
            subPeriod: dropdownListItem.name,
        });
    }

    public handleCancelOrSetClick(isCancelBtnClick: boolean = true): void {
        if (isCancelBtnClick) {
            this.customPeriodRangeValuesEmitter.emit(null);
        } else {
            this.customPeriodRangeValuesEmitter.emit(
                this.customPeriodRangeForm.value
            );
        }

        this.resetCustomPeriodRangeForm();
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

                    const selectedDaysRange =
                        toDate.diff(fromDate, ConstantStringEnum.DAYS) + 1;

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
