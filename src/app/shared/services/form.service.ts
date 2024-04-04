import { Injectable, OnDestroy } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

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

    ngOnDestroy(): void {
        this.destroy$.next();
        this.destroy$.complete();
    }
}
