import {EventEmitter, Injectable} from '@angular/core';
import {FormGroup} from "@angular/forms";
import {NotificationService} from "../notification/notification.service";
import {Address} from "../../model/address";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  public emitTogglePdf: EventEmitter<boolean> = new EventEmitter();
  public emitCloseNote: EventEmitter<boolean> = new EventEmitter();

  constructor(public notification: NotificationService) { }

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
      this.notification.warning('Please fill all required fields.', 'Warning:');
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

  /**
   * Server error handling
   */
  public handleServerError() {
    this.notification.error('Something went wrong. Please try again.', 'Error:');
    //this.spinner.show(false);
  }

  /**
   * It handles input values.
   */
  public handleInputValues(form: any, data: any) {
    Object.keys(data).forEach((key1: any) => {
      Object.keys(form.controls).forEach((key2: any) => {
        if (key1 == key2) {
          const control = form.controls[key2];

          control.valueChanges.subscribe(() => {
            if (control.value !== undefined && control.value !== null && control.value !== '') {
              switch (data[key1]) {
                // First letter capitalized
                case 'capitalize':
                  const firstLetter = control.value.slice(0, 1);
                  const newValue =
                    firstLetter.toUpperCase() +
                    control.value.slice(1, control.value.length).toLowerCase();
                  control.patchValue(newValue, {emitEvent: false});
                  break;

                // lowercased and uppercases with first letter capitalized
                case 'nameInput':
                  const firstC = control.value.slice(0, 1);
                  const newName =
                    firstC.toUpperCase() + control.value.slice(1, control.value.length);
                  control.patchValue(newName, {emitEvent: false});
                  break;

                // All letters lowercased
                case 'lower':
                  control.patchValue(control.value.toLowerCase(), {emitEvent: false});
                  break;

                // All letters uppercases
                case 'upper':
                  control.patchValue(control.value.toUpperCase(), {emitEvent: false});
                  break;

                default:
                  break;
              }
            }
          });
        }
      });
    });
  }

  public selectAddress(form: FormGroup, address: any) {
    const ret: Address = {
      address: address.formatted_address,
      streetNumber: this.retrieveAddressComponents(address.address_components, 'street_number', 'long_name'),
      streetName: this.retrieveAddressComponents(address.address_components, 'route', 'long_name'),
      city: this.retrieveAddressComponents(address.address_components, 'locality', 'long_name'),
      state: this.retrieveAddressComponents(
        address.address_components,
        'administrative_area_level_1',
        'short_name'
      ),
      stateShortName: this.retrieveAddressComponents(
        address.address_components,
        'administrative_area_level_1',
        'short_name'
      ),
      country: this.retrieveAddressComponents(address.address_components, 'country', 'short_name'),
      zipCode: this.retrieveAddressComponents(
        address.address_components,
        'postal_code',
        'long_name'
      ),
    };
    return ret;
  }

  public retrieveAddressComponents(addressArray: any, type: string, name: string) {
    if (!addressArray) {
      return '';
    }
    const res = addressArray.find((addressComponents: any) => addressComponents.types[0] === type);
    if (res !== undefined) {
      return res[name];
    } else {
      return '';
    }
  }



}
