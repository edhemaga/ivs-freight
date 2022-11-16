import { Injectable } from '@angular/core';

@Injectable()
export class DateFormatter {
   constructor() {}

   /**
    * Format date function
    *
    * @param date String
    */
   static formatDate(date: string) {
      let result = null;
      if (date) {
         result = new Date(JSON.parse('"' + date + '"'));
      }
      return result;
   }

   /**
    * Fix date function
    * @param date
    */
   static fixDate(date: any): { year: string; month: string; day: string } {
      let result = { year: '', month: '', day: '' };
      if (date) {
         const year = date.getFullYear();
         const month = date.toLocaleString().split('/')[1];
         const day = date.toLocaleString().split('/')[0];

         result = {
            year,
            month,
            day,
         };
      }
      return result;
   }
}
