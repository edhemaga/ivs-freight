import { Injectable } from '@angular/core';
import {
    // CreateTableConfigCommand,
    TableConfigResponse,
    TableConfigService,
    TableType,
} from 'appcoretruckassist';
import { BehaviorSubject, Observable, of } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TruckassistTableService {
    /* Columns Order */
    private columnsOrder = new BehaviorSubject<string>('');
    public currentColumnsOrder = this.columnsOrder.asObservable();

    /* Unlock Table */
    private unlockTable = new BehaviorSubject<any>({});
    public currentUnlockTable = this.unlockTable.asObservable();

    /* Toaggle Table Column */
    private toaggleColumn = new BehaviorSubject<any>(null);
    public currentToaggleColumn = this.toaggleColumn.asObservable();

    /* Set Column Table Width */
    private columnWidth = new BehaviorSubject<any>([]);
    public currentColumnWidth = this.columnWidth.asObservable();

    /* Set Table Selection */
    public rowsSelected = new BehaviorSubject<any>([]);
    public currentRowsSelected = this.rowsSelected.asObservable();

    /* Selected Or Deselected All Rows */
    private selectOrDeselect = new BehaviorSubject<string>('');
    public currentSelectOrDeselect = this.selectOrDeselect.asObservable();

    /* Reset Columns */
    private resetColumns = new BehaviorSubject<boolean>(false);
    public currentResetColumns = this.resetColumns.asObservable();

    /* Scroll */
    private scroll = new BehaviorSubject<number>(0);
    public currentScroll = this.scroll.asObservable();

    /* Showing Scroll */
    private showingScroll = new BehaviorSubject<boolean>(null);
    public currentShowingScroll = this.showingScroll.asObservable();

    /* Delete Selected Rows */
    private deleteSelectedRows = new BehaviorSubject<any>([]);
    public currentDeleteSelectedRows = this.deleteSelectedRows.asObservable();

    /* Table Action Animation */
    private actionAnimation = new BehaviorSubject<any>({});
    public currentActionAnimation = this.actionAnimation.asObservable();

    /* Reset Selected Columns  */
    private resetSelectedColumns = new BehaviorSubject<boolean>(false);
    public currentResetSelectedColumns =
        this.resetSelectedColumns.asObservable();

    /* Switch Select  */
    private toolBarSwitchActive = new BehaviorSubject<any>(null);
    public currentSwitchOptionSelected =
        this.toolBarSwitchActive.asObservable();

    /* Search  */
    private searchTableData = new BehaviorSubject<any>(null);
    public currentSearchTableData = this.searchTableData.asObservable();

    constructor(private tableColumnsConfigService: TableConfigService) {}

    // ------------------------------ Table Back Service Methods --------------------------------

    sendTableConfig(
        tableConfig: any /*CreateTableConfigCommand*/
    ): Observable<object> {
        // return this.tableColumnsConfigService.apiTableconfigPost(tableConfig);
        return of();
    }

    getTableConfig(tableType: TableType): Observable<TableConfigResponse> {
        return this.tableColumnsConfigService.apiTableconfigTableTypeGet(
            tableType
        );
    }

    deleteTableConfig(tableType: TableType): Observable<TableConfigResponse> {
        // return this.tableColumnsConfigService.apiTableconfigTableTypeDelete(tableType);
        return of();
    }

    // ------------------------------ Table Custom Service Methods --------------------------------

    /*  Search  */
    public sendCurrentSearchTableData(search: any) {
        this.searchTableData.next(search);
    }

    /*  Switch Select  */
    public sendCurrentSwitchOptionSelected(option: any) {
        this.toolBarSwitchActive.next(option);
    }

    /* Reset Selected Columns  */
    public sendResetSelectedColumns(reset: boolean) {
        this.resetSelectedColumns.next(reset);
    }

    /* Delete Selected Rows */
    public sendActionAnimation(actionAnimation: any) {
        this.actionAnimation.next(actionAnimation);
    }

    /* Delete Selected Rows */
    public sendDeleteSelectedRows(deleteSelectedRows: any[]) {
        this.deleteSelectedRows.next(deleteSelectedRows);
    }

    /* Showing Scroll */
    public sendShowingScroll(showingScroll: boolean) {
        this.showingScroll.next(showingScroll);
    }

    /* Scroll */
    public sendScroll(scroll: number) {
        this.scroll.next(scroll);
    }

    /* Reset Columns */
    public sendResetColumns(resetColumns: boolean) {
        this.resetColumns.next(resetColumns);
    }

    /* Set Table Selection */
    public sendSelectOrDeselect(selectOrDeselect: string) {
        this.selectOrDeselect.next(selectOrDeselect);
    }

    /* Set Table Selection */
    public sendRowsSelected(rowsSelected: any) {
        this.rowsSelected.next(rowsSelected);
    }

    /* Set Column Table Width */
    public sendColumnWidth(columnWidth: any) {
        this.columnWidth.next(columnWidth);
    }

    /* Columns Order */
    public sendColumnsOrder(columnsOrder: any) {
        this.columnsOrder.next(columnsOrder);
    }

    /* Unlock Table */
    public sendUnlockTable(unlockTable: any) {
        this.unlockTable.next(unlockTable);
    }

    /* Toaggle Table Column */
    public sendToaggleColumn(toaggleColumn: any) {
        this.toaggleColumn.next(toaggleColumn);
    }
}
