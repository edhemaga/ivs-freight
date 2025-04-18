import { Pipe, PipeTransform } from '@angular/core';

// interfaces
import { ITableColumn } from '@shared/components/new-table/interface';

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
        isAlignedRight,
        isTableColumnInnerClass,
        hasLabelTop,
    }: {
        column: ITableColumn;
        isTableLocked: boolean;
        isGroup: boolean;
        isEmptyTable: boolean;
        isAlignedRight: boolean;
        isTableColumnInnerClass: boolean;
        hasLabelTop: boolean;
    }): object {
        return isTableColumnInnerClass
            ? {
                  'justify-content-between': !isTableLocked,
                  'justify-content-end': isAlignedRight,
                  'position-relative bottom-4': !isTableLocked && hasLabelTop,
                  'h-18': !isTableLocked && !isAlignedRight,
                  'aligned-right': isTableLocked && isAlignedRight,
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
                      isGroup && !isAlignedRight,
                  'align-items-end': !isGroup,
                  'disable-text-selection': !isTableLocked,
                  'order-2 m-l-4': isAlignedRight && isTableLocked,
                  'cursor-grab': !isTableLocked && !column.isDisabled,
              };
    }
}
