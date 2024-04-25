import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'numberOrdinal',
    standalone: true,
})
export class NumberOrdinalPipe implements PipeTransform {
    transform(value: number): string {
        if (isNaN(value) || value < 1) {
            return '';
        }

        const suffixes = ['th', 'st', 'nd', 'rd'];
        const v = value % 100;
        return value + (suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0]);
    }
}
