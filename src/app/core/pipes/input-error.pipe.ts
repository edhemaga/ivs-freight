import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'inputError'
})
export class InputErrorPipe implements PipeTransform {

  transform(value: any, inputName?: string): string {
    let errorMessageValue: string = '';
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
      if(value['pattern'] && inputName.toLocaleLowerCase() === 'phone') {
        errorMessageValue = `Phone as (XXX) XXX-XXXX`
      }
      if(value['pattern'] && inputName.toLocaleLowerCase() === 'ssn') {
        errorMessageValue = `SSN as XXX-XX-XXXX`
      }
      if(value['pattern'] && inputName.toLocaleLowerCase() === 'ein') {
        errorMessageValue = `EIN as XX-XXXXXXX`
      }
      if(value['incorrect_address'] && inputName.toLocaleLowerCase() === 'address') {
        errorMessageValue = `Incorrect address`
      }
    }
    return errorMessageValue
  }

}
