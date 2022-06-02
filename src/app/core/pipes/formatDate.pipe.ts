import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
  name: 'formatDateP',
})
export class formatDatePipe implements PipeTransform {
  transform(date: string) {
    return moment(date).format('MM/DD/YY');
  }
}
