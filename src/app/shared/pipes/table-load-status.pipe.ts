import { Pipe, PipeTransform } from '@angular/core';
import { LoadStatusStringEnum } from '@pages/load/pages/load-table/enums/load-status-string.enum';

@Pipe({
    standalone: true,
    name: 'tableLoadStatusPipe',
})
export class TableLoadStatusPipe implements PipeTransform {
    transform(text: string, search: string): string {
        if (search === LoadStatusStringEnum.TITLE) {
            if (
                text === LoadStatusStringEnum.TONU ||
                text === LoadStatusStringEnum.TONU_SHORT_PAID ||
                text === LoadStatusStringEnum.TONU_PAID
            ) {
                return '#DF3C3C';
            } else {
                return '#424242';
            }
        } else if (search === LoadStatusStringEnum.SUBTITLE) {
            if (
                text === LoadStatusStringEnum.INVOICED ||
                text === LoadStatusStringEnum.SHORT_PAID ||
                text === LoadStatusStringEnum.PAID
            ) {
                return '#919191';
            } else {
                return '#9E47EC';
            }
        } else if (search === LoadStatusStringEnum.DECORATION) {
            if (
                text === LoadStatusStringEnum.TONU ||
                text === LoadStatusStringEnum.TONU_SHORT_PAID ||
                text === LoadStatusStringEnum.TONU_PAID
            ) {
                return LoadStatusStringEnum.LINE_THROUGHT;
            } else {
                return LoadStatusStringEnum.DEFAULT;
            }
        }
    }
}
