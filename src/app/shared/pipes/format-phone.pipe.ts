import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'formatPhoneP',
    standalone: true,
})
export class FormatPhonePipe implements PipeTransform {
    transform(phone: string) {
        if (phone) {
            const number = phone?.replace(
                /(\d{3})(\d{3})(\d{4})/,
                '($1) $2-$3'
            );
            return number;
        }
    }
}
