import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dynamicNavHeight',
})
export class DynamicNavHeightPipe implements PipeTransform {
  transform(value: any, hover: boolean): any {
    console.log('dynamic value: ', value);
    console.log('hover value: ', hover);
    return hover ? (value + 1) * 29 : 0;
  }
}
