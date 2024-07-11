import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'loadTimeType',
    standalone: true
})
export class LoadTimeTypePipe implements PipeTransform {
    transform(value: string): string {
        if (value) {
            const formattedTime = moment(value, 'HH:mm').format('hh:mm A');
            return formattedTime;
        }

        return '';
    }
}
