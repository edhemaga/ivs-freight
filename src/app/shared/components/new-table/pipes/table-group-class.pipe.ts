import { Pipe, PipeTransform } from '@angular/core';

// interfaces
import { ITableColumn } from '@shared/components/new-table/interface';

@Pipe({
    name: 'tableGroupClass',
    standalone: true,
})
export class TableGroupClassPipe implements PipeTransform {
    transform(groupColumn: ITableColumn, isTableLocked: boolean): object {
        const { columns, isAlignedRight } = groupColumn;

        const hasCheckedColumn = columns.some((column) => column.isChecked);

        return {
            'p-l-6': !isAlignedRight,
            'border-left-light-grey-6': hasCheckedColumn && isTableLocked,
        };
    }
}
