import {
   TableColumnDefinitionAccount,
   TableData,
   TableMainOptions,
} from './../models/accounting-table';
import { Component, Input, OnInit } from '@angular/core';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
   selector: 'app-accounting-tables',
   templateUrl: './accounting-tables.component.html',
   styleUrls: ['./accounting-tables.component.scss'],
})
export class AccountingTablesComponent implements OnInit {
   @Input() dataItem: TableData[];
   @Input() tableName: string;
   @Input() columns: TableColumnDefinitionAccount[];
   @Input() options: TableMainOptions;
   tableCurrentIndex: number;
   removeType: any = {
      Bonuses: 'Bonus',
      Deductions: 'Deduction',
      Credits: 'Credit',
   };

   constructor() {}

   ngOnInit(): void {}

   openAddNew() {}

   openEdit(itemData) {}

   deleteItem(indx) {}

   onDrop(event: CdkDragDrop<string[]>) {
      this.tableCurrentIndex = event.currentIndex;
      moveItemInArray(this.dataItem, event.previousIndex, event.currentIndex);
   }
}
