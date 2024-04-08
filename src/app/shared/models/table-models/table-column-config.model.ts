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
