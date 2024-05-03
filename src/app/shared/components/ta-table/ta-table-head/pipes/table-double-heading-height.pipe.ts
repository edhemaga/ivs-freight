import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tableDoubleHeadingHeight', standalone: true })
export class TableDoubleHeadingHeightPipe implements PipeTransform {
    transform(gridNameTitle: string): boolean {
        return (
            gridNameTitle === 'Contact' ||
            gridNameTitle === 'PM' ||
            gridNameTitle === 'Truck' ||
            gridNameTitle === 'Repair' ||
            gridNameTitle === 'Driver'
        );
    }
}
