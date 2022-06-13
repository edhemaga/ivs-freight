import { Pipe } from '@angular/core';

@Pipe({
  name: 'formatPhoneP',
})
export class formatPhonePipe {
  transform(phone: string) {
    console.log(phone);
    
    const value = phone;
      const number = value?.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
      phone = number;
      return number;
  }
}
