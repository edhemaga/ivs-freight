import { Pipe, PipeTransform } from '@angular/core';

// types
import { SortOrder } from 'appcoretruckassist';

@Pipe({
    name: 'tableColumnClass',
    standalone: true,
})
export class TableColumnClassPipe<
    T extends { sort?: string; direction?: SortOrder | null },
> implements PipeTransform
{
    transform(args: {
        column: T;
        isTableLocked: boolean;
        isGroup: boolean;
        isEmptyTable: boolean;
    }): object {
        const { column, isTableLocked, isGroup, isEmptyTable } = args;
        return {
            'text-color-bw6-2': !column.sort || !column.direction,
            'c-pointer new-table--row-heading-sortable':
                column.sort && !isTableLocked && !isEmptyTable,
            'text-hover-black':
                column.sort &&
                !isTableLocked &&
                !column.direction &&
                !isEmptyTable,
            'new-table--row-heading-sorting-active text-color-blue-13 svg-fill-blue-13 text-hover-blue-18 svg-hover-blue-18':
                column.direction && !isTableLocked,
            'new-table--row-heading-unlocked  justify-content-between':
                isTableLocked,
            'flex-column align-items-start mt-auto': isGroup,
            'align-items-end': !isGroup,
        };
    }
}
