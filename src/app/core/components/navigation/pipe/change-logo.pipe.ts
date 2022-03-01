import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeLogo',
})
export class ChangeLogoPipe implements PipeTransform {
  transform(value: boolean): string {
    return !value
      ? 'assets/img/svgs/navigation/ic_truckassist_logo_short.svg'
      : 'assets/img/svgs/navigation/ic_truckassist_logo_long.svg';
  }
}
