import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'financialCalculation',
})
export class FinancialCalculationPipe implements PipeTransform {
    transform(item: any, args?: any): any {
        let sum = 0;
        switch (item.name) {
            case 'baseRate': {
                sum += item.billingValue;
                break;
            }
            case 'adjusted': {
                sum += item.billingValue;
                break;
            }
            case 'layover': {
                sum += item.billingValue;
                break;
            }
            case 'lumper': {
                sum += item.billingValue;
                break;
            }
            case 'fuelSurcharge': {
                sum += item.billingValue;
                break;
            }
            case 'escort': {
                sum += item.billingValue;
                break;
            }
            case 'detention': {
                sum += item.billingValue;
                break;
            }
            default: {
                break;
            }
        }
        console.log('sum: ', sum);
        return sum;
    }
}
