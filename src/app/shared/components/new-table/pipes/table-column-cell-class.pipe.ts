import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tableColumnCellClass',
    standalone: true,
})
export class TableColumnCellClassPipe implements PipeTransform {
    transform({
        isTableColumnCellColorClass,
        hasValue,
        hasPaddingLeft,
        hasMarginRight,
    }: {
        isTableColumnCellColorClass?: boolean;
        hasValue?: boolean;
        hasPaddingLeft?: boolean;
        hasMarginRight?: boolean;
    }): object | string {
        return isTableColumnCellColorClass
            ? hasValue
                ? 'text-color-black-2'
                : 'text-color-muted'
            : { 'p-l-7': hasPaddingLeft, 'm-r-7': hasMarginRight };
    }
}
