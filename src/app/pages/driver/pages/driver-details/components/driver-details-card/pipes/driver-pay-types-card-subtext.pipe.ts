import { Pipe, PipeTransform } from '@angular/core';

// models
import { DriverDetailsPayrollResponse } from 'appcoretruckassist';

@Pipe({
    name: 'driverPayTypesCardSubtext',
    standalone: true,
})
export class DriverPayTypesCardSubtextPipe implements PipeTransform {
    transform(
        payType: string,
        solo: DriverDetailsPayrollResponse,
        team: DriverDetailsPayrollResponse,
        isOpenPayrollShared: boolean,
        isCardOpen: boolean,
        fleetType: string
    ): string {
        if (isCardOpen && isOpenPayrollShared) return 'Open Payroll Shared';

        if (!isCardOpen) {
            switch (payType) {
                case 'Per Mile':
                    return this.transformPerMile(solo, team);
                case 'Commission':
                    return this.transformCommission(solo, team, fleetType);
                default:
                    return this.transformFlatRate(solo, team, fleetType);
            }
        }
    }

    private transformPerMile(
        solo: DriverDetailsPayrollResponse,
        team: DriverDetailsPayrollResponse
    ): string {
        const soloOrTeam = solo.emptyMile || solo.perMile ? solo : team;

        const perMile =
            soloOrTeam.perMile ||
            `${soloOrTeam.emptyMile} / $${soloOrTeam.loadedMile}`;

        const perStop = soloOrTeam.perStop ? `/ $${soloOrTeam.perStop}` : '';

        return `$${perMile} ${perStop}`;
    }

    private transformCommission(
        solo: DriverDetailsPayrollResponse,
        team: DriverDetailsPayrollResponse,
        fleetType: string
    ): string {
        if (fleetType !== 'Combined') {
            const soloOrTeam = solo.commission ?? team.commission;

            return `${soloOrTeam}%`;
        } else {
            return `${solo.commission ? solo.commission + '% | ' : ''}${
                team.commission ? team.commission + '%' : ''
            } `;
        }
    }

    private transformFlatRate(
        solo: DriverDetailsPayrollResponse,
        team: DriverDetailsPayrollResponse,
        fleetType: string
    ): string {
        if (fleetType !== 'Combined') {
            const soloOrTeam = solo.flatRate ?? team.flatRate;

            return `$${soloOrTeam}`;
        } else {
            return `${solo.flatRate ? solo.flatRate + '% | ' : ''}${
                team.flatRate ? team.flatRate + '%' : ''
            } `;
        }
    }
}
