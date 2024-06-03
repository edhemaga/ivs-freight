import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tableDoubleHead', standalone: true })
export class TableDoubleHeadPipe implements PipeTransform {
    transform(column: any, tableData: any, isOuterCondition: boolean): boolean {
        const { tableHeadTitle, index } = column;
        const { gridNameTitle } = tableData;

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
                    tableHeadTitle === 'TERM ' ||
                    index === 12);

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

            const trailerTableColumnsCondition =
                gridNameTitle === 'Trailer' &&
                (tableHeadTitle === 'EMPTY' ||
                    tableHeadTitle === 'FHWA Inspection ' ||
                    tableHeadTitle === 'DRIVER' ||
                    tableHeadTitle === 'NUMBER  ' ||
                    tableHeadTitle === ' NUMBER' ||
                    tableHeadTitle === 'PRICE' ||
                    tableHeadTitle === 'TYPE ' ||
                    tableHeadTitle === 'TERM');
            const repairTableColumnsCondition =
                gridNameTitle === 'Repair' &&
                (tableHeadTitle === 'NAME   ' ||
                    tableHeadTitle === 'NUMBER   ' ||
                    tableHeadTitle === 'DESCRIPTION');
            const brokerTableColumnsCondition =
                gridNameTitle === 'Customer' &&
                (tableHeadTitle === 'PHYSICAL' ||
                    tableHeadTitle === 'CREDIT LIMIT');

            if (
                contactsTableColumnsCondition ||
                pmTableColumnsCondition ||
                driverTableColumnsCondition ||
                truckTableColumnsCondition ||
                repairTableColumnsCondition ||
                brokerTableColumnsCondition ||
                trailerTableColumnsCondition
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
                    tableHeadTitle !== 'TERM ' &&
                    index !== 12);

            const repairTableColumnsCondition =
                gridNameTitle !== 'Repair' ||
                (tableHeadTitle !== 'NAME   ' &&
                    tableHeadTitle !== 'NUMBER   ' &&
                    tableHeadTitle !== 'DESCRIPTION');

            const brokerTableColumnsCondition =
                gridNameTitle !== 'Customer' ||
                (tableHeadTitle !== 'PHYSICAL' &&
                    tableHeadTitle !== 'CREDIT LIMIT');

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
            const TrailerTableColumnsCondition =
                gridNameTitle !== 'Trailer' ||
                (tableHeadTitle !== 'EMPTY' &&
                    tableHeadTitle !== 'FHWA Inspection ' &&
                    tableHeadTitle !== 'DRIVER' &&
                    tableHeadTitle !== 'NUMBER  ' &&
                    tableHeadTitle !== 'PRICE' &&
                    tableHeadTitle !== ' NUMBER' &&
                    tableHeadTitle !== 'TYPE ' &&
                    tableHeadTitle !== 'TERM');
            return (
                contactsTableColumnsCondition &&
                pmTableColumnsCondition &&
                driverTableColumnsCondition &&
                repairTableColumnsCondition &&
                brokerTableColumnsCondition &&
                truckTableColumnsCondition &&
                repairTableColumnsCondition &&
                TrailerTableColumnsCondition
            );
        }
    }
}
