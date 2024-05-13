import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tableDoubleHead', standalone: true })
export class TableDoubleHeadPipe implements PipeTransform {
    transform(column: any, tableData: any, isOuterCondition: boolean): boolean {
        const { gridNameTitle } = tableData;
        const { tableHeadTitle, groupName } = column;

        if (isOuterCondition) {
            const contactsTableColumnsCondition =
                gridNameTitle === 'Contact' &&
                (tableHeadTitle === 'PRIMARY ' || tableHeadTitle === 'PRIMARY');

            const pmTableColumnsCondition =
                gridNameTitle === 'PM' && tableHeadTitle === 'REPAIR SHOP';

            const driverTableColumnsCondition =
                gridNameTitle === 'Driver' &&
                (tableHeadTitle === 'TYPE ' ||
                    tableHeadTitle === 'NAME ' ||
                    tableHeadTitle === 'NUMBER ' ||
                    tableHeadTitle === 'NUMBER' ||
                    tableHeadTitle === 'ISSUED' ||
                    tableHeadTitle === 'GENERAL' ||
                    tableHeadTitle === 'TRUCK' ||
                    tableHeadTitle === 'NAME  ' ||
                    tableHeadTitle === 'TERM');

            const truckTableColumnsCondition =
                gridNameTitle === 'Truck' &&
                (tableHeadTitle === ' NAME' ||
                    tableHeadTitle === 'Registration Detail ' ||
                    tableHeadTitle === 'FHWA Inspection ' ||
                    tableHeadTitle === 'DRIVER' ||
                    tableHeadTitle === 'GROSS' ||
                    tableHeadTitle === 'TERM' ||
                    tableHeadTitle === 'NUMBER  ' ||
                    tableHeadTitle === ' NUMBER' ||
                    tableHeadTitle === 'PRICE' ||
                    tableHeadTitle === 'TYPE ' ||
                    tableHeadTitle === 'TRANSPONDER' ||
                    tableHeadTitle === 'FRONT' ||
                    tableHeadTitle === ' MODEL' ||
                    tableHeadTitle === 'MODEL ');

            const repairTableColumnsCondition =
                gridNameTitle === 'Repair' &&
                (tableHeadTitle === 'NAME   ' ||
                    tableHeadTitle === 'NUMBER   ' ||
                    tableHeadTitle === 'DESCRIPTION');
            if (
                contactsTableColumnsCondition ||
                pmTableColumnsCondition ||
                driverTableColumnsCondition ||
                truckTableColumnsCondition ||
                repairTableColumnsCondition
            ) {
                return true;
            }

            return;
        } else {
            const contactsTableColumnsCondition =
                gridNameTitle !== 'Contact' ||
                (tableHeadTitle !== 'PRIMARY ' && tableHeadTitle !== 'PRIMARY');

            const pmTableColumnsCondition =
                gridNameTitle !== 'PM' || tableHeadTitle !== 'REPAIR SHOP';

            const driverTableColumnsCondition =
                gridNameTitle !== 'Driver' ||
                (tableHeadTitle !== 'TYPE ' &&
                    tableHeadTitle !== 'NAME ' &&
                    tableHeadTitle !== 'NUMBER ' &&
                    tableHeadTitle !== 'NUMBER' &&
                    tableHeadTitle !== 'ISSUED' &&
                    tableHeadTitle !== 'GENERAL' &&
                    tableHeadTitle !== 'TRUCK' &&
                    tableHeadTitle !== 'NAME  ' &&
                    tableHeadTitle !== 'TERM');

            const repairTableColumnsCondition =
                gridNameTitle !== 'Repair' ||
                (tableHeadTitle !== 'NAME   ' &&
                    tableHeadTitle !== 'NUMBER   ' &&
                    tableHeadTitle !== 'DESCRIPTION');

            const truckTableColumnsCondition =
                gridNameTitle !== 'Truck' ||
                (tableHeadTitle !== ' NAME' &&
                    tableHeadTitle !== 'Registration Detail ' &&
                    tableHeadTitle !== 'FHWA Inspection ' &&
                    tableHeadTitle !== 'DRIVER' &&
                    tableHeadTitle !== 'GROSS' &&
                    tableHeadTitle !== 'TERM' &&
                    tableHeadTitle !== 'NUMBER  ' &&
                    tableHeadTitle !== 'PRICE' &&
                    tableHeadTitle !== ' NUMBER' &&
                    tableHeadTitle !== 'TYPE ' &&
                    tableHeadTitle !== 'TRANSPONDER' &&
                    tableHeadTitle !== 'FRONT' &&
                    tableHeadTitle !== ' MODEL' &&
                    tableHeadTitle !== 'MODEL ');

            return (
                contactsTableColumnsCondition &&
                pmTableColumnsCondition &&
                driverTableColumnsCondition &&
                repairTableColumnsCondition &&
                truckTableColumnsCondition &&
                repairTableColumnsCondition
            );
        }
    }
}
