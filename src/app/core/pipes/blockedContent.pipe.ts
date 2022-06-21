import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'blockedContent',
})
export class BlockedContentPipe implements PipeTransform {
  transform(value: string): boolean {
    console.log(value);
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
        'helper component route',
        'personal info',
        'work experience',
        'cdl information',
        'accident records',
        'traffic violations',
        'education',
        'days hos',
        'drug and alchocol statement',
        'driver rights',
        'disclosure and release',
        'authorization',
      ].includes(value?.toLowerCase())
    ) {
      return true;
    }
    return false;
  }
}
