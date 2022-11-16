import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'getExpireData',
})
export class GetExpireDataPipe implements PipeTransform {
   transform(expireData: Date): Date {
      if (expireData) {
         const newDate = new Date(expireData ? expireData : '');
         newDate.setFullYear(newDate.getFullYear() + 1);
         return newDate;
      } else {
         return undefined;
      }
   }
}
