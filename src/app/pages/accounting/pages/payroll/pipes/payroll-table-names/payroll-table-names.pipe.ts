import { Pipe, PipeTransform } from '@angular/core';

const payrollNamesData = {
    soloMiles: 'Driver (Mile)',
    soloFlatRate: 'Driver (Flat Rate)',
    soloCommission: 'Driver (Commission)',
    owner: 'Owner',
    teamCommission: 'Team Commission',
    teamFlatRate: 'Flat Rate',
    teamMiles: 'Team Miles',
};

@Pipe({
    name: 'payrollTableNames',
})
export class PayrollTableNamesPipe implements PipeTransform {
    transform(title: string, expanded): string {
        if (title in payrollNamesData) {
            return payrollNamesData[title];
        }
        return 'test';
    }
}
