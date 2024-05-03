import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tableDoubleHeadingText', standalone: true })
export class TableDoubleHeadingTextPipe implements PipeTransform {
    transform(tableHeadTitle: string): string {
        return tableHeadTitle === 'PRIMARY '
            ? 'PHONE'
            : tableHeadTitle === 'PRIMARY'
            ? 'EMAIL'
            : tableHeadTitle === 'REPAIR SHOP'
            ? 'MVR'
            : tableHeadTitle === 'TYPE '
            ? 'OWNER'
            : tableHeadTitle === 'NAME '
            ? 'BANK'
            : tableHeadTitle === 'NUMBER '
            ? 'FUEL CARD'
            : tableHeadTitle === 'NUMBER'
            ? 'CDL'
            : tableHeadTitle === 'ISSUED'
            ? 'TEST'
            : tableHeadTitle === 'GENERAL'
            ? 'NOTIFICATION'
            : tableHeadTitle === 'TRUCK'
            ? 'ASSIGNED'
            : tableHeadTitle === 'NAME  '
            ? 'EMERGENCY CONTACT'
            : 'MVR';
    }
}
