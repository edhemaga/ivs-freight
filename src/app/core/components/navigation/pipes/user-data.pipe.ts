import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'userData',
    standalone: true
})
export class UserDataPipe implements PipeTransform {
    transform(value: any): any {
        return value.hasOwnProperty('companyName');
    }
}
