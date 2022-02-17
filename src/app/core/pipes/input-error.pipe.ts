import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'inputError'
})
export class InputErrorPipe implements PipeTransform {

  transform(value: any): string {
    let errorMessageValue: string = '';

    if (value !== null) {
      if (value['invalid'] === true) {
        errorMessageValue = 'Invalid';
      }
      if (value['email'] === true) {
        errorMessageValue = 'Invalid';
      }
      if (value['required'] === true) {
        errorMessageValue = 'Required';
      }
    }
    return errorMessageValue
  }

}
