export interface GridColumn {
    avatar: null | string;
    disabled: boolean;
    export: boolean;
    field: string;
    filter: string;
    filterable: boolean;
    hidden: boolean;
    hoverTemplate: null | string;
    index: number;
    isActionColumn: boolean;
    isNumeric: boolean;
    isPined: boolean;
    isSelectColumn: boolean;
    name: string;
    ngTemplate: string;
    progress: null | string;
    resizable: boolean;
    sortable: boolean;
    tableHeadTitle: string;
    title: string;
    width: number;
}
