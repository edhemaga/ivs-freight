import { Pipe, PipeTransform } from '@angular/core';

// moment
import moment from 'moment';

@Pipe({
    name: 'formatTime',
    standalone: true,
})
export class FormatTimePipe implements PipeTransform {
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
