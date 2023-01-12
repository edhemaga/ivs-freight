import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-table-modal',
    templateUrl: './table-modal.component.html',
    styleUrls: ['./table-modal.component.scss'],
})
export class TableModalComponent implements OnInit, OnChanges {
    @Input() columns: any[];
    @Input() viewData: any[];
    @Input() midSectionWidth: number;
    @Input() formGroup: FormGroup;

    tableFixedColumns: any[] = [];
    tableScrollableColumns: any[] = [];
    tableActionColumns: any[] = [];

    constructor() {}

    ngOnInit(): void {
        this.setHeadColumns();
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.columns && !changes?.columns?.firstChange) {
            this.columns = changes.columns.currentValue;

            this.setHeadColumns();
        }
    }

    setHeadColumns() {
        this.tableFixedColumns = [];
        this.tableScrollableColumns = [];
        this.tableActionColumns = [];

        this.columns.map((column) => {
            if (column.isPined && !column.hidden) {
                this.tableFixedColumns.push({
                    ...column,
                    formControl: this.formGroup.get(column.formControlName),
                    columnFocusId: '',
                });
            }

            if (!column.isPined && !column.isAction && !column.hidden) {
                this.tableScrollableColumns.push({
                    ...column,
                    formControl: this.formGroup.get(column.formControlName),
                    columnFocusId: '',
                });
            }

            if (column.isAction && !column.hidden) {
                this.tableActionColumns.push(column);
            }
        });
    }

    onFocusInput(column: any, i: number, j: number) {
        column.columnFocusId = column.title + ' ' + i + ' ' + j;
    }

    // Reorder
    onReorder(event: CdkDragDrop<any>) {
        // let previousIndex: number = null,
        //     currentIndex: number = null;

        // this.columns.map((c, i) => { 
        //     if (this.notPinedColumns[event.previousIndex].field === c.field) {
        //         previousIndex = i;
        //     }

        //     if (this.notPinedColumns[event.currentIndex].field === c.field) {
        //         currentIndex = i;
        //     }
        // });

        // let column: any[] = this.columns.splice(previousIndex, 1);

        // this.columns.splice(currentIndex, 0, column[0]);

        // localStorage.setItem(
        //     `table-${this.tableConfigurationType}-Configuration`,
        //     JSON.stringify(this.columns)
        // );

        // this.tableService.sendColumnsOrder({ columnsOrder: this.columns });

        // this.setVisibleColumns();
    }
}
