import { Pipe, PipeTransform } from '@angular/core';

// const
import { DashboardConstants } from '../utils/constants';

//enums
import { CurrencyValuesEnum } from '../enums';

@Pipe({
    name: 'conditionalMoneyFilter',
    standalone: true,
})
export class ConditionalMoneyFilterPipe implements PipeTransform {
    transform(valueString: string, activeTabName: string): string {
        //TODO: Bogdan - implement this pipe also on topRated
        const value = parseFloat(valueString);
        
        if(isNaN(value)) {
            return valueString;
        }
        
        const dollarSign = DashboardConstants.DOLLAR_SIGN;

        if (Object.values(CurrencyValuesEnum).includes(activeTabName as CurrencyValuesEnum) && value) {
            if (value >= 1000000) {
                return (
                    dollarSign + (value / 1000000).toFixed(2) + DashboardConstants.MILLION_SIGN
                );
            } else if (value >= 10000) {
                return (
                    dollarSign + (value / 1000).toFixed(2) + DashboardConstants.THOUSAND_SIGN
                );
            } else {
                return dollarSign + value;
            }
        }

        return value.toString();
    }
}
