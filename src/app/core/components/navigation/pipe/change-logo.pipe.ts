import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'changeLogo',
})
export class ChangeLogoPipe implements PipeTransform {
    transform(value: boolean): string {
        if (!value) {
            return 'assets/svg/applicant/ic_logo-light.svg';
        }
        return 'assets/svg/common/ic_logo-dark.svg';
    }
}
