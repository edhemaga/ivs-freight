import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fuelTotal'
})
export class FuelTotalPipe implements PipeTransform {
  transform(array: { id: number; value: number }[], args?: any): number {
    return array.reduce((accumulator, item) => {
      return accumulator + item.value;
    }, 0);
  }

}
