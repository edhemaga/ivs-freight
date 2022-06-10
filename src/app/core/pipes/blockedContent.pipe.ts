import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blockedContent',
})
export class BlockedContentPipe implements PipeTransform {
  transform(value: string): boolean {
    if (
      [
        'login',
        'register',
        'thank you',
        'account activated',
        'forgot password',
        'check email',
        'create new password',
        'password changed',
        'register user',
      ].includes(value.toLowerCase())
    ) {
      return true;
    }
    return false;
  }
}
