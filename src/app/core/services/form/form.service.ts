import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { distinctUntilChanged, first, take } from 'rxjs/operators';
import { updatedDiff } from 'deep-object-diff';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private originalValue: any;
  private lastNotify: boolean;

  constructor() {}

  public formValueChange$: Subject<boolean> = new Subject<boolean>();
  public formReset$: Subject<boolean> = new Subject<boolean>();

  public checkFormChange(form: FormGroup) {
    // When the form loads, changes are made for each control separately
    // and it is hard to determine when it has actually finished initializing,
    // To solve it, we keep updating the original value, until the form goes
    // dirty. When it does, we no longer update the original value.
    form.statusChanges.pipe(distinctUntilChanged()).subscribe(() => {
      if (!form.dirty) {
        this.originalValue = form.value;
        this.lastNotify = true;
        this.formValueChange$.next(false);
      }
      console.log('status');
    });
    // // Every time the form changes, we compare it with the original value.
    // // If it is different, we emit a value to the Subject (if one was provided)
    // // If it is the same, we emit a value to the Subject (if one was provided), or
    // // we mark the form as pristine again.
    form.valueChanges.pipe(distinctUntilChanged()).subscribe(() => {
      // if (form.dirty) {
      let current_value = form.value;
      console.log(this.originalValue);
      console.log(current_value);
      console.log(updatedDiff(this.originalValue, current_value));
      if (
        Object.keys(updatedDiff(this.originalValue, current_value)).length !== 0
      ) {
        if (this.lastNotify == null || this.lastNotify == true) {
          this.lastNotify = false;
          this.formValueChange$.next(true);
        }
      } else {
        this.lastNotify = true;
        this.formValueChange$.next(false);
      }
      // }
      console.log('value');
    });
  }

  public resetForm(form: FormGroup): void {
    form.reset();
    this.formReset$.next(true);
  }
}
