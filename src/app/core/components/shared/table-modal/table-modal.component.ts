import { CdkDragDrop } from '@angular/cdk/drag-drop';
import {
    Component,
    Input,
    OnInit,
    OnChanges,
    SimpleChanges,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { OnDestroy } from '@angular/core';

@Component({
    selector: 'app-table-modal',
    templateUrl: './table-modal.component.html',
    styleUrls: ['./table-modal.component.scss'],
})
export class TableModalComponent implements OnInit, OnChanges, OnDestroy {
    @Input() columns: any[];
    @Input() viewData: any[];
    @Input() midSectionWidth: number;
    @Input() modalScrollStyleOptions: any;
    @Input() formGroup: FormGroup;

    tableFixedColumns: any[] = [];
    tableScrollableColumns: any[] = [];
    tableActionColumns: any[] = [];

    constructor() {}

    // --------------------------------NgOnInit---------------------------------
    ngOnInit(): void {
        this.setHeadColumns();
    }

    // --------------------------------NgOnChanges---------------------------------
    ngOnChanges(changes: SimpleChanges): void {
        if (changes?.columns && !changes?.columns?.firstChange) {
            this.columns = changes.columns.currentValue;

            this.setHeadColumns();
        }
    }

    // Set Head Columns
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

    // Focus Input
    onFocusInput(column: any, i: number, j: number, tableSections: string) {
        let tableColumns = [];
        // FOCUS ON CURRENT SELECTED INPUT
        tableSections === 'scrollable'
            ? (tableColumns = this.tableScrollableColumns)
            : (tableColumns = this.tableFixedColumns);

        tableColumns = tableColumns.map((c) => {
            if (c.title === column.title) {
                c.columnFocusId =
                    c.title + ' ' + i + ' ' + j + ' ' + tableSections;
            } else {
                c.columnFocusId = '';
            }

            return c;
        });

        tableSections === 'scrollable'
            ? (this.tableScrollableColumns = [...tableColumns])
            : (this.tableFixedColumns = [...tableColumns]);

        // REMOVE FOCUS FROME PREVIOUS INPUT
        tableSections === 'scrollable'
            ? (tableColumns = this.tableFixedColumns)
            : (tableColumns = this.tableScrollableColumns);

        tableColumns = tableColumns.map((c) => {
            c.columnFocusId = '';

            return c;
        });

        tableSections === 'scrollable'
            ? (this.tableFixedColumns = [...tableColumns])
            : (this.tableScrollableColumns = [...tableColumns]);
    }

    // Reorder
    onReorder(event: CdkDragDrop<any>) {
        let previousIndex: number = null,
            currentIndex: number = null;

        this.columns.map((c, i) => {
            if (
                this.tableScrollableColumns[event.previousIndex].field ===
                c.field
            ) {
                previousIndex = i;
            }

            if (
                this.tableScrollableColumns[event.currentIndex].field ===
                c.field
            ) {
                currentIndex = i;
            }
        });

        let column: any[] = this.columns.splice(previousIndex, 1);

        this.columns.splice(currentIndex, 0, column[0]);

        this.setHeadColumns();
    }

    // Horizontal Scroll
    onHorizontalScroll(scrollEvent: any) {
        if (scrollEvent.eventAction === 'scrolling') {
            document
                .querySelectorAll('#table-modal-scroll-columns-container')
                .forEach((el) => {
                    el.scrollLeft = scrollEvent.scrollPosition;
                });
        }
    }

    // Delete Row
    onDeleteRow(index: number) {
        this.viewData.splice(index, 1);
    }

    // --------------------------------NgOnDestroy---------------------------------
    ngOnDestroy() {}
}
