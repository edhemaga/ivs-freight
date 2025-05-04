import { ITableColumn } from '@shared/components/new-table/interfaces';

export class TableScrollHelper {
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
