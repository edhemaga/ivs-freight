import { CardTableData } from '@shared/models/table-models/card-table-data.model';

export interface TableToolbarActions {
    action: string;
    tabData?: CardTableData;
    mode?: string;
}
