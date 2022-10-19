import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'loadStopTimeDate',
})
export class LoadStopTimeDatePipe implements PipeTransform {
  transform(value_1: any, value_2: any): any {
    if (!value_1) {
      return '';
    }

    if (!value_2) {
      return value_1;
    }

    return `${value_1} - ${value_2}`;
  }
}
