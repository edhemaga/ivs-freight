import { CardDetails } from '../../../../../shared/models/card-table-data.model';

export interface DataForCardsAndTables {
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

export interface TableColumnConfig {
    avatar: null | string;
    disabled: boolean;
    export: boolean;
    field: string;
    filter: string;
    filterable: boolean;
    hidden: boolean;
    hoverTemplate: any;
    index: number;
    isActionColumn: boolean;
    isNumeric: boolean;
    isPined: boolean;
    isSelectColumn: boolean;
    link: {
        routerLinkStart: string;
        routerLinkEnd: string;
    };
    minWidth: number;
    name: string;
    ngTemplate: string;
    progress: any;
    resizable: boolean;
    sortName: string;
    sortable: boolean;
    tableHeadTitle: string;
    title: string;
    width: number;
}
