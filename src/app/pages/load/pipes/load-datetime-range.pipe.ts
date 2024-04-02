import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'loadDatetimeRange',
    standalone: true
})
export class LoadDatetimeRangePipe implements PipeTransform {
    transform(value: string, secondValue: string): any {
        if (secondValue) {
            return `${value} - ${secondValue}`;
        }
        return value;
    }
}
