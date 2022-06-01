import { Pipe } from '@angular/core';

@Pipe({
  name: 'formatEinP',
})
export class formatEinPipe {
  transform(ein: string) {
    const value = ein;
      const number = value?.replace(/(^[1-9]\d?)(\d{7}$)/, '$1-$2');
      ein = number;
      return number;
  }
}
