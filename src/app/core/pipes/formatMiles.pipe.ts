import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatNumberMi',
    standalone: true, // Set to true if the pipe is stateless
})
export class FormatNumberMiPipe implements PipeTransform {
    transform(value: number): string {
        if (value) {
            const formattedNumber = value.toLocaleString() as string;

            return formattedNumber;
        } else {
            return '';
        }
    }
}
