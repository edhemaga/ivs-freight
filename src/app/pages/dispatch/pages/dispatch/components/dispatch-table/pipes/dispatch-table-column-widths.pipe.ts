import { Pipe, PipeTransform } from '@angular/core';

// Models
import { DispatchResizedColumnsModel } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models';

// Constants
import { DispatchTableColumnWidthsConstants } from '@pages/dispatch/pages/dispatch/components/dispatch-table/utils/constants';

// Enums
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums';

@Pipe({
    name: 'dispatchTableColumnWidths',
})
export class DispatchTableColumnWidthsPipe implements PipeTransform {
    transform(
        columnWidths: DispatchResizedColumnsModel,
        columnName: string,
        hasAdditionalField?: boolean,
        noDataColumnIndex?: number
    ) {
        let columnWidth;

        if (columnName) {
            columnWidth = columnWidths?.[columnName]
                ? columnWidths[columnName]
                : hasAdditionalField
                ? DispatchTableColumnWidthsConstants
                      .DispatchColumnWidthsExpanded[columnName]
                : DispatchTableColumnWidthsConstants.DispatchColumnWidths[
                      columnName
                  ];

            if (
                columnName === DispatchTableStringEnum.NOTE_3 &&
                !hasAdditionalField
            )
                columnWidth = 36;
        } else {
            switch (noDataColumnIndex) {
                case 0:
                    columnWidth =
                        columnWidths[DispatchTableStringEnum.TRUCK_NUMBER];
                    break;
                case 1:
                    columnWidth =
                        columnWidths[DispatchTableStringEnum.TRAILER_NUMBER];
                    break;
                case 2:
                    columnWidth =
                        columnWidths[DispatchTableStringEnum.FIRST_NAME];
                    break;
                case 3:
                case 9:
                case 11:
                    columnWidth = 36;
                    break;
                case 4:
                    columnWidth = columnWidths[DispatchTableStringEnum.CITY];
                    break;
                case 5:
                    columnWidth =
                        columnWidths[DispatchTableStringEnum.STATUS_2];
                    break;
                case 6:
                    columnWidth =
                        columnWidths[DispatchTableStringEnum.PICKUP_DELIVERY_3];
                    break;
                case 7:
                    columnWidth =
                        columnWidths[DispatchTableStringEnum.PROGRESS_3];
                    break;
                case 8:
                    columnWidth =
                        columnWidths[DispatchTableStringEnum.SLOT_NUMBER];
                    break;
                case 10:
                    columnWidth = columnWidths[DispatchTableStringEnum.NOTE_3];
                    break;
            }
        }

        return {
            width: columnWidth + 'px',
            'min-width': columnWidth + 'px',
            'max-width': columnWidth + 'px',
        };
    }
}
