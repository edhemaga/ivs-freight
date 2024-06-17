import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'driverPayTypesCardName',
    standalone: true,
})
export class DriverPayTypesCardNamePipe implements PipeTransform {
    transform(payType: string): string {
        switch (payType) {
            case 'Per Mile':
                return 'Mileage Pay';
            case 'Commission':
                return 'Commission Pay';
            default:
                return 'Flat Rate Pay';
        }
    }
}
