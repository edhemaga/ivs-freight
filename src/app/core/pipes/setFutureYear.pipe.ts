import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
   name: 'setFutureYear',
})
export class setFutureYear implements PipeTransform {
   transform(date: string) {
      if (date) {
         return moment(date).add(1, 'years').format('MM/DD/YY');
      }
   }
}
