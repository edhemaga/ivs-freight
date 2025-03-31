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
    }): object {
        const { column, isTableLocked, isGroup } = args;

        return {
            'c-pointer new-table--row-heading-sortable':
                column.sort && !isTableLocked,
            'new-table--row-heading-sorting-active':
                column.direction && !isTableLocked,
            'new-table--row-heading-unlocked c-pointer justify-content-between':
                isTableLocked,
            'flex-column align-items-start mt-auto': isGroup,
            'align-items-end': !isGroup,
        };
    }
}
