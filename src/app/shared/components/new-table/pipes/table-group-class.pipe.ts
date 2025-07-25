import { Pipe, PipeTransform } from '@angular/core';

// interfaces
import { ITableColumn } from '@shared/components/new-table/interfaces';

@Pipe({
    name: 'tableGroupClass',
    standalone: true,
})
export class TableGroupClassPipe implements PipeTransform {
    transform({
        column,
        isTableLocked,
    }: {
        column: ITableColumn;
        isTableLocked: boolean;
    }): object {
        const { columns, isAlignedRight } = column;

        const hasCheckedColumn = columns.some((column) => column.isChecked);

        return {
            'p-l-6': hasCheckedColumn && isTableLocked && !isAlignedRight,
            'border-left-light-grey-6': hasCheckedColumn && isTableLocked,
            'cursor-grab': !isTableLocked,
        };
    }
}
