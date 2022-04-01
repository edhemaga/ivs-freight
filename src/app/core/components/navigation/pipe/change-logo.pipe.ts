import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changeLogo',
})
export class ChangeLogoPipe implements PipeTransform {
  transform(value: boolean): string {
    return !value
      ? 'assets/svg/common/ic_truckassist_logo_short.svg'
      : 'assets/svg/common/ic_truckassist_logo_long.svg';
  }
}
