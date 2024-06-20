import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dropdownLoadStatusColor',
    standalone: true,
})
export class DropdownStatusPipe implements PipeTransform {
    transform(status: string): any {
        const statusGreyColorCondition = ['Booked', 'Unassigned'].includes(
            status
        );
        const statusTurquoiseColorCondition = status === 'Assigned';
        const statusBlueColorCondition = status === 'Dispatched';
        const statusGreenColorCondition = status === 'Loaded';

        if (statusGreyColorCondition) {
            return {
                color: '#6C6C6C99',
            };
        } else if (statusTurquoiseColorCondition) {
            return {
                color: '#00849699',
            };
        } else if (statusBlueColorCondition) {
            return {
                color: '#3074D399',
            };
        } else if (statusGreenColorCondition) {
            return {
                color: '#26A69099',
            };
        }
    }
}
