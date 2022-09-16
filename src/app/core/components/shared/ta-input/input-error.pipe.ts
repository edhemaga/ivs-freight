import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputError',
})
export class InputErrorPipe implements PipeTransform {
  transform(value: any, inputName?: string): string {
    let errorMessageValue: string = '';
    console.log(value);
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

      if (value['oneuppercase']) {
        errorMessageValue = `At Least One Upper Case Character`;
      }

      if (value['onelowercase']) {
        errorMessageValue = `At Least One Lower Case Character`;
      }

      if (value['onedigit']) {
        errorMessageValue = `At Least One Digit`;
      }

      if (value['onesymbol']) {
        errorMessageValue = `At Least One Symbol/Special Character @$!%*#?&^_-`;
      }

      if (value['pattern']?.requiredPattern) {
        switch (inputName.toLowerCase()) {
          case 'phone': {
            errorMessageValue = 'Invalid';
            break;
          }
          case 'ssn': {
            errorMessageValue = 'Invalid';
            break;
          }
          case 'ein': {
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
