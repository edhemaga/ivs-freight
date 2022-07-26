import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'formatTime',
})
export class formatTimePipe implements PipeTransform {
  transform(time: string): any {
    if (time) {
      return moment(time).format('hh:mm A');
    }
  }
}
