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
        isTableColumnInnerClass,
        hasLabelTop,
        isPinnedRight,
    }: {
        column: ITableColumn;
        isTableLocked: boolean;
        isGroup: boolean;
        isEmptyTable: boolean;
        isGroupAlignedRight: boolean;
        isTableColumnInnerClass: boolean;
        hasLabelTop: boolean;
        isPinnedRight: boolean;
    }): object {
        return isTableColumnInnerClass
            ? {
                  'justify-content-between': !isTableLocked,
                  'justify-content-end': isGroupAlignedRight,
                  'position-relative bottom-4': !isTableLocked && hasLabelTop,
                  'h-18': !isTableLocked && !isGroupAlignedRight,
                  'aligned-right': isTableLocked && isGroupAlignedRight,
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
                  'align-items-end': !isGroup,
                  'disable-text-selection': !isTableLocked,
                  'order-2 m-l-4': isGroupAlignedRight && isTableLocked,
                  'cursor-grab': !isTableLocked && !column.isDisabled,
                  'justify-content-center': isPinnedRight,
              };
    }
}
