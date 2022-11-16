import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'nameInitials',
})
export class NameInitialsPipe implements PipeTransform {
  constructor() {}

  transform(fullName: any) {
    if (fullName !== null && fullName !== undefined) {
      const initials = fullName
        .split(' ')
        .map((x) => x.charAt(0))
        .join('')
        .substr(0, 2)
        .toUpperCase();
      return initials;
    } else {
      return '';
    }
  }
}
