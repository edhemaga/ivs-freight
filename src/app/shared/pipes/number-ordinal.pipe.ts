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
        const calculating_value = value % 100;
        return (
            value +
            (suffixes[(calculating_value - 20) % 10] ||
                suffixes[calculating_value] ||
                suffixes[0])
        );
    }
}
