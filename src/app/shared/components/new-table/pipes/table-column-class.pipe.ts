import { Pipe, PipeTransform } from '@angular/core';

// types
import { SortOrder } from 'appcoretruckassist';

@Pipe({
    name: 'tableColumnClass',
    standalone: true,
})
export class TableColumnClassPipe<
    T extends {
        hasSort: string;
        direction?: SortOrder | null;
    },
> implements PipeTransform
{
    transform(args: {
        column: T;
        isTableLocked: boolean;
        isGroup: boolean;
        isEmptyTable: boolean;
        isAlignedRight: boolean;
    }): object {
        const { column, isTableLocked, isGroup, isEmptyTable, isAlignedRight } =
            args;

        return {
            'text-color-bw6-2': !column?.hasSort || !column?.direction,
            'text-hover-black svg-fill-black':
                column?.hasSort &&
                isTableLocked &&
                !isEmptyTable &&
                !column?.direction,
            'c-pointer new-table--row-heading-sortable':
                column?.hasSort && isTableLocked && !isEmptyTable,
            'text-color-blue-18 text-hover-blue-15 svg-fill-blue-13 svg-hover-blue-18':
                column?.direction && isTableLocked,
            'flex-column align-items-start mt-auto': isGroup && !isAlignedRight,
            'align-items-end': !isGroup,
            'disable-text-selection': !isTableLocked,
            'justify-content-end m-l-4': isAlignedRight && isTableLocked,
            'justify-content-start ml-0': isAlignedRight && !isTableLocked,
        };
    }
}
