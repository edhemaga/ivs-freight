import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatEinP',
})
export class formatEinPipe implements PipeTransform {
  transform(ein: string) {
    if (ein) {
      const number = ein?.replace(/(^[1-9]\d?)(\d{7}$)/, '$1-$2');
      return number;
    }
  }
}
