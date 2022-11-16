import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
    name: 'formatTime',
})
export class formatTimePipe implements PipeTransform {
    transform(time: string, template?: string): any {
        switch (template) {
            case 'hours-min': {
                return moment(time).format('hh:mm');
            }
            default: {
                return moment(time).format('hh:mm A');
            }
        }
    }
}
