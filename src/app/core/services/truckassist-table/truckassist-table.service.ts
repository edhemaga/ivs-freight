import { Injectable } from '@angular/core';
import {
    BrokerResponse,
    DriverResponse,
    ShipperResponse,
    TableConfigResponse,
    TableConfigService,
    TableType,
    UpdateTableConfigCommand,
} from 'appcoretruckassist';
import { BehaviorSubject, Observable, of } from 'rxjs';
import {
    Column,
    ColumnWidthData,
} from '../../components/shared/model/card-table-data.model';
import { AllTableModal } from '../../components/customer/customer.modal';

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
    private toaggleColumn = new BehaviorSubject<Column>(null);
    public currentToaggleColumn = this.toaggleColumn.asObservable();

    /* Set Column Table Width */
    private columnWidth = new BehaviorSubject<{
        columns: ColumnWidthData;
        event: { width: number; index: number };
    }>(null);
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
    /* Reset Columns */

    // Flip cards
    private flipCards = new BehaviorSubject<boolean>(false);
    public isFlipedAllCards = this.flipCards.asObservable();

    /* Delete Selected Rows */
    private deleteSelectedRows = new BehaviorSubject<
        | ShipperResponse[]
        | BrokerResponse[]
        | DriverResponse[]
        | BrokerResponse[]
    >([]);
    public currentDeleteSelectedRows = this.deleteSelectedRows.asObservable();

    /* Table Action Animation */
    private actionAnimation = new BehaviorSubject<AllTableModal>(null);
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

    /* Send Chips For Highlight Search To Table */
    private chipsForHighlightSearchToTable = new BehaviorSubject<string[]>([]);
    public currentChipsForHighlightSearchToTable =
        this.chipsForHighlightSearchToTable.asObservable();

    /* Set Filter */
    private setTableFilter = new BehaviorSubject<any>(null);
    public currentSetTableFilter = this.setTableFilter.asObservable();

    /* Set Table Width */
    private setTableWidth = new BehaviorSubject<number>(null);
    public currentSetTableWidth = this.setTableWidth.asObservable();

    /* Is Scroll Showning */
    private scrollShownig = new BehaviorSubject<boolean>(false);
    public isScrollShownig = this.scrollShownig.asObservable();

    /* Reset Horizontal Scroll */
    private scrollReseting = new BehaviorSubject<boolean>(false);
    public isScrollReseting = this.scrollReseting.asObservable();

    constructor(private tableColumnsConfigService: TableConfigService) {}

    // ------------------------------ Table Back Service Methods --------------------------------
    sendTableConfig(tableConfig: UpdateTableConfigCommand): Observable<object> {
        return this.tableColumnsConfigService.apiTableconfigPut(tableConfig);
    }

    getTableConfig(tableType: number): Observable<TableConfigResponse> {
        return this.tableColumnsConfigService.apiTableconfigTableTypeGet(
            tableType
        );
    }

    public sendAllCardsFlipped(flipCards: boolean): void {
        this.flipCards.next(flipCards);
    }

    // ------------------------------ Table Custom Service Methods --------------------------------

    /* Reset Horizontal Scroll */
    public sendIsScrollReseting(isScrollReseting: boolean) {
        this.scrollReseting.next(isScrollReseting);
    }

    /* Is Scroll Showning */
    public sendIsScrollShownig(isScrollShowing: boolean) {
        this.scrollShownig.next(isScrollShowing);
    }

    /* Set Table Width */
    public sendCurrentSetTableWidth(width: number) {
        this.setTableWidth.next(width);
    }

    /* Set Filter  */
    public sendCurrentSetTableFilter(filter: any) {
        this.setTableFilter.next(filter);
    }

    /*  Search  */
    public sendCurrentSearchTableData(search: any) {
        this.searchTableData.next(search);
    }

    /* Send Chips For Highlight Search To Table */
    public sendChipsForHighlightSearchToTable(chip: string[]) {
        this.chipsForHighlightSearchToTable.next(chip);
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
