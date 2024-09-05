import { Pipe, PipeTransform } from '@angular/core';
import { DispatchTableStringEnum } from '../enums';

@Pipe({
    name: 'dispatchTableInfoText',
    standalone: true,
})
export class DispatchTableInfoTextPipe implements PipeTransform {
    transform(
        type: string,
        count?: number,
        totalCount?: number,
        name?: string
    ) {
        let tableInfoText = '';

        switch (type) {
            case DispatchTableStringEnum.TRUCK:
            case DispatchTableStringEnum.TRAILER:
            case DispatchTableStringEnum.DRIVER:
                tableInfoText = count + ' ' + type;
                if (count !== 1) tableInfoText += 's';
                break;
            case DispatchTableStringEnum.PARKING:
                tableInfoText = count + ' of' + ' ' + totalCount;
                break;
            case DispatchTableStringEnum.BOARD_2:
                tableInfoText += name;
                break;
            default:
                break;
        }

        tableInfoText = tableInfoText.toUpperCase();

        return tableInfoText;
    }
}
