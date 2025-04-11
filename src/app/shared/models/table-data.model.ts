import { TableType } from 'appcoretruckassist';

export interface ITableData {
    title?: string;
    field?: string;
    length?: number;
    data?: any;
    extended?: boolean;
    gridNameTitle?: string;
    moneyCountSelected?: boolean;
    stateName?: string;
    tableConfiguration?: TableType;
    isUpperCaseTitle?: boolean;
    isActive?: boolean;
    gridColumns?: any[];
    value?: string | number;
}
