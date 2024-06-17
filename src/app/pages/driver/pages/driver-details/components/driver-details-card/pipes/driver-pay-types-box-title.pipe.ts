import { Pipe, PipeTransform } from '@angular/core';

// models
import { DriverDetailsPayrollResponse } from 'appcoretruckassist';

@Pipe({
    name: 'driverPayTypesBoxTitle',
    standalone: true,
})
export class DriverPayTypesBoxTitlePipe implements PipeTransform {
    transform(
        payType: string,
        fleetType: string,
        solo: DriverDetailsPayrollResponse
    ): string {
        switch (payType) {
            case 'Per Mile':
                if (fleetType === 'Combined') {
                    return !solo.perMile ? 'Empty (Solo)' : 'Per Mile (Solo)';
                } else {
                    return !solo.perMile ? 'Empty' : 'Per Mile';
                }
            case 'Commission':
                return fleetType === 'Combined' ? 'Solo' : 'Commission';
            default:
                return fleetType === 'Combined' ? 'Solo' : 'Flat Rate';
        }
    }
}
