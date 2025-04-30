import { Pipe, PipeTransform } from '@angular/core';

// interfaces
import { ITableColumn } from '@shared/components/new-table/interfaces';

@Pipe({
    name: 'tableColumnClass',
    standalone: true,
})
export class TableColumnClassPipe implements PipeTransform {
    transform({
        column,
        isTableLocked,
        isGroup,
        isEmptyTable,
        isGroupAlignedRight,
        isColumnAlignedRight,
        isTableColumnInnerClass,
        hasLabelTop,
    }: {
        column: ITableColumn;
        isTableLocked: boolean;
        isGroup: boolean;
        isEmptyTable: boolean;
        isGroupAlignedRight: boolean;
        isColumnAlignedRight: boolean;
        isTableColumnInnerClass: boolean;
        hasLabelTop: boolean;
    }): object {
        console.log('column', column);
        console.log('isGroup', isGroup);
        console.log('isGroupAlignedRight', isGroupAlignedRight);
        console.log('isColumnAlignedRight', isColumnAlignedRight);

        return isTableColumnInnerClass
            ? {
                  'justify-content-between': !isTableLocked,
                  'justify-content-end':
                      isGroupAlignedRight || isColumnAlignedRight,
                  'position-relative bottom-4': !isTableLocked && hasLabelTop,
                  'h-18': !isTableLocked && !isGroupAlignedRight,
                  'aligned-right':
                      isTableLocked &&
                      (isGroupAlignedRight || isColumnAlignedRight),
              }
            : {
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
                  'flex-column align-items-start mt-auto':
                      isGroup && !isGroupAlignedRight,
                  'align-items-end':
                      !isGroup || (isGroup && isColumnAlignedRight),
                  'disable-text-selection': !isTableLocked,
                  'order-2 m-l-4':
                      (isGroupAlignedRight || isColumnAlignedRight) &&
                      isTableLocked,
                  'cursor-grab': !isTableLocked && !column.isDisabled,
              };
    }
}
