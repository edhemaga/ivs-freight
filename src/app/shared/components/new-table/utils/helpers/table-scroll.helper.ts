import { ITableColumn } from '@shared/components/new-table/interface';

export class TableScrollHelper {
    static countCheckedColumns(columns: ITableColumn[]): number {
        let count = 0;

        columns.forEach((col) => {
            if (col.isChecked) count++;

            if (col.columns?.length)
                count += this.countCheckedColumns(col.columns);
        });

        return count;
    }

    static getTotalColumnWidth(columns: ITableColumn[]): number {
        let width = 0;

        columns.forEach((col) => {
            if (col.width) width += col.width;
            if (col.isAlignedRight) width += 7;

            if (col.columns?.length)
                width += this.getTotalColumnWidth(col.columns);
        });

        return width;
    }
}
