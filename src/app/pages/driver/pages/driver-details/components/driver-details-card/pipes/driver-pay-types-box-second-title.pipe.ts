import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'driverPayTypesBoxSecondTitle',
    standalone: true,
})
export class DriverPayTypesBoxSecondTitlePipe implements PipeTransform {
    transform(payType: string, fleetType: string): string {
        switch (payType) {
            case 'Per Mile':
                return fleetType === 'Combined' ? 'Loaded (Solo)' : 'Loaded';
            case 'Commission':
                return fleetType === 'Combined' ? 'Team' : 'Commission';
            default:
                return fleetType === 'Combined' ? 'Team' : 'Flat Rate';
        }
    }
}
