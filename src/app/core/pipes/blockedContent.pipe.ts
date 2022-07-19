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
        'helper component route',
        'welcome screen',
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
        'medical certificate',
        'mvr authorization',
        'psp authorization',
        'sph',
        'hos rules',
        'ssn card',
        'cdl card',
        'end screen',
      ].includes(value?.toLowerCase())
    ) {
      return true;
    }
    return false;
  }
}
