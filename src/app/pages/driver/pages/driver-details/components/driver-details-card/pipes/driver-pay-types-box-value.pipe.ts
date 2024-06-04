import { Pipe, PipeTransform } from '@angular/core';

// models
import { DriverDetailsPayrollResponse } from 'appcoretruckassist';

@Pipe({
    name: 'driverPayTypesBoxValue',
    standalone: true,
})
export class DriverPayTypesBoxValuePipe implements PipeTransform {
    transform(
        payType: string,
        fleetType: string,
        solo: DriverDetailsPayrollResponse,
        team: DriverDetailsPayrollResponse
    ): string {
        switch (payType) {
            case 'Per Mile':
                if (fleetType === 'Combined') {
                    return `$${solo.perMile ?? solo.emptyMile}`;
                } else {
                    return `$${
                        fleetType === 'Solo'
                            ? solo.perMile ?? solo.emptyMile
                            : team.perMile ?? team.emptyMile
                    }`;
                }
            case 'Commission':
                if (fleetType !== 'Combined') {
                    const soloOrTeam = solo.commission ?? team.commission;

                    return `${soloOrTeam}%`;
                } else {
                    return `${solo.commission}%`;
                }

            default:
                if (fleetType !== 'Combined') {
                    const soloOrTeam = solo.flatRate ?? team.flatRate;

                    return `$${soloOrTeam}`;
                } else {
                    return `$${solo.flatRate}`;
                }
        }
    }
}
