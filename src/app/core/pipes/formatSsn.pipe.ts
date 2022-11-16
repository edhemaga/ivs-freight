import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'formatSsnP',
})
export class formatSsnPipe implements PipeTransform {
   transform(ssn: string) {
      if (ssn) {
         const number = ssn?.replace(/(^\d{3})(\d{2})(\d{4}$)/, '$1-$2-$3');
         return number;
      }
   }
}
