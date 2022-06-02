import { Pipe } from '@angular/core';

@Pipe({
  name: 'formatSsnP',
})
export class formatSsnPipe {
  transform(ssn: string) {
    const value = ssn;
      const number = value?.replace(/(^\d{3})(\d{2})(\d{4}$)/, '$1-$2-$3');
      ssn = number;
      return number;
  }
}
