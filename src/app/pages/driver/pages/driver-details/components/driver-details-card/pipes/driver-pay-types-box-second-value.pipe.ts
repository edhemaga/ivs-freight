import { Pipe, PipeTransform } from '@angular/core';

// models
import { DriverDetailsPayrollResponse } from 'appcoretruckassist';

@Pipe({
    name: 'driverPayTypesBoxSecondValue',
    standalone: true,
})
export class DriverPayTypesBoxSecondValuePipe implements PipeTransform {
    transform(
        payType: string,
        solo: DriverDetailsPayrollResponse,
        team: DriverDetailsPayrollResponse
    ): string {
        switch (payType) {
            case 'Per Mile':
                return `$${solo.loadedMile ?? team.loadedMile}`;
            case 'Commission':
                return `${team.commission}%`;
            default:
                return `$${team.flatRate}`;
        }
    }
}
