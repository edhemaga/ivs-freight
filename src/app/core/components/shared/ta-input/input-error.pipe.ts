import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputError',
})
export class InputErrorPipe implements PipeTransform {
  transform(value: any, inputName?: string): string {
    let errorMessageValue: string = '';
    if (value !== null) {
      if (value['required']) {
        errorMessageValue = 'Required';
      }

      if (value['invalid']) {
        errorMessageValue = 'Invalid';
      }

      if (value['minlength']) {
        errorMessageValue = `${value['minlength'].requiredLength} Characters Minimum`;
      }
      if (value['maxlength']) {
        errorMessageValue = `${value['maxlength'].requiredLength} Characters Maximum`;
      }
      if (value['pattern']?.requiredPattern) {
        switch (inputName.toLowerCase()) {
          case 'phone': {
            // errorMessageValue = `Phone as (XXX) XXX-XXXX`
            errorMessageValue = 'Invalid';
            break;
          }
          case 'ssn': {
            // errorMessageValue = `SSN as XXX-XX-XXXX`
            errorMessageValue = 'Invalid';
            break;
          }
          case 'ein': {
            // errorMessageValue = `EIN as XX-XXXXXXX`
            errorMessageValue = 'Invalid';
            break;
          }
          default: {
            errorMessageValue = `Invalid`;
            break;
          }
        }
      }
    }
    return errorMessageValue;
  }
}
