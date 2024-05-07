import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tableHeadBorder', standalone: true })
export class TableHeadBorderPipe implements PipeTransform {
    transform(gridNameTitle: string, tableHeadTitle: string): boolean {
        const driverTableColumnsCondition =
            gridNameTitle === 'Driver' && tableHeadTitle === 'DRIVER TYPE';

        return driverTableColumnsCondition;
    }
}
