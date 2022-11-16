import { Pipe } from '@angular/core';

@Pipe({
  name: 'formatPhoneP',
})
export class formatPhonePipe {
  transform(phone: string) {
    if (phone) {
      const number = phone?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      return number;
    }
  }
}
