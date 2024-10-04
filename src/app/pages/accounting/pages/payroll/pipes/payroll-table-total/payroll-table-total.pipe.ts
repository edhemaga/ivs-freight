import { Pipe, PipeTransform } from '@angular/core';
import {
    LoadWithMilesStopResponse,
    MilesStopShortResponse,
} from 'appcoretruckassist';

@Pipe({
    name: 'payrollTableTotal',
})
export class PayrollTableTotalPipe implements PipeTransform {
    transform(includedLoads: LoadWithMilesStopResponse[]): {
        empty: string;
        loaded: string;
        miles: string;
        subtotal: string;
    } {
        let allInculdedLoads: MilesStopShortResponse[] = [];
        includedLoads.map(
            (loads) =>
                (allInculdedLoads = [...allInculdedLoads, ...loads.milesStops])
        );

        const result = allInculdedLoads.reduce(
            (prev, current) => {
                prev.empty += current.empty;
                prev.loaded += current.loaded;
                prev.miles += current.miles;
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
