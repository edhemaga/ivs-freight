export interface TableHeadRowsData {
    tableData: any[];
    pinedColumns?: any[];
    notPinedColumns?: any;
    notPinedMaxWidth?: any[];
    locked?: boolean;
    reordering?: boolean;
    resizing?: boolean;
    resizeHitLimit?: number;
    resizeIsPined?: boolean;
    viewDataLength?: number;
    mySelection?: any[];
    selectableRow?: any[];
}
