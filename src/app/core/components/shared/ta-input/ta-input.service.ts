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

  public dropDownAddMode$: Subject<boolean> = new Subject<boolean>();

  constructor(public notificationService: NotificationService) {}

  /**
   * @param formGroup FormGroup - The form group to touch
   */
  public markInvalid(formGroup: FormGroup): boolean {
    if (formGroup.invalid) {
      Object.keys(formGroup.controls).forEach((key: any) => {
        console.log('key: ---- ', key);
        formGroup.get(key).markAsTouched();
        formGroup.get(key).updateValueAndValidity();
        console.log(
          'control: ',
          key +
            ' - Valid: ' +
            formGroup.get(key).valid +
            ' - Touched:' +
            formGroup.get(key).touched
        );
      });

      this.notificationService.warning(
        'Please fill all required fields.',
        'Warning:'
      );

      return false;
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

  /**
   *
   * @param formControl
   * @param hasValidation
   */
  public changeValidatorsCheck(
    formControl: AbstractControl,
    hasValidation: boolean = true
  ) {
    if (hasValidation) {
      formControl.setValidators(Validators.requiredTrue);
    } else {
      formControl.clearValidators();
    }

    if (formControl) {
      formControl.updateValueAndValidity();
    }
  }

  /**
   *
   * @param formControl
   * @param type
   * @param destroy$
   * @returns
   */
  public customInputValidator(
    formControl: AbstractControl,
    type: string,
    destroy$: Subject<void>
  ) {
    return formControl.valueChanges
      .pipe(takeUntil(destroy$))
      .subscribe((value) => {
        if (value) {
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
        }
      });
  }
}
