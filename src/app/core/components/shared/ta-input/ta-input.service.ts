import { BehaviorSubject } from 'rxjs';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { SpinnerService } from 'src/app/core/services/spinner/spinner.service';

@Injectable({
  providedIn: 'root',
})
export class TaInputService {

  public onClearInputSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public onFocusInputSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public dropDownShowHideSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public activateDropdownAddNewSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public addItemDropdownSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  constructor(
    public notificationService: NotificationService,
    private spinnerService: SpinnerService
  ) {}

  /**
   * @param formGroup FormGroup - The form group to touch
   */
  public markInvalid(formGroup: FormGroup, isSpecialCase?: boolean) {
    if (!isSpecialCase) {
      this.spinnerService.show(true);
    }

    if (formGroup.invalid) {
      (Object as any).values(formGroup.controls).forEach((control: any) => {
        control.markAsTouched();
        if (control.controls) {
          this.markInvalid(control);
        }
        console.log(control);
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
}
