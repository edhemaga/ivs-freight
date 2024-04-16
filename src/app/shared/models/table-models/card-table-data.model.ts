import { CardDetails } from '@shared/models/card-models/card-table-data.model';
import { TableColumnConfig } from '@shared/models/table-models/table-column-config.model';

export interface CardTableData {
    data?: CardDetails[];
    extended?: boolean;
    field: string;
    gridColumns?: TableColumnConfig[];
    gridNameTitle?: string;
    isActive?: boolean;
    length?: number;
    stateName?: string;
    tableConfiguration?: string;
    title: string;
}
