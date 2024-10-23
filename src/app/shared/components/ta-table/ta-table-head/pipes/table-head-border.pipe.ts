import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tableHeadBorder', standalone: true })
export class TableHeadBorderPipe implements PipeTransform {
    transform(gridNameTitle: string, tableHeadTitle: string): boolean {
        const driverTableColumnsCondition =
            gridNameTitle === 'Driver' &&
            (tableHeadTitle === 'DRIVER TYPE' ||
                tableHeadTitle === 'OFF DUTY LOCATION' ||
                tableHeadTitle === 'TWIC EXPIRATION' ||
                tableHeadTitle === 'MEDICAL EXP' ||
                tableHeadTitle === 'HIRED' ||
                tableHeadTitle === 'INVITED');

        const brokerTableColumnsCondition =
            gridNameTitle === 'Customer' && tableHeadTitle === 'LOAD';

        return driverTableColumnsCondition || brokerTableColumnsCondition;
    }
}
