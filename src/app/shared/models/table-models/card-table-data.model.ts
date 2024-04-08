import { CardDetails } from '../card-models/card-table-data.model';
import { TableColumnConfig } from './table-column-config.model';

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
