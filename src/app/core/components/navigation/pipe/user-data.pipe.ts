import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'userData',
})
export class UserDataPipe implements PipeTransform {
  transform(value: any): any {
    return value.hasOwnProperty('companyName');
  }
}
