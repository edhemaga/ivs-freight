import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'tableDoubleHeadHeight', standalone: true })
export class TableDoubleHeadHeightPipe implements PipeTransform {
    transform(gridNameTitle: string): boolean {
        return (
            gridNameTitle === 'Contact' ||
            gridNameTitle === 'PM' ||
            gridNameTitle === 'Truck' ||
            gridNameTitle === 'Repair' ||
            gridNameTitle === 'Driver' ||
            gridNameTitle === 'Customer' ||
            gridNameTitle === 'Trailer'
        );
    }
}
