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
  private toaggleColumn = new BehaviorSubject<any>([]);
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

  constructor() {}

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
