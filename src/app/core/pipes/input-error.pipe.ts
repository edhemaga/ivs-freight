import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'inputError'
})
export class InputErrorPipe implements PipeTransform {

  transform(value: any, inputName?: string): string {
    console.log(inputName)
    console.log(value)
    let errorMessageValue: string = '';
    if (value !== null) {
     
      if (value['required']) {
        errorMessageValue = 'Required';
      }

      if (value['invalid']) {
        errorMessageValue = 'Invalid';
      }

      if(value['minlength']) {
        errorMessageValue = `Minimum required length is ${value.minlength.requiredLength}`
      }
      if(value['maxlength']) {
        errorMessageValue = `Maximum possible characters is ${value.maxlength.requiredLength}`
      }
      if(value['pattern']?.requiredPattern) {
        switch(inputName.toLowerCase()) {
          case 'phone': {
            errorMessageValue = `Phone as (XXX) XXX-XXXX`
            break;
          }
          case 'ssn': {
            errorMessageValue = `SSN as XXX-XX-XXXX`
            break;
          }
          case 'ein': {
            errorMessageValue = `EIN as XX-XXXXXXX`
            break;
          }
          default: {
            errorMessageValue = `Invalid`
            break;
          }
        }
      }
    }
    return errorMessageValue
  }

}
