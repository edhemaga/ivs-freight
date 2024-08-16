import { Pipe, PipeTransform } from '@angular/core';
import { DispatchTableStringEnum } from '@pages/dispatch/pages/dispatch/components/dispatch-table/enums/dispatch-table-string.enum';

@Pipe({
    name: 'dispatchTableHeaderShowPipe',
    standalone: true,
})
export class DispatchTableHeaderShowPipe implements PipeTransform {
    transform(title: string, columns?: any) {
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
    }
}
