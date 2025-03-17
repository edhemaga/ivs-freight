import { Pipe, PipeTransform } from '@angular/core';

// enum
import { eUnit } from 'ca-components';

@Pipe({
    name: 'unitPosition',
    standalone: true,
})
export class UnitPositionPipe implements PipeTransform {
    transform(value: string, indicator: string): string {
        switch (indicator) {
            case eUnit.DOLLAR_SIGN:
                return `${indicator}${value}`;
            case eUnit.GALLON:
            case eUnit.MILE:
                return `${value} ${indicator}`;
            default:
                return `${value}`;
        }
    }
}
