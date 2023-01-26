import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'loadDatetimeRange',
})
export class LoadDatetimeRangePipe implements PipeTransform {
    transform(value: string, secondValue: string): any {
        if (secondValue) {
            console.log('value - second: ', value, secondValue);
            return `${value} - ${secondValue}`;
        }
        return value;
    }
}
