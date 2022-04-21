import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

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
  private rowsSelected = new BehaviorSubject<any>([]);
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

  constructor() {}

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
