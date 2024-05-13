import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatMiles',
    standalone: true,
})
export class FormatMilesPipe implements PipeTransform {
    transform(value: number): string {
        if (value) {
            const formattedNumber = value.toLocaleString() as string;

            return formattedNumber;
        } else {
            return '';
        }
    }
}
