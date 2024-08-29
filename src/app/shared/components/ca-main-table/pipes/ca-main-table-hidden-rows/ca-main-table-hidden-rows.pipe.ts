import { Pipe, PipeTransform } from '@angular/core';
import { ColumnConfig } from '@shared/models/table-models/main-table.model';

@Pipe({
    name: 'caMainTableHiddenRows',
    standalone: true,
})
export class CaMainTableHiddenRowsPipe implements PipeTransform {
    transform(
        columns: ColumnConfig[],
        hideHiddenFields: boolean
    ): ColumnConfig[] {
        if (!hideHiddenFields && columns?.length) {
            return columns.filter((column) => !column.hiddeOnTableReduce);
        }
        return columns;
    }
}
