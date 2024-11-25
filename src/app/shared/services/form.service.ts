import { Injectable, OnDestroy } from '@angular/core';
import { AbstractControl, UntypedFormGroup, ValidatorFn } from '@angular/forms';

import { diff } from 'deep-object-diff';

import { Subject, takeUntil, distinctUntilChanged } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class FormService implements OnDestroy {
    private originalValue: any;
    private destroy$: Subject<void> = new Subject<void>();

    public formValueChange$: Subject<boolean> = new Subject<boolean>();
    public formReset$: Subject<boolean> = new Subject<boolean>();

    public checkFormChange(form: UntypedFormGroup) {
        this.originalValue = form.value;

        form.valueChanges
            .pipe(distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe(() => {
                let current_value = form.value;
                if (
                    Object.keys(diff(this.originalValue, current_value))
                        .length !== 0
                ) {
                    this.formValueChange$.next(true);
                } else {
                    this.formValueChange$.next(false);
                }
            });
    }

    public resetForm(form: UntypedFormGroup): void {
        form.reset();
        this.formReset$.next(true);
    }

    public rangeValidator(
        min: number,
        max: number,
        maxDigits: number = 3
    ): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const value = control.value;

            if (
                value !== null &&
                (!this.isValidNumber(value, maxDigits) ||
                    value < min ||
                    value > max)
            ) {
                return { range: true };
            }

            return null;
        };
    }

    private isValidNumber(value: string | number, maxDigits: number): boolean {
        if (!value) return false;

        value = value.toString().replace(',', '');
        const numPattern = new RegExp(`^-?\\d{1,${maxDigits}}$`);
        return numPattern.test(value);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
