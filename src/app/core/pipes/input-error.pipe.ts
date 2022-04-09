import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'inputError'
})
export class InputErrorPipe implements PipeTransform {

  transform(value: any): string {
    let errorMessageValue: string = '';
    console.log("ERRORS")
    console.log(value)
    if (value !== null) {
      if(value['minlength']) {
        errorMessageValue = `Minimum required length is ${value.minlength.requiredLength}`
      }
      if(value['maxlength']) {
        errorMessageValue = `Maximum possible characters is ${value.maxlength.requiredLength}`
      }
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
