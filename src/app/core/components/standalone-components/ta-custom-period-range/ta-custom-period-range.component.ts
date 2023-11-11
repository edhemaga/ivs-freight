import { CommonModule } from '@angular/common';
import {
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
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
import { ConstantStringEnum } from '../../dashboard/state/enums/constant-string.enum';

// models
import { CustomPeriodRange } from '../../dashboard/state/models/custom-period-range.model';
import { DropdownListItem } from '../../dashboard/state/models/dropdown-list-item.model';

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
export class TaCustomPeriodRangeComponent implements OnInit, OnDestroy {
    @Input() subPeriodDropdownList: DropdownListItem[] = [];
    @Input() selectedSubPeriod: DropdownListItem;

    @Output() customPeriodRangeValuesEmitter =
        new EventEmitter<CustomPeriodRange>();
    @Output() customPeriodRangeSubperiodEmitter = new EventEmitter<number>();

    private destroy$ = new Subject<void>();

    public customPeriodRangeForm: UntypedFormGroup;

    constructor(private formBuilder: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.createForm();

        this.watchDateInputsValueChange();
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
    }

    public handleCancelOrSetClick(isCancelBtnClick: boolean = true): void {
        if (isCancelBtnClick) {
            this.customPeriodRangeValuesEmitter.emit(null);
        } else {
            this.customPeriodRangeValuesEmitter.emit(
                this.customPeriodRangeForm.value
            );
        }
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
                    }
                }
            });
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
