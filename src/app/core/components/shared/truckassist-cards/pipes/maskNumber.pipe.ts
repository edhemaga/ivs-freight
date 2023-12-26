import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'maskNumber',
    standalone: true,
})
export class MaskNumberPipe implements PipeTransform {
    transform(value: string): string {
        const visibleDigits = 4;
        if (value.length <= visibleDigits) {
            // If the value length is less than or equal to the visible digits, return the value as it is
            return value;
        } else {
            const maskedValue =
                `<span class="masked">${'●'.repeat(
                    value.length - visibleDigits
                )}</span>` +
                `<span class="visible">${value.slice(-visibleDigits)}</span>`;
            return maskedValue;
        }
    }
}
