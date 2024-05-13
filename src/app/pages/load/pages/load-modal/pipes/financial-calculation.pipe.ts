import { Pipe, PipeTransform } from '@angular/core';

import { MethodsCalculationsHelper } from '@shared/utils/helpers/methods-calculations.helper';

@Pipe({
    name: 'financialCalculation',
    standalone: true,
})
export class FinancialCalculationPipe implements PipeTransform {
    transform(item: any, type: string): number {
        let sum = 0;
        if (type === 'billing') {
            Object.values(item).map((val: string) => {
                if (val) {
                    sum +=
                        val == '0'
                            ? 0
                            : MethodsCalculationsHelper.convertThousanSepInNumber(
                                  val
                              );
                }
            });
        }

        if (type === 'payment') {
            Object.entries(item).map((key1: any, _: any) => {
                if (key1[0] === 'shortPaid') {
                    if (key1[1]?.length) {
                        // eslint-disable-next-line no-unused-vars
                        for (const [key2, _] of Object.entries(item[key1[0]])) {
                        }
                    }
                } else {
                    sum +=
                        key1[1] == '0'
                            ? 0
                            : MethodsCalculationsHelper.convertThousanSepInNumber(
                                  key1[1]
                              );
                }
            });
        }
        return sum;
    }
}
