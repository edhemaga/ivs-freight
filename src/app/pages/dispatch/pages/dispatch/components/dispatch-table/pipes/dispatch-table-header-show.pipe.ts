import { Pipe, PipeTransform } from '@angular/core';
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-table-string.enum';
//models
import { DispatchColumn } from '@pages/dispatch/pages/dispatch/components/dispatch-table/models/dispatch-column.model';

@Pipe({
    name: 'dispatchTableHeaderShowPipe',
    standalone: true,
})
export class DispatchTableHeaderShowPipe implements PipeTransform {
    transform<T>(
        title: string,
        columns?: DispatchColumn[],
        checkIsDisplayed?: boolean
    ) {
        if (checkIsDisplayed) {
            switch (title) {
                case DispatchTableStringEnum.NOTE:
                    return !columns[17]?.hidden;
                case DispatchTableStringEnum.DISPATCHER_1:
                    return !columns[16]?.hidden;
                case DispatchTableStringEnum.PROGRESS:
                    return !columns[14]?.hidden;
                case DispatchTableStringEnum.INSPECTION:
                    return !columns[10]?.hidden;
                case DispatchTableStringEnum.PARKING_1:
                    return !columns[15]?.hidden;
                default:
                    return true;
            }
        } else {
            if (
                title === DispatchTableStringEnum.NOTE ||
                title === DispatchTableStringEnum.DISPATCHER_1 ||
                title === DispatchTableStringEnum.PROGRESS ||
                title === DispatchTableStringEnum.INSPECTION ||
                title === DispatchTableStringEnum.PARKING_1
            ) {
                return true;
            } else false;
        }
    }
}
