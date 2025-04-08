import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tableGroupLabelIndex',
    standalone: true,
})
export class TableGroupLabelIndexPipe implements PipeTransform {
    transform(columns: { isChecked: boolean }[]): number {
        return columns?.findIndex((col) => col.isChecked) ?? -1;
    }
}
