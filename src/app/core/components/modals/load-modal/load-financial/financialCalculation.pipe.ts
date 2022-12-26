import { Pipe, PipeTransform } from '@angular/core';
import { convertThousanSepInNumber } from '../../../../utils/methods.calculations';

@Pipe({
    name: 'financialCalculation',
})
export class FinancialCalculationPipe implements PipeTransform {
    transform(item: any, args?: any): any {
        let sum = 0;
        console.log('pipe: ', item);

        Object.values(item).map((val: string) => {
            if (val) {
                sum += convertThousanSepInNumber(val);
            }
        });

        console.log('sum: ', sum);
        return sum;
    }
}
