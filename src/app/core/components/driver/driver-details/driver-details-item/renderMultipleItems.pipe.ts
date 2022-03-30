import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'renderMultipleItems',
})
export class RenderMultipleItemsPipe implements PipeTransform {

  transform(value: string, arg: boolean): string {
    if(arg) {
      return value.toString().trim().replace(/,/g, '\n').trim();
    }
    return value.toString().trim().replace(/,/g, ', ');
  }
}
