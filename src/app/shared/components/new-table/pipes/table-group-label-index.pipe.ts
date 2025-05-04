import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tableGroupLabelIndex',
    standalone: true,
})
export class TableGroupLabelIndexPipe implements PipeTransform {
    transform({
        columns,
        isLastCheckedIndex,
    }: {
        columns: { isChecked: boolean }[];
        isLastCheckedIndex: boolean;
    }): number {
        if (!columns) return -1;

        if (isLastCheckedIndex) {
            const reversedIndex = [...columns]
                .reverse()
                .findIndex((col) => col.isChecked);

            return reversedIndex === -1
                ? -1
                : columns.length - 1 - reversedIndex;
        }

        return columns?.findIndex((col) => col.isChecked) ?? -1;
    }
}
