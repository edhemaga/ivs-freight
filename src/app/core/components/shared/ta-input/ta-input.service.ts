import { Subject, takeUntil } from 'rxjs';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import validator from 'validator';
import { NotificationService } from '../../../services/notification/notification.service';

@Injectable({
  providedIn: 'root',
})
export class TaInputService {
  public onClearInput$: Subject<boolean> = new Subject<boolean>();

  public onFocusOutInput$: Subject<boolean> = new Subject<boolean>();

  public dropDownShowHide$: Subject<boolean> = new Subject<boolean>();

  public dropDownKeyNavigation$: Subject<number> = new Subject<number>();

  public dropDownItemSelectedOnEnter$: Subject<boolean> =
    new Subject<boolean>();

  public dropdownAddMode$: Subject<boolean> = new Subject<boolean>();

  constructor(public notificationService: NotificationService) {}

  /**
   * @param formGroup FormGroup - The form group to touch
   */
  public markInvalid(formGroup: FormGroup, isSpecialCase?: boolean): boolean {
    if (!isSpecialCase) {
    }

    if (formGroup.invalid) {
      (Object as any).values(formGroup.controls).forEach((control: any) => {
        control.markAsTouched();
        if (control.controls) {
          this.markInvalid(control);
        }
      });
      this.notificationService.warning(
        'Please fill all required fields.',
        'Warning:'
      );

      return false;
    } else {
      (Object as any).values(formGroup.controls).forEach((control: any) => {
        control.markAsTouched();
        if (control.controls) {
          this.markInvalid(control);
        }
      });
      return true;
    }
  }

  /**
   * @param formControl
   * @param hasValidation
   * @param validators
   */
  public changeValidators(
    formControl: AbstractControl,
    hasValidation: boolean = true,
    validators: any[] = [],
    reset: boolean = true
  ): void {
    const validation = [Validators.required, ...validators];
    if (hasValidation) {
      formControl.setValidators(validation);
    } else {
      if (formControl && formControl.hasValidator(Validators.required)) {
        formControl.clearValidators();
      }

      if (reset && formControl) {
        formControl.reset();
      }
    }
    if (formControl) {
      formControl.updateValueAndValidity();
    }
  }

  public customInputValidator(
    formControl: AbstractControl,
    type: string,
    destroy$: Subject<void>
  ) {
    return formControl.valueChanges
      .pipe(takeUntil(destroy$))
      .subscribe((value) => {
        switch (type) {
          case 'email': {
            if (!validator.isEmail(value)) {
              formControl.setErrors({ invalid: true });
            } else {
              formControl.setErrors(null);
            }
            break;
          }
          case 'url': {
            if (!validator.isURL(value)) {
              formControl.setErrors({ invalid: true });
            } else {
              formControl.setErrors(null);
            }
            break;
          }
          default: {
            break;
          }
        }
      });
  }
}
