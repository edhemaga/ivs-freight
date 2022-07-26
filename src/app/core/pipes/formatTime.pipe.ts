import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'formatTimeP',
})
export class formatTimePipe implements PipeTransform {
  transform(time: string): any {
    if (time) {
      return moment(time).format('hh:mm A');
    }
  }
}
