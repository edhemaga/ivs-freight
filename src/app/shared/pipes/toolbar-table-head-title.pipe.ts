import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'toolbarTableHeadTitlePipe', standalone: true })
export class ToolbarTableHeadTitlePipe implements PipeTransform {
    transform(column: any, tableData: any[]): boolean {
        if (
            (tableData[0]?.title !== 'Contacts' ||
                (tableData[0]?.title === 'Contacts' &&
                    column.name !== 'PHONE' &&
                    column.name !== 'EMAIL')) &&
            (tableData[0]?.gridNameTitle !== 'PM' ||
                (tableData[0]?.gridNameTitle === 'PM' &&
                    column.tableHeadTitle !== 'REPAIR SHOP')) &&
            tableData[0]?.gridNameTitle === 'Truck' &&
            ![
                'Owner Details',
                'Registration Detail',
                'FHWA Inspection',
                'Assigned To',
                'Purchase Detail',
                'Title',
                'Fuel Detail',
                'Wheel Detail',
                'Toll Device',
            ].includes(column?.groupName?.trim())
        ) {
            return true;
        } else {
            return false;
        }
    }
}
