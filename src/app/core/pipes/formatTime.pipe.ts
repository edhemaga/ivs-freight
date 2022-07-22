import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'formatTimeP',
})
export class formatTimePipe implements PipeTransform {
  transform(date: string): any {
    return moment(date).format('hh:mm A');
  }
}
