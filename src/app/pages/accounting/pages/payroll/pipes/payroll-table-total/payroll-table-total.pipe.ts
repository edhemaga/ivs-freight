import { Pipe, PipeTransform } from '@angular/core';
import { MilesStopShortResponse, PerMileEntity } from 'appcoretruckassist';

@Pipe({
    name: 'payrollTableTotal',
})
export class PayrollTableTotalPipe implements PipeTransform {
    transform(
        includedLoads: MilesStopShortResponse[],
        payPerMile: PerMileEntity
    ): {
        empty: string;
        loaded: string;
        miles: string;
        subtotal: string;
    } {
        const result = includedLoads.reduce(
            (prev, current) => {
                prev.empty = current.empty * payPerMile.emptyMile;
                prev.loaded = current.loaded * payPerMile.loadedMile;
                prev.miles = current.miles * payPerMile.perStop;
                prev.subtotal += current.subtotal;
                return prev;
            },
            { empty: 0, loaded: 0, miles: 0, subtotal: 0 }
        );

        return {
            empty: result.empty.toFixed(2),
            loaded: result.loaded.toFixed(2),
            miles: result.miles.toFixed(2),
            subtotal: result.subtotal.toFixed(2),
        };
    }
}
