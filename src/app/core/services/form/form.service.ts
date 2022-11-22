import { Subject, takeUntil } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, first } from 'rxjs/operators';
import { diff } from 'deep-object-diff';

@Injectable({
    providedIn: 'root',
})
export class FormService implements OnDestroy {
    private originalValue: any;
    private destroy$: Subject<void> = new Subject<void>();
    constructor() {}

    public formValueChange$: Subject<boolean> = new Subject<boolean>();
    public formReset$: Subject<boolean> = new Subject<boolean>();

    public checkFormChange(form: FormGroup, debounceTimeProp: number = 100) {
        // When the form loads, changes are made for each control separately
        // and it is hard to determine when it has actually finished initializing,
        // To solve it, we keep updating the original value, until the form goes
        // dirty. When it does, we no longer update the original value.
        form.statusChanges
            .pipe(
                debounceTime(debounceTimeProp),
                first(),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
            .subscribe(() => {
                if (!form.dirty) {
                    this.originalValue = form.value;

                    this.formValueChange$.next(false);
                }
            });
        // // Every time the form changes, we compare it with the original value.
        // // If it is different, we emit a value to the Subject (if one was provided)
        // // If it is the same, we emit a value to the Subject (if one was provided), or
        // // we mark the form as pristine again.
        form.valueChanges
            .pipe(
                debounceTime(debounceTimeProp),
                distinctUntilChanged(),
                takeUntil(this.destroy$)
            )
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

    public resetForm(form: FormGroup): void {
        form.reset();
        this.formReset$.next(true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
