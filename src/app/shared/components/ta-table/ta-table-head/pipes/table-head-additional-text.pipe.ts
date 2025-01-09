import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tableHeadAdditionalText', standalone: true })
export class TableHeadAdditionalTextPipe implements PipeTransform {
    transform(gridNameTitle: string, tableHeadTitle: string): string {
        // mo.
        const monthsCondition =
            (gridNameTitle === 'Driver' ||
                gridNameTitle === 'Truck' ||
                gridNameTitle === 'Trailer') &&
            (tableHeadTitle === 'TERM' || tableHeadTitle === 'TERM ');

        // d.
        const daysCondition =
            gridNameTitle === 'Customer' && tableHeadTitle === 'TERM';

        // mi
        const milesCondition =
            gridNameTitle === 'Repair' && tableHeadTitle === 'ODO';

        switch (true) {
            case monthsCondition:
                return 'mo.';
            case daysCondition:
                return 'd.';
            case milesCondition:
                return 'mi';
            default:
                return '';
        }
    }
}
