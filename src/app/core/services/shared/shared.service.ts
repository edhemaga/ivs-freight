import { Injectable } from '@angular/core';
import {FormGroup} from "@angular/forms";
import { SpinnerService } from './spiner.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  constructor(private notification: NotificationService,
    private spinner: SpinnerService) { }

  /**
   * Marks all controls in a form group as touched
   *
   * @param formGroup FormGroup - The form group to touch
   */
  public markInvalid(formGroup: FormGroup, isSpecialCase?: boolean) {
    if (!isSpecialCase) {
      // this.spinner.show(true);
    }

    if (formGroup.invalid) {
      (Object as any).values(formGroup.controls).forEach((control: any) => {
        control.markAsTouched();
        if (control.controls) {
          this.markInvalid(control);
        }
      });
      // this.notification.warning('Please fill all required fields.', 'Warning:');
      // this.spinner.show(false);
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

  public manageInputValidation(formElement: any): any {
    if (formElement.touched && formElement.valid) {
      return 'touched-valid';
    }
    if (formElement.touched && formElement.invalid) {
      return 'touched-invalid';
    }
    if (formElement.pristine && formElement.valid) {
      return 'untouched-valid';
    }
    if (formElement.pristine && formElement.invalid) {
      return 'untouched-invalid';
    }
  }

  public handleServerError() {
    this.notification.error('Something went wrong. Please try again.', 'Error:');
    this.spinner.show(false);
  }


}
