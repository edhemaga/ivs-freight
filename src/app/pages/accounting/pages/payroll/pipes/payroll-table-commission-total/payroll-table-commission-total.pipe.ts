import { Pipe, PipeTransform } from '@angular/core';
import { PayrollLoadMinimalResponse } from 'appcoretruckassist';

@Pipe({
    name: 'payrollTableCommissionTotal',
})
export class PayrollTableCommissionTotalPipe implements PipeTransform {
    transform(
        includedLoads: PayrollLoadMinimalResponse[],
        payPerMile: number
    ): {
        empty: string;
        loaded: string;
        miles: string;
        subtotal: string;
        revenue: string;
    } {
        const result = includedLoads.reduce(
            (prev, current) => {
                prev.emptyMiles = current.emptyMiles * payPerMile;
                prev.loadedMiles = current.loadedMiles * payPerMile;
                prev.totalMiles = current.totalMiles * payPerMile;
                prev.revenue = current.revenue * payPerMile;
                prev.subtotal += current.subtotal;
                return prev;
            },
            {
                emptyMiles: 0,
                loadedMiles: 0,
                totalMiles: 0,
                subtotal: 0,
                revenue: 0,
            }
        );

        return {
            empty: result.emptyMiles.toFixed(2),
            loaded: result.loadedMiles.toFixed(2),
            miles: result.totalMiles.toFixed(2),
            subtotal: result.subtotal.toFixed(2),
            revenue: result.revenue.toFixed(2),
        };
    }
}
