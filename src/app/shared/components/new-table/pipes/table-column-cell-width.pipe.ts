import { Pipe, PipeTransform } from '@angular/core';

// enums
import { eUnit } from 'ca-components';

// interfaces
import { ITableColumn } from '@shared/components/new-table/interfaces';

@Pipe({
    name: 'tableColumnCellWidth',
    standalone: true,
})
export class TableColumnCellWidthPipe implements PipeTransform {
    transform({
        column,
        isTableLocked,
    }: {
        column: ITableColumn;
        isTableLocked: boolean;
    }): object {
        const { minWidth, width, isUniqueColumn } = column;

        const columnWidth = width + eUnit.PX;

        return {
            width:
                !isTableLocked && isUniqueColumn
                    ? 'calc(' + columnWidth + ' - 9px)'
                    : columnWidth,
            'min-width': minWidth + eUnit.PX,
        };
    }
}
