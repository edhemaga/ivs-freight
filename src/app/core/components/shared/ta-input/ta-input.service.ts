import { BehaviorSubject, Subject } from 'rxjs';
import { EventEmitter, Injectable, Output } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { NotificationService } from 'src/app/core/services/notification/notification.service';
import { SpinnerService } from 'src/app/core/services/spinner/spinner.service';
import { Address } from '../ta-input-address/ta-input-address.component';

@Injectable({
  providedIn: 'root'
})
export class TaInputService {
  public onClearInputSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public dropDownShowHideSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public dropdownAddModeSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  public addDropdownItemSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);
  
  public activeItemDropdownSubject: BehaviorSubject<any> =
     new BehaviorSubject<any>(null);

  public googleAddressSubject: BehaviorSubject<Address> =
    new BehaviorSubject<Address>(null);

  constructor(
    public notificationService: NotificationService,
    private spinnerService: SpinnerService
  ) {}

  public get activeItemDropdown$() {
    return this.activeItemDropdownSubject.asObservable();
  }

  public get getGoogleAddress$() {
    return this.googleAddressSubject.asObservable();
  }

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
  
  /**
   * @param address - premapped address
   */
  public handleAddress(address: Address) {
    this.googleAddressSubject.next(address);
  }

  /**
   * @param data - active dropdown item
   */
  public hasDropdownActiveItem(data: any) {
    this.activeItemDropdownSubject.next(data);
  }

}
