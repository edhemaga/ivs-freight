import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'loadTimeType',
    standalone: true
})
export class LoadTimeTypePipe implements PipeTransform {
    transform(value: string): any {
        if (value) {
            const type = parseInt(value.split(':')[0]);
            return `${value} ${
                type ? (type >= 12 && type <= 23 ? 'PM' : 'AM') : ''
            }`;
        }

        return '';
    }
}
