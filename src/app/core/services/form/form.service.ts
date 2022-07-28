import { Observable, of, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Injectable({
  providedIn: 'root',
})
export class FormService {
  private originalValue: string;
  private lastNotify: boolean;

  constructor() {}

  public formValueChange$: Subject<boolean> = new Subject<boolean>();

  public checkFormChange(form: FormGroup) {
    // When the form loads, changes are made for each control separately
    // and it is hard to determine when it has actually finished initializing,
    // To solve it, we keep updating the original value, until the form goes
    // dirty. When it does, we no longer update the original value.
    // form.statusChanges.subscribe(() => {
    //   if (!form.dirty) {
    //     this.originalValue = JSON.stringify(form.value);
    //     this.lastNotify = true;
    //     this.formValueChange$.next(true);
    //   }
    // });
    // // Every time the form changes, we compare it with the original value.
    // // If it is different, we emit a value to the Subject (if one was provided)
    // // If it is the same, we emit a value to the Subject (if one was provided), or
    // // we mark the form as pristine again.
    // form.valueChanges.subscribe(() => {
    //   if (form.dirty) {
    //     let current_value = JSON.stringify(form.value);
    //     if (this.originalValue != current_value) {
    //       if (this.lastNotify == null || this.lastNotify == true) {
    //         this.lastNotify = false;
    //         this.formValueChange$.next(false);
    //       }
    //     } else {
    //       this.lastNotify = true;
    //       this.formValueChange$.next(true);
    //     }
    //   }
    // });
  }
}
