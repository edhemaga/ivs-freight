import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'sumArrays'
})
export class SumArraysPipe implements PipeTransform {
  transform(array: { id: number; value: number }[], args?: any): number {
    console.log("PIPE")
    console.log(array)
    console.log(array.reduce((accumulator, item: any) => {
      return accumulator + parseInt(item.value);
    }, 0))
    return array.reduce((accumulator, item: any) => {
      return accumulator + parseInt(item.value);
    }, 0);
  }

}
