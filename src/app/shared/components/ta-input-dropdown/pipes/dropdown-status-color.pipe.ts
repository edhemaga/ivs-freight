import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dropdownLoadStatusColor',
    standalone: true,
})
export class DropdownStatusPipe implements PipeTransform {
    transform(
        status: string,
        isTextColor?: boolean
    ): { background?: string; color?: string } {
        const statusGreyColorCondition = ['Booked', 'Unassigned'].includes(
            status
        );
        const statusTurquoiseColorCondition = status === 'Assigned';
        const statusBlueColorCondition = status === 'Dispatched';
        const statusGreenColorCondition = status === 'Loaded';
        const statusYellowColorCondition = status === 'Delivered';
        const statusRedColorCondition = status === 'Cancelled';

        if (isTextColor)
            return {
                color: '#ffffff',
            };

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
        } else if (statusYellowColorCondition) {
            return {
                background: '#FF980099',
            };
        } else if (statusRedColorCondition) {
            return {
                background: '#D8030099',
            };
        }
    }
}
