import { BehaviorSubject, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { SpinnerService } from 'src/app/core/services/spinner/spinner.service';

@Injectable({
  providedIn: 'root',
})
export class TaInputService {
  public onClearInputSubject: Subject<boolean> = new Subject<boolean>();

  public onFocusOutInputSubject: Subject<boolean> = new Subject<boolean>();

  public dropDownShowHideSubject: Subject<boolean> = new Subject<boolean>();

  public dropDownKeyNavigationSubject: Subject<number> = new Subject<number>();

  public isDropDownItemSelectedOnEnter: Subject<boolean> =
    new Subject<boolean>();

  public dropdownAddModeSubject: Subject<boolean> = new Subject<boolean>();

  public addDropdownItemSubject: Subject<boolean> = new Subject<boolean>();

  constructor(
    public notificationService: NotificationService,
    private spinnerService: SpinnerService
  ) {}

  /**
   * @param formGroup FormGroup - The form group to touch
   */
  public markInvalid(formGroup: FormGroup, isSpecialCase?: boolean): boolean {
    if (!isSpecialCase) {
      this.spinnerService.show(true);
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
      this.spinnerService.show(false);
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
    validators: any[] = []
  ): void {
    const validation = [Validators.required, ...validators];

    if (hasValidation) {
      formControl.setValidators(validation);
    } else {
      formControl.clearValidators();
      formControl.reset();
    }
    formControl.updateValueAndValidity();
  }
}
