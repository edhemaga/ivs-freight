import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dropdownLoadStatusColor',
    standalone: true,
})
export class DropdownStatusPipe implements PipeTransform {
    transform(status: string): { background: string } {
        const statusGreyColorCondition = ['Booked', 'Unassigned'].includes(
            status
        );
        const statusTurquoiseColorCondition = status === 'Pending';
        const statusBlueColorCondition = status === 'Dispatched';
        const statusGreenColorCondition = status === 'Loaded';

        if (statusGreyColorCondition) {
            return {
                background: '#6C6C6C99',
            };
        } else if (statusTurquoiseColorCondition) {
            return {
                background: '#00849699',
            };
        } else if (statusBlueColorCondition) {
            return {
                background: '#3074D399',
            };
        } else if (statusGreenColorCondition) {
            return {
                background: '#26A69099',
            };
        }
    }
}
