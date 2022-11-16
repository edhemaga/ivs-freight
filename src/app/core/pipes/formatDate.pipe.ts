import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

@Pipe({
   name: 'formatDateP',
})
export class formatDatePipe implements PipeTransform {
   transform(date: string, template?: string): any {
      switch (template) {
         case 'short-format': {
            return moment(date).format('MM/YY');
         }
         case 'month-format': {
            return moment(date, 'YYYY-MM-DDTHH:mm:ss.SSS[Z]').format(
               'MMMM DD, YYYY | hh:mm A'
            );
         }
         case 'difference-days': {
            let a = moment();
            let b = moment(date);
            let diff = a.diff(b, 'days');
            if (diff < 1) {
               return 'Today';
            } else {
               return diff + (diff == 1 ? ' day' : ' days');
            }
         }
         default: {
            return moment(date).format('MM/DD/YY');
         }
      }
   }
}
