import { ResizingEventData } from '@shared/models/table-models/resizing-event-data.model';
import { GridColumn } from '@shared/models/table-models/grid-column.model';

export interface ColumnWidthData {
    columns: GridColumn[];
    event: ResizingEventData[];
}
