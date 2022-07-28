import { Pipe } from '@angular/core';

@Pipe({
  name: 'formatSsnP',
})
export class formatSsnPipe {
  transform(ssn: string) {
    if (ssn) {
      const number = ssn?.replace(/(^\d{3})(\d{2})(\d{4}$)/, '$1-$2-$3');
      return number;
    }
  }
}
