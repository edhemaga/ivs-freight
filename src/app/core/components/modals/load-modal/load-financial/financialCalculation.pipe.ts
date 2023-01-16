import { Pipe, PipeTransform } from '@angular/core';
import { convertThousanSepInNumber } from '../../../../utils/methods.calculations';

@Pipe({
    name: 'financialCalculation',
})
export class FinancialCalculationPipe implements PipeTransform {
    transform(item: any, type: string): number {
        let sum = 0;
        if (type === 'billing') {
            Object.values(item).map((val: string) => {
                if (val) {
                    sum += val == '0' ? 0 : convertThousanSepInNumber(val);
                }
            });
        }

        if (type === 'payment') {
            Object.entries(item).map((key1: any, _: any) => {
                if (key1[0] === 'shortPaid') {
                    if (key1[1]?.length) {
                        for (const [key2, _] of Object.entries(item[key1[0]])) {
                        }
                    }
                } else {
                    sum +=
                        key1[1] == '0' ? 0 : convertThousanSepInNumber(key1[1]);
                }
            });
        }
        return sum;
    }
}
