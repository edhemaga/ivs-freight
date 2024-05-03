import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tableDoubleHeading', standalone: true })
export class TableDoubleHeadingPipe implements PipeTransform {
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

            if (
                contactsTableColumnsCondition ||
                pmTableColumnsCondition ||
                driverTableColumnsCondition
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
                !['Unit', 'Item Detail', 'Shop Detail'].includes(
                    groupName?.trim()
                );

            const excludedGroupNames = [
                'Owner Details',
                'Registration Detail',
                'FHWA Inspection',
                'Assigned To',
                'Purchase Detail',
                'Title',
                'Fuel Detail',
                'Wheel Detail',
                'Toll Device',
            ];

            return (
                contactsTableColumnsCondition &&
                pmTableColumnsCondition &&
                driverTableColumnsCondition &&
                repairTableColumnsCondition &&
                !excludedGroupNames.includes(groupName?.trim())
            );
        }
    }
}
