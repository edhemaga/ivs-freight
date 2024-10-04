import { Pipe, PipeTransform } from '@angular/core';

// Enums
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums';

// Models
import {
    DispatchColumn,
    DispatchResizedColumnsModel,
} from '@pages/dispatch/pages/dispatch/components/dispatch-table/models';

@Pipe({
    name: 'dispatchTableFooterWidths',
})
export class DispatchTableFooterWidthsPipe implements PipeTransform {
    transform(
        column: DispatchColumn,
        columnWidths: DispatchResizedColumnsModel
    ) {
        let columnWidth;

        const columnFieldName =
            column.field === DispatchTableStringEnum.PICKUP_DELIVERY_2
                ? DispatchTableStringEnum.PICKUP_DELIVERY_3
                : column.field === DispatchTableStringEnum.PROGRESS_2
                ? DispatchTableStringEnum.PROGRESS_3
                : column.field;

        if (columnWidths[columnFieldName])
            columnWidth = columnWidths[columnFieldName];
        else {
            columnWidth =
                column.field === DispatchTableStringEnum.PICKUP_DELIVERY_2
                    ? 342
                    : column.field === DispatchTableStringEnum.PROGRESS_2
                    ? 228
                    : column.field === DispatchTableStringEnum.STATUS_2
                    ? 142
                    : column.field === DispatchTableStringEnum.CITY
                    ? 162
                    : 36;
        }

        return {
            width: columnWidth + 'px',
            'min-width': columnWidth + 'px',
            'max-width': columnWidth + 'px',
        };
    }
}
