import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import {
    ReactiveFormsModule,
    UntypedFormBuilder,
    UntypedFormGroup,
    Validators,
} from '@angular/forms';

// components
import { TaInputComponent } from '../../shared/ta-input/ta-input.component';

// models
import { CustomPeriodRange } from '../../dashboard/state/models/custom-period-range.model';

@Component({
    selector: 'app-ta-custom-period-range',
    templateUrl: './ta-custom-period-range.component.html',
    styleUrls: ['./ta-custom-period-range.component.scss'],
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, TaInputComponent],
})
export class TaCustomPeriodRangeComponent implements OnInit {
    @Output() customPeriodRangeValuesEmitter =
        new EventEmitter<CustomPeriodRange>();

    public customPeriodRangeForm: UntypedFormGroup;

    constructor(private formBuilder: UntypedFormBuilder) {}

    ngOnInit(): void {
        this.createForm();
    }

    private createForm(): void {
        this.customPeriodRangeForm = this.formBuilder.group({
            fromDate: [null, Validators.required],
            toDate: [null, Validators.required],
        });
    }

    public handleClearAllOrSetClick(clearAllBtn: boolean = true): void {
        if (clearAllBtn) {
            this.customPeriodRangeForm.reset();
            this.customPeriodRangeForm.markAsPristine();
            this.customPeriodRangeForm.markAsUntouched();
        } else {
            this.customPeriodRangeValuesEmitter.emit(
                this.customPeriodRangeForm.value
            );
        }
    }
}
