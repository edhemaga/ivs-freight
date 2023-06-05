import { Subject, takeUntil, skip } from 'rxjs';
import { Injectable, OnDestroy } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import {
    debounceTime,
    delay,
    distinctUntilChanged,
    first,
} from 'rxjs/operators';
import { diff } from 'deep-object-diff';

@Injectable({
    providedIn: 'root',
})
export class FormService implements OnDestroy {
    private originalValue: any;
    private initForm: boolean = false;
    private destroy$: Subject<void> = new Subject<void>();

    public formValueChange$: Subject<boolean> = new Subject<boolean>();
    public formReset$: Subject<boolean> = new Subject<boolean>();

    public checkFormChange(
        form: UntypedFormGroup,
        debounceTimeProp: number = 1000
    ) {
        this.originalValue = form.value;
        // When the form loads, changes are made for each control separately
        // and it is hard to determine when it has actually finished initializing,
        // To solve it, we keep updating the original value, until the form goes
        // dirty. When it does, we no longer update the original value.
        // form.statusChanges
        //     .pipe(first(), distinctUntilChanged(), takeUntil(this.destroy$))
        //     .subscribe(() => {
        //         console.log("IS THIS INIT ");
        //         if (!this.initForm) {
        //             this.originalValue = form.value;
        //             this.initForm = true;
        //             this.formValueChange$.next(false);
        //         }
        //     });
        // // Every time the form changes, we compare it with the original value.
        // // If it is different, we emit a value to the Subject (if one was provided)
        // // If it is the same, we emit a value to the Subject (if one was provided), or
        // // we mark the form as pristine again.
        form.valueChanges
            .pipe(skip(1), distinctUntilChanged(), takeUntil(this.destroy$))
            .subscribe(() => {
               // if (this.initForm) {
                    let current_value = form.value;

                    if (
                        Object.keys(diff(this.originalValue, current_value))
                            .length !== 0
                    ) {
                        this.formValueChange$.next(true);
                    } else {
                        this.formValueChange$.next(false);
                    }
              //  }
            });
    }

    public resetForm(form: UntypedFormGroup): void {
        form.reset();
        this.formReset$.next(true);
    }

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
