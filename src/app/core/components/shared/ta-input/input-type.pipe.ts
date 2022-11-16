import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inputType',
})
export class InputTypePipe implements PipeTransform {
  transform(type: string, value: boolean): any {
    if (type === 'password') {
      if (value) {
        return 'text';
      } else {
        return 'password';
      }
    }
    return type;
  }
}
