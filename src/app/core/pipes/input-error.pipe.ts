import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'inputError'
})
export class InputErrorPipe implements PipeTransform {

  transform(value: any): string {
    let errorMessageValue: string = '';

    if (value !== null) {
      if (value['invalid']) {
        errorMessageValue = 'Invalid';
      }
      if (value['email']) {
        errorMessageValue = 'Invalid';
      }
      if (value['required']) {
        errorMessageValue = 'Required';
      }
    }
    return errorMessageValue
  }

}
