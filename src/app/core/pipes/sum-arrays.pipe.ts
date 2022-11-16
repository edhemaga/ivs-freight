import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
   name: 'sumArrays',
})
export class SumArraysPipe implements PipeTransform {
   transform(array: { id: number; value: number }[], args?: any): number {
      return array.reduce((accumulator, item: any) => {
         return accumulator + parseInt(item.value);
      }, 0);
   }
}
